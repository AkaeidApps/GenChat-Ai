import { marked } from 'marked';
import hljs from 'highlight.js';
import { Artifact } from '../types';

// Configure marked with syntax highlighting
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Parses markdown to HTML with highlight.js syntax highlighting
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  try {
    const rawHtml = marked.parse(markdown) as string;
    return rawHtml;
  } catch (err) {
    console.error('Error parsing markdown:', err);
    return markdown;
  }
}

/**
 * Highlight code snippet using highlight.js
 */
export function highlightCode(code: string, language: string): string {
  try {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }
    return hljs.highlightAuto(code).value;
  } catch {
    return code;
  }
}

/**
 * Detects if a markdown text contains a substantial code artifact (e.g. HTML, SVG, or React component)
 */
export function extractArtifact(text: string): Artifact | null {
  if (!text) return null;

  // Check for HTML complete document or SVG
  const htmlMatch = text.match(/```(?:html|xml)\s*([\s\S]*?)```/i);
  if (htmlMatch && (htmlMatch[1].includes('<!DOCTYPE html>') || htmlMatch[1].includes('<html') || htmlMatch[1].includes('<svg'))) {
    const isSvg = htmlMatch[1].includes('<svg') && !htmlMatch[1].includes('<!DOCTYPE html>');
    return {
      id: `art-${Date.now()}`,
      title: isSvg ? 'Vector SVG Illustration' : 'Interactive Web Application',
      type: isSvg ? 'svg' : 'html',
      language: isSvg ? 'svg' : 'html',
      content: htmlMatch[1].trim(),
      createdAt: Date.now(),
    };
  }

  // Check for React / TSX / JSX component
  const jsxMatch = text.match(/```(?:tsx|jsx|javascript|typescript)\s*([\s\S]*?)```/i);
  if (jsxMatch && (jsxMatch[1].includes('export default function') || jsxMatch[1].includes('return (') || jsxMatch[1].includes('useState('))) {
    return {
      id: `art-${Date.now()}`,
      title: 'Interactive React Component',
      type: 'react',
      language: 'tsx',
      content: jsxMatch[1].trim(),
      createdAt: Date.now(),
    };
  }

  return null;
}
