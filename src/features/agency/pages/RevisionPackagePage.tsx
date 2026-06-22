'use client';

import { useState } from 'react';
import { useParams, useNavigate } from '../lib/navigation';
import { ArrowLeft, Package, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { getAsset } from '../data/mockData';
import { cn } from '../lib/utils';

interface Task {
  id: string;
  tier: 'critical' | 'required' | 'suggested';
  title: string;
  detail: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: 't1', tier: 'critical', title: 'Add legal disclaimer text', detail: 'Add "T&Cs apply" in 8pt minimum font below the promotional price callout. Use approved disclaimer copy from the brand compliance doc.', completed: false },
  { id: 't2', tier: 'critical', title: 'Increase logo to minimum brand size', detail: 'Resize the Luminary logo to a minimum of 64px height (currently appears below 48px threshold). Reposition to top-left corner with 24px padding.', completed: false },
  { id: 't3', tier: 'required', title: 'Replace "New Collection" with "Summer Drop 2025"', detail: 'Update the sub-headline copy to match the official campaign tagline used across all other campaign assets.', completed: false },
  { id: 't4', tier: 'required', title: 'Increase CTA button contrast and visual weight', detail: 'Apply brand primary purple (#6B21E8) to the CTA button with white text. Add a 4px blur drop shadow at 20% opacity to lift it from the background.', completed: false },
  { id: 't5', tier: 'suggested', title: 'Increase headline font weight', detail: 'Optionally try Bricolage Grotesque weight 700 for the "SS25" campaign callout text to add confidence and presence.', completed: false },
];

const tierConfig = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'border-red-500/20' },
  required: { label: 'Required', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'border-amber-500/20' },
  suggested: { label: 'Suggested', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'border-blue-500/20' },
};

export default function RevisionPackagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = getAsset(id || '');
  const [tasks, setTasks] = useState(initialTasks);

  if (!asset) return null;

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const tiers = ['critical', 'required', 'suggested'] as const;

  return (
    <div className="p-6 max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/assets/${id}`)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
          <ArrowLeft size={16} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <Package size={16} className="text-cyan-400" />
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Revision Package</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{asset.name}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{completedCount}<span className="text-muted-foreground font-normal text-lg">/{totalCount}</span></div>
            <div className="text-xs text-muted-foreground mt-0.5">Tasks completed</div>
          </div>
          <div
            className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-sm font-bold"
            style={{
              borderColor: pct === 100 ? '#10b981' : 'oklch(0.63 0.25 282)',
              color: pct === 100 ? '#10b981' : 'var(--foreground)'
            }}
          >
            {pct}%
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: pct === 100 ? '#10b981' : 'oklch(0.63 0.25 282)'
            }}
          />
        </div>
        {pct === 100 && (
          <div className="flex items-center gap-2 mt-3 text-sm text-emerald-400">
            <CheckCircle2 size={16} />
            All tasks complete — ready to upload new version
          </div>
        )}
      </div>

      {/* Task Groups */}
      {tiers.map(tier => {
        const tierTasks = tasks.filter(t => t.tier === tier);
        if (tierTasks.length === 0) return null;
        const cfg = tierConfig[tier];
        const tierComplete = tierTasks.filter(t => t.completed).length;
        return (
          <div key={tier} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>{cfg.label} Tasks</span>
              <span className="text-xs text-muted-foreground ml-auto">{tierComplete}/{tierTasks.length}</span>
            </div>
            {tierTasks.map(task => (
              <div
                key={task.id}
                className={cn(
                  'bg-card border rounded-xl p-4 transition-all',
                  task.completed ? 'border-border/30 opacity-60' : cn('border-border', cfg.border)
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0 mt-0.5 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <Circle size={18} className="text-muted-foreground hover:text-foreground" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className={cn('text-sm font-medium mb-1', task.completed && 'line-through text-muted-foreground')}>
                      {task.title}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{task.detail}</p>
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                    style={{ color: cfg.color, backgroundColor: cfg.bg }}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => navigate(`/assets/${id}/ai-prompt`)}
          className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Sparkles size={15} />
          Generate AI Prompt
        </button>
        <button
          disabled={pct < 100}
          className="flex items-center gap-2 bg-secondary border border-border text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-40"
        >
          <CheckCircle2 size={15} />
          Mark Complete & Upload
        </button>
      </div>
    </div>
  );
}
