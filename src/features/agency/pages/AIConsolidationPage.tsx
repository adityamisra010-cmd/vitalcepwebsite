'use client';

import { useState, type ReactNode } from 'react';
import { useParams, useNavigate } from '../lib/navigation';
import { ArrowLeft, Sparkles, AlertTriangle, CheckCircle2, Lightbulb, GitMerge, BarChart2, ThumbsUp, type LucideIcon } from 'lucide-react';
import { getAsset, getAssetFeedback, feedbackPriorityConfig, issueTypeConfig } from '../data/mockData';
import { cn } from '../lib/utils';

const consolidation = {
  critical: [
    {
      id: 'c1',
      title: 'Missing legal disclaimer',
      detail: 'Compliance requirement flagged by Elena Vasquez. "T&Cs apply" text is absent from promotional pricing element. Risk: regulatory non-compliance.',
      feedbackIds: ['fp4'],
      sources: 1,
    },
    {
      id: 'c2',
      title: 'Logo violates minimum size guideline',
      detail: 'Logo appears below the 48px minimum height threshold defined in brand guidelines. Will fail quality review on mobile placements.',
      feedbackIds: ['fp1'],
      sources: 1,
    },
  ],
  required: [
    {
      id: 'r1',
      title: 'Campaign tagline mismatch',
      detail: 'Current copy reads "New Collection" but the brief and all related assets use "Summer Drop 2025". Inconsistency will undermine campaign cohesion across channels.',
      feedbackIds: ['fp5'],
      sources: 2,
    },
    {
      id: 'r2',
      title: 'CTA insufficient contrast and prominence',
      detail: '"Shop Now" CTA blends into the background, reducing conversion intent. The CTA is the primary performance KPI for this asset.',
      feedbackIds: ['fp2'],
      sources: 1,
    },
  ],
  suggested: [
    {
      id: 's1',
      title: 'Increase headline weight for impact',
      detail: 'Reviewer suggests using Bricolage Grotesque 700 for the "SS25" callout to convey confidence. Subjective improvement, not blocking.',
      feedbackIds: ['fp3'],
      sources: 1,
    },
  ],
  conflicting: [
    {
      id: 'cf1',
      title: 'CTA button color interpretation',
      detail: 'Elena Vasquez requests higher contrast CTA using brand purple. James Park suggests an off-white CTA to maintain the editorial tone. Both are valid brand interpretations — founder decision required.',
      reviewers: ['Elena Vasquez', 'James Park'],
    },
  ],
  stats: {
    totalFeedback: 5,
    resolved: 1,
    critical: 2,
    required: 2,
    suggested: 1,
    byType: [
      { type: 'Brand Issue', count: 1 },
      { type: 'Compliance', count: 1 },
      { type: 'Conversion', count: 1 },
      { type: 'Messaging', count: 1 },
      { type: 'Design', count: 1 },
    ],
  },
};

export default function AIConsolidationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = getAsset(id || '');
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!asset) return null;

  const handleApprove = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setApproved(true); }, 1200);
  };

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/assets/${id}`)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
          <ArrowLeft size={16} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-violet-400" />
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>AI Consolidation</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{asset.name} · 5 feedback items analyzed</p>
        </div>
      </div>

      {/* AI Notice */}
      <div className="flex items-start gap-3 bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
        <Sparkles size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <span className="font-medium text-violet-300">AI-Generated Summary</span>
          <span className="text-muted-foreground"> — This consolidation was generated from 5 feedback items submitted across 1 review cycle. All items have been grouped, prioritized, and de-duplicated. Conflicting feedback has been flagged for founder decision.</span>
        </div>
      </div>

      {/* Critical Issues */}
      <Section title="Critical Issues" icon={AlertTriangle} iconColor="text-red-400" count={consolidation.critical.length} badge="critical">
        {consolidation.critical.map(item => (
          <IssueCard key={item.id} title={item.title} detail={item.detail} sources={item.sources} color="border-red-500/20 bg-red-500/5" />
        ))}
      </Section>

      {/* Required Changes */}
      <Section title="Required Changes" icon={CheckCircle2} iconColor="text-amber-400" count={consolidation.required.length} badge="required">
        {consolidation.required.map(item => (
          <IssueCard key={item.id} title={item.title} detail={item.detail} sources={item.sources} color="border-amber-500/20 bg-amber-500/5" />
        ))}
      </Section>

      {/* Suggested Improvements */}
      <Section title="Suggested Improvements" icon={Lightbulb} iconColor="text-blue-400" count={consolidation.suggested.length} badge="suggested">
        {consolidation.suggested.map(item => (
          <IssueCard key={item.id} title={item.title} detail={item.detail} sources={item.sources} color="border-blue-500/20 bg-blue-500/5" />
        ))}
      </Section>

      {/* Conflicting Feedback */}
      <Section title="Conflicting Feedback" icon={GitMerge} iconColor="text-orange-400" count={consolidation.conflicting.length} badge="conflict">
        {consolidation.conflicting.map(item => (
          <div key={item.id} className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
            <div className="font-semibold text-sm mb-2">{item.title}</div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.detail}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Between:</span>
              {item.reviewers.map(r => (
                <span key={r} className="bg-secondary rounded-full px-2 py-0.5 text-foreground">{r}</span>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* Stats */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={16} className="text-muted-foreground" />
          <h2 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>Feedback Statistics</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          {[
            { label: 'Total Items', value: consolidation.stats.totalFeedback },
            { label: 'Resolved', value: consolidation.stats.resolved, color: '#10b981' },
            { label: 'Critical', value: consolidation.stats.critical, color: '#ef4444' },
            { label: 'Required', value: consolidation.stats.required, color: '#f59e0b' },
            { label: 'Suggested', value: consolidation.stats.suggested, color: '#3b82f6' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center bg-secondary rounded-lg p-3">
              <div className="text-xl font-bold mb-0.5" style={{ fontFamily: 'var(--font-display)', color: color || 'var(--foreground)' }}>{value}</div>
              <div className="text-[10px] text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {consolidation.stats.byType.map(({ type, count }) => (
            <div key={type} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-28">{type}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(count / consolidation.stats.totalFeedback) * 100}%` }} />
              </div>
              <span className="text-xs text-muted-foreground w-4 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Founder Approval */}
      {!approved ? (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-2" style={{ fontFamily: 'var(--font-display)' }}>Founder Approval Required</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Review the consolidation above. Once approved, a Revision Package will be automatically generated for the designer.
          </p>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            <ThumbsUp size={15} />
            {loading ? 'Generating Revision Package...' : 'Approve & Generate Revision Package'}
          </button>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm text-emerald-300">Consolidation Approved</div>
            <p className="text-xs text-muted-foreground mt-0.5">Revision Package generated and assigned to designer.</p>
          </div>
          <button
            onClick={() => navigate(`/assets/${id}/revision-package`)}
            className="ml-auto text-xs text-primary hover:underline flex-shrink-0"
          >
            View Package →
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, iconColor, count, badge, children }: {
  title: string; icon: LucideIcon; iconColor: string;
  count: number; badge: string; children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 p-5 hover:bg-secondary/50 transition-colors"
      >
        <Icon size={16} className={iconColor} />
        <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{title}</span>
        <span className="ml-1 text-xs bg-muted rounded-full px-2 py-0.5 text-muted-foreground">{count}</span>
        <span className={cn('ml-auto text-xs transform transition-transform', open ? 'rotate-180' : '')}>▾</span>
      </button>
      {open && <div className="px-5 pb-5 space-y-3">{children}</div>}
    </div>
  );
}

function IssueCard({ title, detail, sources, color }: { title: string; detail: string; sources: number; color: string }) {
  return (
    <div className={cn('rounded-xl p-4 border', color)}>
      <div className="font-semibold text-sm mb-1.5">{title}</div>
      <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
      <div className="text-[10px] text-muted-foreground mt-2">{sources} source{sources !== 1 ? 's' : ''}</div>
    </div>
  );
}
