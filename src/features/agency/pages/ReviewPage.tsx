'use client';

import { useState, useRef, type MouseEvent } from 'react';
import { useParams, useNavigate } from '../lib/navigation';
import {
  ArrowLeft, X, Check, Plus, AlertTriangle, ChevronDown
} from 'lucide-react';
import {
  getAsset, getAssetFeedback, feedbackPriorityConfig, issueTypeConfig,
  type FeedbackPin, type FeedbackIssueType, type FeedbackPriority
} from '../data/mockData';
import { cn } from '../lib/utils';

const issueTypes: FeedbackIssueType[] = [
  'objective_error', 'compliance_issue', 'brand_issue', 'conversion_issue',
  'design_improvement', 'new_requirement', 'question'
];

const defaultForm = {
  issueType: 'brand_issue' as FeedbackIssueType,
  priority: 'required' as FeedbackPriority,
  category: '',
  description: '',
  suggestedFix: '',
};

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = getAsset(id || '');
  const imageRef = useRef<HTMLDivElement>(null);

  const [pins, setPins] = useState<FeedbackPin[]>(() => getAssetFeedback(id || ''));
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [mode, setMode] = useState<'view' | 'annotate'>('view');

  if (!asset) return null;

  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    if (mode !== 'annotate') return;
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPin({ x, y });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!pendingPin || !form.description.trim()) return;
    const newPin: FeedbackPin = {
      id: `fp-${Date.now()}`,
      assetId: id || '',
      number: pins.length + 1,
      x: pendingPin.x,
      y: pendingPin.y,
      ...form,
      author: 'Elena Vasquez',
      createdAt: new Date().toISOString(),
      resolved: false,
    };
    setPins(prev => [...prev, newPin]);
    setPendingPin(null);
    setShowForm(false);
    setForm(defaultForm);
  };

  const handleCancelPin = () => {
    setPendingPin(null);
    setShowForm(false);
    setForm(defaultForm);
  };

  const handleResolve = (pinId: string) => {
    setPins(prev => prev.map(p => p.id === pinId ? { ...p, resolved: !p.resolved } : p));
  };

  const selected = pins.find(p => p.id === selectedPin);
  const unresolvedCount = pins.filter(p => !p.resolved).length;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main review area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-12 flex items-center gap-3 px-4 border-b border-border bg-card flex-shrink-0">
          <button
            onClick={() => navigate(`/assets/${id}`)}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} />
          </button>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium truncate">{asset.name}</span>
            <span className="text-xs text-muted-foreground ml-2">· Review Interface</span>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 border border-border/50">
            <button
              onClick={() => setMode('view')}
              className={cn('px-3 py-1 rounded-md text-xs font-medium transition-colors', mode === 'view' ? 'bg-background text-foreground' : 'text-muted-foreground')}
            >
              View
            </button>
            <button
              onClick={() => setMode('annotate')}
              className={cn('px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1', mode === 'annotate' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
            >
              <Plus size={12} /> Annotate
            </button>
          </div>

          <span className="text-xs text-muted-foreground">{pins.length} annotations · {unresolvedCount} open</span>
        </div>

        {/* Asset canvas */}
        <div className="flex-1 overflow-auto bg-[#030308] flex items-center justify-center p-8">
          <div
            ref={imageRef}
            onClick={handleImageClick}
            className={cn(
              'relative max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl',
              mode === 'annotate' ? 'cursor-crosshair' : 'cursor-default'
            )}
          >
            <img
              src={asset.previewUrl}
              alt={asset.name}
              className="w-full block"
              draggable={false}
            />

            {/* Feedback pins */}
            {pins.map(pin => (
              <button
                key={pin.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPin(selectedPin === pin.id ? null : pin.id);
                }}
                className={cn(
                  'absolute w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transition-all z-10',
                  'border-2',
                  pin.resolved ? 'opacity-50' : '',
                  selectedPin === pin.id ? 'scale-125 border-white' : 'border-white/60 hover:scale-110'
                )}
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: `translate(-50%, -50%) ${selectedPin === pin.id ? 'scale(1.25)' : ''}`,
                  backgroundColor: feedbackPriorityConfig[pin.priority].color,
                }}
                title={pin.category}
              >
                {pin.number}
              </button>
            ))}

            {/* Pending pin placement */}
            {pendingPin && (
              <div
                className="absolute w-7 h-7 rounded-full bg-white/30 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg pointer-events-none animate-pulse z-10"
                style={{
                  left: `${pendingPin.x}%`,
                  top: `${pendingPin.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                ?
              </div>
            )}
          </div>

          {mode === 'annotate' && !showForm && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-4 py-2 rounded-full border border-white/10">
              Click anywhere on the asset to add feedback
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-80 flex-shrink-0 flex flex-col border-l border-border bg-card overflow-hidden">
        {/* Feedback Form (when adding) */}
        {showForm && pendingPin ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>Add Feedback</h3>
              <button onClick={handleCancelPin} className="p-1 rounded hover:bg-secondary text-muted-foreground">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Issue Type */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Issue Type</label>
                <select
                  value={form.issueType}
                  onChange={e => setForm(f => ({ ...f, issueType: e.target.value as FeedbackIssueType }))}
                  className="w-full bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground outline-none"
                >
                  {issueTypes.map(type => (
                    <option key={type} value={type}>{issueTypeConfig[type].label}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Priority</label>
                <div className="flex gap-1">
                  {(['critical', 'required', 'suggested'] as FeedbackPriority[]).map(p => {
                    const cfg = feedbackPriorityConfig[p];
                    return (
                      <button
                        key={p}
                        onClick={() => setForm(f => ({ ...f, priority: p }))}
                        className={cn(
                          'flex-1 py-1.5 rounded-md text-xs font-medium transition-colors border',
                          form.priority === p ? 'text-white border-transparent' : 'border-border text-muted-foreground hover:text-foreground'
                        )}
                        style={form.priority === p ? { backgroundColor: cfg.color, borderColor: cfg.color } : {}}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Category</label>
                <input
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. Logo Placement, Typography..."
                  className="w-full bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the issue clearly..."
                  rows={3}
                  className="w-full bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground resize-none focus:border-primary/50"
                />
              </div>

              {/* Suggested Fix */}
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Suggested Fix</label>
                <textarea
                  value={form.suggestedFix}
                  onChange={e => setForm(f => ({ ...f, suggestedFix: e.target.value }))}
                  placeholder="How would you fix this?"
                  rows={2}
                  className="w-full bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground resize-none focus:border-primary/50"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSubmit}
                  disabled={!form.description.trim()}
                  className="flex-1 bg-primary text-primary-foreground text-sm font-medium py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Add Feedback
                </button>
                <button
                  onClick={handleCancelPin}
                  className="px-3 bg-secondary border border-border text-sm rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Feedback List */
          <div className="flex flex-col h-full overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex-shrink-0">
              <h3 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>Feedback</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{pins.length} items · {unresolvedCount} unresolved</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {pins.length === 0 ? (
                <div className="text-center py-8">
                  <Plus size={24} className="mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">No feedback yet.</p>
                  <p className="text-xs text-muted-foreground mt-1">Switch to Annotate mode and click the asset.</p>
                </div>
              ) : (
                pins.map(pin => {
                  const priorityCfg = feedbackPriorityConfig[pin.priority];
                  const issueCfg = issueTypeConfig[pin.issueType];
                  const isSelected = selectedPin === pin.id;
                  return (
                    <div
                      key={pin.id}
                      onClick={() => setSelectedPin(isSelected ? null : pin.id)}
                      className={cn(
                        'rounded-lg p-3 cursor-pointer border transition-all',
                        isSelected ? 'border-primary/40 bg-secondary' : 'border-border/30 bg-secondary/50 hover:border-border',
                        pin.resolved && 'opacity-50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: priorityCfg.color }}
                        >
                          {pin.number}
                        </div>
                        <span className="text-xs font-medium flex-1 truncate">{pin.category || issueCfg.label}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleResolve(pin.id); }}
                          className={cn(
                            'w-4 h-4 rounded-full border flex items-center justify-center transition-colors flex-shrink-0',
                            pin.resolved ? 'bg-emerald-500 border-emerald-500' : 'border-muted-foreground hover:border-emerald-400'
                          )}
                        >
                          {pin.resolved && <Check size={9} className="text-white" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{pin.description}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ color: priorityCfg.color, backgroundColor: priorityCfg.bg }}>
                          {priorityCfg.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{pin.author}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
