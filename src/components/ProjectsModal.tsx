import React, { useState } from 'react';
import {
  X,
  Plus,
  FolderOpen,
  Trash2,
  FileText,
  Upload,
  Check,
  Sparkles,
} from 'lucide-react';
import { Project } from '../types';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onCreateProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [color, setColor] = useState('#d97757');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateProject({
      name: name.trim(),
      description: description.trim(),
      customInstructions: customInstructions.trim(),
      color,
      files: [],
    });

    setName('');
    setDescription('');
    setCustomInstructions('');
    setIsCreating(false);
  };

  const COLORS = ['#d97757', '#60a5fa', '#34d399', '#a78bfa', '#f472b6', '#f59e0b'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FolderOpen size={18} className="text-[#d97757]" />
            <h2 className="font-semibold text-sm text-[var(--text-primary)]">
              Projects & Knowledge
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[var(--text-primary)]">
          {isCreating ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[var(--text-primary)]">
                  Create New Project
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block font-medium mb-1.5 text-[var(--text-secondary)]">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js SaaS Architecture"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#d97757]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1.5 text-[var(--text-secondary)]">
                  Brief Description
                </label>
                <input
                  type="text"
                  placeholder="What is this workspace focused on?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#d97757]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1.5 text-[var(--text-secondary)]">
                  Project Color Accent
                </label>
                <div className="flex items-center gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        color === c ? 'scale-110 border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1.5 text-[var(--text-secondary)]">
                  Custom Instructions for this Project
                </label>
                <textarea
                  placeholder="Special instructions applied whenever chatting inside this project..."
                  rows={4}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[#d97757] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#d97757] text-white rounded-xl font-medium hover:bg-[#c96442]"
                >
                  Create Project
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Your Projects</h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Keep project-specific knowledge, files, and tailored instructions.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d97757] text-white hover:bg-[#c96442] font-medium shadow-xs"
                >
                  <Plus size={14} />
                  <span>New Project</span>
                </button>
              </div>

              <div className="space-y-3">
                {projects.map((proj) => {
                  const isActive = activeProjectId === proj.id;
                  return (
                    <div
                      key={proj.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isActive
                          ? 'border-[#d97757] bg-[#d97757]/5'
                          : 'border-[var(--border-color)] bg-[var(--bg-page)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5"
                            style={{ backgroundColor: proj.color || '#d97757' }}
                          />
                          <div>
                            <div className="font-semibold text-xs text-[var(--text-primary)] flex items-center gap-2">
                              <span>{proj.name}</span>
                              {isActive && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-[#d97757]/15 text-[#d97757] rounded-md font-medium">
                                  Current Active Workspace
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[var(--text-muted)] mt-1">
                              {proj.description || 'No description provided.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              onSelectProject(isActive ? null : proj.id)
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                              isActive
                                ? 'bg-[#d97757] text-white'
                                : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            {isActive ? 'Deactivate' : 'Switch To'}
                          </button>
                          <button
                            onClick={() => onDeleteProject(proj.id)}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-black/10 dark:hover:bg-white/10"
                            title="Delete project"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {proj.customInstructions && (
                        <div className="mt-3 pt-3 border-t border-[var(--border-color)]/60 text-[11px] text-[var(--text-muted)] font-mono bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                          Instructions: {proj.customInstructions}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
