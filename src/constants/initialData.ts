import { AppSettings, Chat, ChatPersona, ModelOption } from '../types';

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-3.8-flash',
    geminiModel: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    badge: 'General & Versatile',
    description: 'Balanced flagship model for general queries, writing, research, and coding tasks.',
    contextWindow: '1M tokens',
    isDefault: true,
  },
  {
    id: 'gemini-4-argon',
    geminiModel: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    badge: 'Complex Reasoning',
    description: 'High capability for particularly complex STEM problems, architectural design, and deep analysis.',
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
];

export const CHAT_PERSONAS: ChatPersona[] = [
  {
    id: 'general-assistant',
    name: 'General Assistant',
    badge: 'Default',
    description: 'Helpful, thoughtful, comprehensive, and articulate partner for any query.',
    iconName: 'Sparkles',
    systemInstruction:
      'You are GenChat, powered by Gemini. You are deeply thoughtful, articulate, honest, and helpful. You can answer questions on any topic, brainstorm ideas, draft texts, analyze documents, and write clean code.',
  },
  {
    id: 'software-architect',
    name: 'Software Engineer',
    badge: 'Coding Expert',
    description: 'Full-stack engineering, clean code patterns, debugging, and system design.',
    iconName: 'Code2',
    systemInstruction:
      'You are a Principal Software Architect and Senior Engineer. You provide pristine, production-ready code with strong typing, robust error handling, modern idioms, and minimal fluff. When providing self-contained components or HTML apps, format them completely so they can be previewed as live artifacts.',
  },
  {
    id: 'stem-researcher',
    name: 'STEM & Researcher',
    badge: 'Scientific Rigor',
    description: 'Mathematical proofs, scientific analysis, and structured academic reasoning.',
    iconName: 'Brain',
    systemInstruction:
      'You are a rigorous scientific researcher and academic scholar. You break down complex scientific and mathematical problems using first principles, clear notations, step-by-step logic, and empirical evidence.',
  },
  {
    id: 'creative-writer',
    name: 'Creative Strategist',
    badge: 'Writing & Strategy',
    description: 'Compelling storytelling, persuasive prose, branding, and editorial polish.',
    iconName: 'Feather',
    systemInstruction:
      'You are an exceptional creative director and writer. You craft captivating stories, engaging marketing copy, clear communications, and persuasive arguments without cliches or boilerplate.',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  defaultModel: 'gemini-3.8-flash',
  defaultPersonaId: 'general-assistant',
  systemPrompt: 'You are GenChat, powered by Gemini. You are deeply thoughtful, precise, articulate, and ready to answer any question or assist with any task.',
  userName: 'Alex',
  fontSize: 'comfortable',
  sendOnEnter: true,
  enableThinkingByDefault: false,
};

export const PROMPT_STARTERS = [
  {
    title: 'Interactive Pomodoro Timer',
    subtitle: 'Generate a live React widget with sound and analytics',
    prompt: 'Build a beautiful, self-contained interactive Pomodoro timer with start/pause, customizable intervals, audio alert chime, and session stats as an artifact.',
    category: 'Code',
  },
  {
    title: 'Explain Quantum Computing',
    subtitle: 'Intuitive analogies for qubits and superposition',
    prompt: 'Explain the core principles of quantum computing (qubits, superposition, and entanglement) using clear intuitive analogies and practical real-world implications.',
    category: 'Learn',
  },
  {
    title: 'Distributed System Architecture',
    subtitle: 'Design high-throughput rate limiter',
    prompt: 'How would you architect a distributed rate limiter that handles 500,000 requests per second across 5 continents with sub-millisecond overhead?',
    category: 'Design',
  },
  {
    title: 'Product Launch Strategy',
    subtitle: 'Strategic go-to-market plan for developer tool',
    prompt: 'Draft an actionable 90-day go-to-market roadmap for a new developer observability tool targeting engineering leaders, including developer evangelism and community launch.',
    category: 'Strategy',
  },
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat-demo-1',
    title: 'Interactive Pomodoro Timer Artifact',
    createdAt: Date.now() - 1000 * 60 * 180,
    updatedAt: Date.now() - 1000 * 60 * 180,
    isStarred: true,
    modelId: 'gemini-3.8-flash',
    personaId: 'software-architect',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Can you create an interactive Pomodoro timer with modern design, animated progress ring, and work/break modes as a standalone previewable artifact?',
        timestamp: Date.now() - 1000 * 60 * 180,
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `I've designed an interactive Pomodoro timer with an animated circular progress ring, smooth tactile controls, and quick toggles between Focus (25m), Short Break (5m), and Long Break (15m).

You can preview it directly in the **GenChat Canvas** on the right!`,
        thinking: `1. Define requirements: 25-minute Pomodoro, 5-minute short break, 15-minute long break.
2. Design aesthetic: Anthropic dark charcoal background (#1a1918), terracotta accent (#d97757), clean typography.
3. SVG circular progress ring calculated using circumference = 2 * π * r.
4. Interactive state: countdown interval, pause, reset, sound notification synthesis via Web Audio API.
5. Package as self-contained HTML/React artifact.`,
        artifact: {
          id: 'art-pomodoro-1',
          title: 'Interactive Pomodoro Timer',
          type: 'html',
          language: 'html',
          createdAt: Date.now() - 1000 * 60 * 180,
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GenChat Pomodoro</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .progress-ring__circle {
      transition: stroke-dashoffset 0.35s ease;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }
  </style>
</head>
<body class="bg-[#191817] text-[#ecebe8] min-h-screen flex items-center justify-center p-6 select-none">
  <div class="w-full max-w-sm bg-[#242321] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
    
    <!-- Header Mode Tabs -->
    <div class="flex items-center gap-1.5 p-1 bg-[#181716] rounded-xl border border-white/5 mb-8">
      <button id="mode-work" class="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#d97757] text-white transition-all">Focus</button>
      <button id="mode-short" class="px-3.5 py-1.5 text-xs font-medium rounded-lg text-white/60 hover:text-white transition-all">Short Break</button>
      <button id="mode-long" class="px-3.5 py-1.5 text-xs font-medium rounded-lg text-white/60 hover:text-white transition-all">Long Break</button>
    </div>

    <!-- Circular Progress -->
    <div class="relative w-56 h-56 flex items-center justify-center">
      <svg class="w-full h-full">
        <circle stroke="rgba(255,255,255,0.06)" stroke-width="8" fill="transparent" r="96" cx="112" cy="112" />
        <circle id="progress-circle" class="progress-ring__circle" stroke="#d97757" stroke-width="8" stroke-linecap="round" fill="transparent" r="96" cx="112" cy="112" />
      </svg>
      <div class="absolute flex flex-col items-center">
        <span id="time-display" class="text-5xl font-mono font-medium tracking-tight">25:00</span>
        <span id="label-display" class="text-xs uppercase tracking-widest text-[#a8a69e] mt-2">Deep Work</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-4 mt-8">
      <button id="btn-toggle" class="px-8 py-3 bg-[#d97757] hover:bg-[#c96442] text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-[#d97757]/20 flex items-center gap-2">
        <span id="btn-toggle-text">Start Focus</span>
      </button>
      <button id="btn-reset" class="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-xl transition-all" title="Reset">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
      </button>
    </div>

    <!-- Stats -->
    <div class="w-full grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-white/5 text-center">
      <div class="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
        <div class="text-[11px] text-white/50">Sessions Today</div>
        <div id="stats-sessions" class="text-lg font-mono font-semibold text-[#d97757]">3</div>
      </div>
      <div class="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
        <div class="text-[11px] text-white/50">Focus Time</div>
        <div id="stats-time" class="text-lg font-mono font-semibold text-white/90">75m</div>
      </div>
    </div>

  </div>

  <script>
    const circle = document.getElementById('progress-circle');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = \`\${circumference} \${circumference}\`;

    const MODES = {
      work: { time: 25 * 60, label: 'Deep Work' },
      short: { time: 5 * 60, label: 'Short Break' },
      long: { time: 15 * 60, label: 'Long Break' },
    };

    let currentMode = 'work';
    let timeLeft = MODES[currentMode].time;
    let totalDuration = timeLeft;
    let isRunning = false;
    let timerInterval = null;
    let completedSessions = 3;

    function setProgress(percent) {
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return \`\${String(mins).padStart(2, '0')}:\${String(secs).padStart(2, '0')}\`;
    }

    function updateDisplay() {
      document.getElementById('time-display').textContent = formatTime(timeLeft);
      document.getElementById('label-display').textContent = MODES[currentMode].label;
      const percent = ((totalDuration - timeLeft) / totalDuration) * 100;
      setProgress(percent);
    }

    function switchMode(mode) {
      currentMode = mode;
      isRunning = false;
      clearInterval(timerInterval);
      timeLeft = MODES[mode].time;
      totalDuration = timeLeft;
      document.getElementById('btn-toggle-text').textContent = 'Start ' + (mode === 'work' ? 'Focus' : 'Break');
      
      ['work', 'short', 'long'].forEach(m => {
        const btn = document.getElementById('mode-' + m);
        if (m === mode) {
          btn.className = 'px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#d97757] text-white transition-all';
        } else {
          btn.className = 'px-3.5 py-1.5 text-xs font-medium rounded-lg text-white/60 hover:text-white transition-all';
        }
      });

      updateDisplay();
    }

    function toggleTimer() {
      if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        document.getElementById('btn-toggle-text').textContent = 'Resume';
      } else {
        isRunning = true;
        document.getElementById('btn-toggle-text').textContent = 'Pause';
        timerInterval = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
          } else {
            clearInterval(timerInterval);
            isRunning = false;
            if (currentMode === 'work') {
              completedSessions++;
              document.getElementById('stats-sessions').textContent = completedSessions;
              document.getElementById('stats-time').textContent = (completedSessions * 25) + 'm';
            }
            alert('Timer finished! Good job.');
            switchMode(currentMode === 'work' ? 'short' : 'work');
          }
        }, 1000);
      }
    }

    document.getElementById('btn-toggle').addEventListener('click', toggleTimer);
    document.getElementById('btn-reset').addEventListener('click', () => {
      isRunning = false;
      clearInterval(timerInterval);
      timeLeft = totalDuration;
      document.getElementById('btn-toggle-text').textContent = 'Start';
      updateDisplay();
    });

    document.getElementById('mode-work').addEventListener('click', () => switchMode('work'));
    document.getElementById('mode-short').addEventListener('click', () => switchMode('short'));
    document.getElementById('mode-long').addEventListener('click', () => switchMode('long'));

    updateDisplay();
  </script>
</body>
</html>`,
        },
        timestamp: Date.now() - 1000 * 60 * 179,
      },
    ],
  },
  {
    id: 'chat-demo-2',
    title: 'Zero-Knowledge Proofs Intuition',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    isStarred: false,
    modelId: 'gemini-4-argon',
    personaId: 'stem-researcher',
    messages: [
      {
        id: 'msg-zk-1',
        role: 'user',
        content: 'Explain zero-knowledge proofs like I am a software engineer who knows cryptography basics, but never grasped why zk-SNARKs are succinct.',
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        id: 'msg-zk-2',
        role: 'assistant',
        content: `A **Zero-Knowledge Proof (ZKP)** allows a Prover to convince a Verifier that a statement is true without revealing anything beyond the validity of the statement itself.

### The Classic Intuition: Where's Waldo in a giant cardboard sheet
Imagine you know where Waldo is on a poster. You take a massive cardboard sheet twice the size of the poster with a tiny Waldo-sized hole in the center. You position it so Waldo shows through the aperture. The verifier can see Waldo, confirming you know where he is, but has zero reference points to locate him on the original image.

### Why is a zk-SNARK "Succinct"?
The word **SNARK** stands for:
- **S**uccinct: Proof is small (a few hundred bytes) and verification takes milliseconds ($O(1)$ or $O(\\log n)$), regardless of how large or complex the original computation was!
- **N**on-Interactive: Single message from prover to verifier.
- **AR**gument of **K**nowledge: Computationally sound (a polynomial-time adversary cannot cheat).

#### The Secret Sauce: Polynomial Commitments & Schwartz-Zippel Lemma
1. **Arithmetization:** Any program is converted into a system of arithmetic constraints (R1CS or AIR).
2. **Polynomial Interpolation:** Millions of verification constraints are condensed into polynomials $P(x)$ and $H(x)$.
3. **Random Sampling:** By the **Schwartz-Zippel Lemma**, two distinct polynomials of degree $d$ can intersect at most $d$ points. If the prover checks a single random evaluation point $s$ picked by the verifier (or via Fiat-Shamir heuristic), matching values imply with overwhelming probability ($1 - d/|\\mathbb{F}|$) that the equation holds everywhere!
4. **Result:** Instead of verifying $10^6$ operations one by one, the verifier checks **one cryptographic pairing check over elliptic curve points**. That's why the proof size remains constant (~200 to 400 bytes).`,
        thinking: `Structuring a rigorous yet intuitive technical explanation:
1. Ground with quick relatable analogy.
2. Break down each letter of SNARK succinctly.
3. Dive into the mathematical heart of succinctness: arithmetic circuits -> polynomials -> Schwartz-Zippel randomized sampling.
4. Conclude with concrete performance numbers.`,
        timestamp: Date.now() - 1000 * 60 * 60 * 24 + 1000,
      },
    ],
  },
];
