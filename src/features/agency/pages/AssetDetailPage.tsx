'use client';

import { useState } from 'react';
import { useParams, useNavigate } from '../lib/navigation';
import {
  ArrowLeft, Edit3, MoreHorizontal, MessageSquare,
  CheckCircle2, Clock, Upload, Sparkles, Package,
  FileText, Layers, History, AlertCircle, User, Calendar, type LucideIcon
} from 'lucide-react';
import {
  getAsset, getClient, getCampaign, getDesigner,
  getAssetFeedback, getAssetVersions, activityItems,
  statusConfig, priorityConfig, feedbackPriorityConfig, issueTypeConfig,
  type Asset,
} from '../data/mockData';
import { cn } from '../lib/utils';
import { VersionUploader } from '../components/VersionUploader';

type Tab = 'overview' | 'brief' | 'versions' | 'review_cycles' | 'feedback' | 'approvals' | 'activity';

const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'brief', label: 'Brief', icon: Edit3 },
  { id: 'versions', label: 'Versions', icon: Layers },
  { id: 'review_cycles', label: 'Review Cycles', icon: History },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle2 },
  { id: 'activity', label: 'Activity', icon: Clock },
];

const briefData = {
  objective: 'Launch the SS25 collection with maximum impact on Instagram. Drive awareness and direct traffic to the shop page within the first 48 hours of posting.',
  targetAudience: 'Women 25–40, fashion-conscious, urban, high disposable income. Instagram-native, aspirational lifestyle content consumers.',
  platform: 'Instagram Feed (1:1) + Stories (9:16). Primary placement is feed, story crop must also work.',
  keyMessage: 'Luminary SS25 — Summer Drop 2025. Clean, editorial, confident.',
  cta: '"Shop Now" — links to /collections/ss25. Must be visible and actionable.',
  mandatoryElements: 'Luminary logo (top-left), SS25 collection watermark, "Summer Drop 2025" tagline, product visible in frame.',
  brandGuidelines: 'Use Luminary Purple (#6B21E8) as primary accent only. Typography: Bricolage Grotesque for all overlaid text. No clutter — max 2 text elements per frame.',
  references: 'Jacquemus SS24 campaign, Totême editorial grid, Bottega Veneta minimal approach.',
  dos: 'Full-bleed photography. Strong diagonal composition. Model gazing off-camera. Soft natural light.',
  donts: 'No busy backgrounds. No multiple models per frame. No text-heavy layouts. Do not use white backgrounds.',
};

function OverviewTab({ asset }: { asset: NonNullable<ReturnType<typeof getAsset>> }) {
  const navigate = useNavigate();
  const client = getClient(asset.clientId);
  const campaign = getCampaign(asset.campaignId);
  const designer = getDesigner(asset.designerId);
  const cfg = statusConfig[asset.status];
  const { color: priorityColor, label: priorityLabel } = priorityConfig[asset.priority];

  return (
    <div className="space-y-5">
      {/* Asset Preview */}
      <div className="rounded-xl overflow-hidden bg-secondary aspect-video max-w-2xl">
        <img src={asset.previewUrl} alt={asset.name} className="w-full h-full object-cover" />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Client', value: client?.name, accent: client?.color },
          { label: 'Campaign', value: campaign?.name },
          { label: 'Designer', value: designer?.name || 'Alex Kim' },
          { label: 'Due Date', value: asset.dueDate },
          { label: 'Status', value: cfg.label, color: cfg.color },
          { label: 'Priority', value: priorityLabel, color: priorityColor },
          { label: 'Version', value: `V${asset.currentVersion}` },
          { label: 'Revisions', value: `${asset.revisionCount} total` },
        ].map(({ label, value, color, accent }) => (
          <div key={label} className="bg-secondary rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
            <div
              className="text-sm font-medium truncate"
              style={{ color: color || 'var(--foreground)' }}
            >
              {accent && (
                <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ backgroundColor: accent }} />
              )}
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Description</div>
        <p className="text-sm leading-relaxed">{asset.description}</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => navigate(`/assets/${asset.id}/review`)}
          className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <MessageSquare size={15} />
          Open Review Interface
        </button>
        <button
          onClick={() => navigate(`/assets/${asset.id}/consolidation`)}
          className="flex items-center gap-2 bg-secondary border border-border text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
        >
          <Sparkles size={15} />
          AI Consolidation
        </button>
        <button
          onClick={() => navigate(`/assets/${asset.id}/revision-package`)}
          className="flex items-center gap-2 bg-secondary border border-border text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
        >
          <Package size={15} />
          Revision Package
        </button>
        <button
          onClick={() => navigate(`/assets/${asset.id}/ai-prompt`)}
          className="flex items-center gap-2 bg-secondary border border-border text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-muted transition-colors"
        >
          <Sparkles size={15} className="text-violet-400" />
          AI Prompt Generator
        </button>
      </div>
    </div>
  );
}

function BriefTab() {
  const fields = [
    { label: 'Objective', value: briefData.objective },
    { label: 'Target Audience', value: briefData.targetAudience },
    { label: 'Platform', value: briefData.platform },
    { label: 'Key Message', value: briefData.keyMessage },
    { label: 'CTA', value: briefData.cta },
    { label: 'Mandatory Elements', value: briefData.mandatoryElements },
    { label: 'Brand Guidelines', value: briefData.brandGuidelines },
    { label: 'References', value: briefData.references },
    { label: "Do's", value: briefData.dos },
    { label: "Don'ts", value: briefData.donts },
  ];

  return (
    <div className="max-w-2xl space-y-4">
      {fields.map(({ label, value }) => (
        <div key={label} className="bg-card border border-border rounded-xl p-5">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{label}</div>
          <p className="text-sm leading-relaxed">{value}</p>
        </div>
      ))}
    </div>
  );
}

function VersionsTab({ assetId }: { assetId: string }) {
  const navigate = useNavigate();
  const versionList = getAssetVersions(assetId);
  const statusColors = {
    in_review: { color: '#3b82f6', label: 'In Review' },
    approved: { color: '#10b981', label: 'Approved' },
    rejected: { color: '#ef4444', label: 'Rejected' },
    draft: { color: '#6b7280', label: 'Draft' },
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{versionList.length} versions · image and video supported</p>
        <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
          <Upload size={14} />
          Upload New Version
        </button>
      </div>

      <div className="space-y-3">
        {versionList.slice().reverse().map(v => {
          const cfg = statusColors[v.status];
          const isCurrent = v.version === Math.max(...versionList.map(vv => vv.version));
          return (
            <div key={v.id} className={cn('bg-card border rounded-xl p-5 transition-colors', isCurrent ? 'border-primary/30' : 'border-border')}>
              <div className="flex items-start gap-4">
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  <img src={v.previewUrl} alt={`V${v.version}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>Version {v.version}</span>
                    {isCurrent && (
                      <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">Current</span>
                    )}
                    <span className="ml-auto text-xs font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{v.notes}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{v.creator}</span>
                    <span>·</span>
                    <span>{v.uploadDate}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewCyclesTab() {
  const cycles = [
    { id: 'rc1', type: 'Internal Review', status: 'closed', openDate: '2025-04-10', closeDate: '2025-04-14', participants: ['Maya Chen', 'Alex Kim'], completion: 100 },
    { id: 'rc2', type: 'Client Review', status: 'open', openDate: '2025-05-09', closeDate: '2025-05-16', participants: ['Elena Vasquez', 'James Park'], completion: 60 },
  ];

  return (
    <div className="max-w-2xl space-y-4">
      {cycles.map(cycle => (
        <div key={cycle.id} className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History size={16} className="text-muted-foreground" />
              <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{cycle.type}</span>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
              style={{
                color: cycle.status === 'open' ? '#10b981' : '#6b7280',
                backgroundColor: cycle.status === 'open' ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.12)'
              }}
            >
              {cycle.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
            <div>
              <div className="text-muted-foreground mb-0.5">Opened</div>
              <div>{cycle.openDate}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-0.5">Closes</div>
              <div>{cycle.closeDate}</div>
            </div>
          </div>
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">Participants</div>
            <div className="flex items-center gap-1">
              {cycle.participants.map(p => (
                <div key={p} className="text-xs bg-secondary rounded-full px-2 py-0.5">{p}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Completion</span>
              <span>{cycle.completion}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${cycle.completion}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeedbackTab({ assetId }: { assetId: string }) {
  const navigate = useNavigate();
  const feedback = getAssetFeedback(assetId);

  return (
    <div className="max-w-2xl space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{feedback.length} feedback items · {feedback.filter(f => !f.resolved).length} unresolved</p>
        <button
          onClick={() => navigate(`/assets/${assetId}/review`)}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <MessageSquare size={14} />
          Open Review Interface
        </button>
      </div>

      {feedback.map(pin => {
        const priorityCfg = feedbackPriorityConfig[pin.priority];
        const issueCfg = issueTypeConfig[pin.issueType];
        return (
          <div key={pin.id} className={cn('bg-card border rounded-xl p-5', pin.resolved ? 'border-border/30 opacity-60' : 'border-border')}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                  {pin.number}
                </div>
                <span className="text-sm font-medium">{pin.category}</span>
                {pin.resolved && (
                  <span className="text-xs text-emerald-400 flex items-center gap-0.5">
                    <CheckCircle2 size={12} /> Resolved
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: issueCfg.color, backgroundColor: `${issueCfg.color}20` }}>
                  {issueCfg.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: priorityCfg.color, backgroundColor: priorityCfg.bg }}>
                  {priorityCfg.label}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{pin.description}</p>
            {pin.suggestedFix && (
              <div className="bg-secondary rounded-lg p-3 text-xs">
                <div className="text-muted-foreground mb-1 font-medium">Suggested Fix</div>
                <div className="leading-relaxed">{pin.suggestedFix}</div>
              </div>
            )}
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <User size={11} />
              <span>{pin.author}</span>
              <span>·</span>
              <span>{new Date(pin.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ApprovalsTab() {
  const approvals = [
    { id: 'ap1', by: 'Maya Chen', role: 'Founder', action: 'Approved', date: '2025-05-09', note: 'Strong execution. Proceed to client review.' },
    { id: 'ap2', by: 'Elena Vasquez', role: 'Client', action: 'Request Changes', date: '2025-05-10', note: 'Logo needs to be larger. CTA needs higher contrast. See feedback pins for details.' },
  ];

  return (
    <div className="max-w-2xl space-y-4">
      {/* Action buttons */}
      <div className="flex gap-2">
        <button className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-500 transition-colors">
          <CheckCircle2 size={15} /> Approve
        </button>
        <button className="flex items-center gap-1.5 bg-secondary border border-border text-sm font-medium px-4 py-2 rounded-lg hover:bg-muted transition-colors">
          <CheckCircle2 size={15} className="text-amber-400" /> Approve with Minor Edits
        </button>
        <button className="flex items-center gap-1.5 bg-secondary border border-border text-sm font-medium px-4 py-2 rounded-lg hover:bg-muted transition-colors">
          <AlertCircle size={15} className="text-red-400" /> Request Changes
        </button>
      </div>

      {/* History */}
      <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Approval History</h3>
      <div className="space-y-3">
        {approvals.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {a.by.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <span className="text-sm font-medium">{a.by}</span>
                  <span className="text-xs text-muted-foreground ml-1">· {a.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    color: a.action === 'Approved' ? '#10b981' : '#f59e0b',
                    backgroundColor: a.action === 'Approved' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)'
                  }}
                >
                  {a.action}
                </span>
                <span className="text-xs text-muted-foreground">{a.date}</span>
              </div>
            </div>
            {a.note && <p className="text-sm text-muted-foreground leading-relaxed">{a.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityTab({ assetId }: { assetId: string }) {
  const assetActivity = activityItems.filter(a => a.assetId === assetId);
  const allActivity = activityItems.filter(a => a.assetId !== assetId);

  const iconMap: Record<string, { icon: LucideIcon; color: string }> = {
    version_upload: { icon: Upload, color: '#3b82f6' },
    feedback_submitted: { icon: MessageSquare, color: '#f59e0b' },
    review_opened: { icon: History, color: '#8b5cf6' },
    review_closed: { icon: CheckCircle2, color: '#10b981' },
    asset_approved: { icon: CheckCircle2, color: '#10b981' },
    revision_approved: { icon: Package, color: '#06b6d4' },
    asset_published: { icon: Upload, color: '#6b7280' },
    brief_created: { icon: FileText, color: '#8b5cf6' },
  };

  const items = assetActivity.length > 0 ? assetActivity : allActivity.slice(0, 6);

  return (
    <div className="max-w-xl space-y-1">
      {items.map((item, i) => {
        const meta = iconMap[item.type] || { icon: Clock, color: '#6b7280' };
        const Icon = meta.icon;
        return (
          <div key={item.id} className="flex gap-3 py-3">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${meta.color}20` }}>
                <Icon size={13} style={{ color: meta.color }} />
              </div>
              {i < items.length - 1 && <div className="flex-1 w-px bg-border/50 mt-1" />}
            </div>
            <div className="pb-3 flex-1 min-w-0">
              <div className="text-sm">
                <span className="font-medium">{item.user}</span>
                <span className="text-muted-foreground"> {item.description}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {new Date(item.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AssetDetailPage({ asset: assetProp }: { asset?: Asset } = {}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const asset = assetProp ?? getAsset(id || '');
  if (!asset) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Asset not found</p>
          <button onClick={() => navigate('/assets')} className="mt-3 text-primary text-sm hover:underline">Back to Assets</button>
        </div>
      </div>
    );
  }

  const cfg = statusConfig[asset.status];
  const feedback = getAssetFeedback(asset.id);
  const feedbackCount = feedback.filter(f => !f.resolved).length;

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Back + Title */}
      <div className="flex items-start gap-4 mb-5">
        <button onClick={() => navigate('/assets')} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-0.5">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold truncate" style={{ fontFamily: 'var(--font-display)' }}>{asset.name}</h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">V{asset.currentVersion} · {asset.revisionCount} revisions</p>
        </div>
        <VersionUploader assetId={asset.id} />
        <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 border-b border-border mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const badge = tab.id === 'feedback' && feedbackCount > 0 ? feedbackCount : null;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px',
                activeTab === tab.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon size={14} />
              {tab.label}
              {badge && (
                <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 rounded-full font-bold">{badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && <OverviewTab asset={asset} />}
        {activeTab === 'brief' && <BriefTab />}
        {activeTab === 'versions' && <VersionsTab assetId={asset.id} />}
        {activeTab === 'review_cycles' && <ReviewCyclesTab />}
        {activeTab === 'feedback' && <FeedbackTab assetId={asset.id} />}
        {activeTab === 'approvals' && <ApprovalsTab />}
        {activeTab === 'activity' && <ActivityTab assetId={asset.id} />}
      </div>
    </div>
  );
}
