import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI client with required 'aistudio-build' User-Agent
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Models endpoint
app.get('/api/models', (_req: Request, res: Response) => {
  res.json({
    models: [
      {
        id: 'gemini-3.8-flash',
        geminiModel: 'gemini-3.8-flash',
        name: 'Gemini 3.8 Flash',
        badge: 'General & Versatile',
        description: 'Balanced flagship model for general tasks, writing, research, and coding.',
        contextWindow: '1M tokens',
        isDefault: true,
      },
      {
        id: 'gemini-4-argon',
        geminiModel: 'gemini-4-argon',
        name: 'Gemini 4 Argon',
        badge: 'Complex Reasoning',
        description: 'Highest capability for particularly complex STEM problems, architectural design, and deep analysis.',
        contextWindow: '1M tokens',
        isDefault: false,
      },
      {
        id: 'gemini-3.1-flash-lite',
        geminiModel: 'gemini-3.1-flash-lite',
        name: 'Gemini 3.1 Flash Lite',
        badge: 'Ultra Fast',
        description: 'Designed for tasks that should happen fast with near-zero latency and high throughput.',
        contextWindow: '1M tokens',
        isDefault: false,
      },
    ],
  });
});

// Chat completion endpoint with Server-Sent Events (SSE) streaming
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  const {
    messages = [],
    model = 'gemini-3.8-flash',
    systemInstruction,
    enableThinking = false,
    enableWebSearch = false,
    attachments = [],
  } = req.body;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // If AI client is not configured, send a simulated high-quality response
  if (!ai || !apiKey) {
    sendEvent('thinking', { text: 'Analyzing your query and structuring a thoughtful response...\n' });
    await new Promise((r) => setTimeout(r, 400));

    const simulatedAnswer = `Hello! I'm **GenChat**, powered by Gemini.

It appears the \`GEMINI_API_KEY\` environment secret has not been configured in your project yet. 

Once your key is present, I can stream answers on any subject with:
1. **Gemini 3.8 Flash** for versatile multi-turn reasoning and general queries.
2. **Gemini 4 Argon** for particularly complex STEM, math, and architecture problems.
3. **Gemini 3.1 Flash Lite** for ultra-fast, low-latency tasks.
4. **Interactive Artifacts** with live HTML, React, and SVG previews in the Canvas.

Feel free to ask me anything!`;

    const words = simulatedAnswer.split(' ');
    for (let i = 0; i < words.length; i += 3) {
      const chunk = words.slice(i, i + 3).join(' ') + ' ';
      sendEvent('chunk', { text: chunk });
      await new Promise((r) => setTimeout(r, 40));
    }
    sendEvent('done', { finishReason: 'STOP' });
    res.end();
    return;
  }

  try {
    // Model routing:
    // Use gemini-4-argon for complex tasks, gemini-3.8-flash for general tasks, and gemini-3.1-flash-lite for fast tasks
    let targetModel = 'gemini-3.8-flash';
    if (model === 'gemini-4-argon' || model === 'genchat-4-argon') {
      targetModel = 'gemini-4-argon';
    } else if (model === 'gemini-3.1-flash-lite' || model === 'genchat-3.1-flash-lite') {
      targetModel = 'gemini-3.1-flash-lite';
    } else {
      targetModel = 'gemini-3.8-flash';
    }

    // Default system prompt giving the chatbot a specific role
    const effectiveSystemPrompt =
      systemInstruction ||
      `You are GenChat, a next-generation AI assistant powered by Gemini. You are deeply thoughtful, articulate, honest, and helpful.
You can answer and reply to anything the user asks with clarity, depth, and intelligence.
When writing substantial code files (e.g. self-contained React apps, HTML/JS games, tools, SVG graphics, or markdown documents), structure them cleanly.
If creating a standalone UI component or webpage, make sure it is completely functional and self-contained so the user can preview it directly in the Canvas.`;

    // Build contents from multi-turn conversation history
    const contents: any[] = [];

    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      const isLastMessage = i === messages.length - 1;
      const role = m.role === 'user' ? 'user' : 'model';

      const parts: any[] = [];

      // If last message has attachments, add them to parts
      if (isLastMessage && attachments && attachments.length > 0) {
        for (const att of attachments) {
          if (att.data && att.mimeType) {
            parts.push({
              inlineData: {
                data: att.data.replace(/^data:[^;]+;base64,/, ''),
                mimeType: att.mimeType,
              },
            });
          }
        }
      }

      if (m.content) {
        parts.push({ text: m.content });
      }

      if (parts.length > 0) {
        // Enforce strict user/model alternation by merging consecutive same-role turns if any
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts.push(...parts);
        } else {
          contents.push({ role, parts });
        }
      }
    }

    // Fallback if contents is empty
    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Hello GenChat' }] });
    }

    const config: any = {
      systemInstruction: effectiveSystemPrompt,
    };

    if (enableWebSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    // Emit initial thinking state
    if (enableThinking) {
      sendEvent('thinking', {
        text: 'Analyzing multi-turn context and synthesizing structured response...',
      });
    }

    // Call generateContentStream
    const responseStream = await ai.models.generateContentStream({
      model: targetModel,
      contents,
      config,
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        sendEvent('chunk', { text });
      }
    }

    sendEvent('done', { finishReason: 'STOP' });
    res.end();
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    sendEvent('error', {
      message: error?.message || 'An error occurred while communicating with Gemini.',
    });
    res.end();
  }
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'GenChat Engine', hasApiKey: !!apiKey });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GenChat server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
