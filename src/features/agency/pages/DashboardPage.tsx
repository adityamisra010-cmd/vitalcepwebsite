'use client';

import { useNavigate } from '../lib/navigation';
import {
  TrendingUp, Clock, AlertTriangle, CheckCircle2,
  ArrowRight, MoreHorizontal, Zap, Users, Eye
} from 'lucide-react';
import { useRole } from '../context/RoleContext';
import {
  assets, clients, designers, activityItems,
  statusConfig, priorityConfig, getClient, getCampaign,
  type Asset
} from '../data/mockData';
import { cn } from '../lib/utils';

const kanbanColumns = [
  'brief_received', 'generating', 'internal_review',
  'revision_required', 'client_review', 'approved', 'published'
] as const;

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">{label}</div>
      <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: color || 'var(--foreground)' }}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function AssetKanbanCard({ asset }: { asset: Asset }) {
  const navigate = useNavigate();
  const client = getClient(asset.clientId);
  const { color: priorityColor, label: priorityLabel } = priorityConfig[asset.priority];
  return (
    <div
      onClick={() => navigate(`/assets/${asset.id}`)}
      className="bg-secondary rounded-lg p-3 cursor-pointer hover:border-border/60 border border-border/30 hover:bg-secondary/80 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">{asset.name}</span>
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: priorityColor }} title={priorityLabel} />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
          style={{ backgroundColor: client?.color || '#6b7280' }}
        >
          {client?.initials[0]}
        </div>
        <span className="truncate">{client?.name}</span>
      </div>
      <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
        <span>V{asset.currentVersion} · {asset.revisionCount}r</span>
        <span>{asset.dueDate}</span>
      </div>
    </div>
  );
}

function FounderDashboard() {
  const navigate = useNavigate();
  const awaitingReview = assets.filter(a => a.status === 'internal_review').length;
  const awaitingClient = assets.filter(a => a.status === 'client_review').length;
  const overdue = assets.filter(a => new Date(a.dueDate) < new Date() && a.status !== 'approved' && a.status !== 'published').length;
  const approved = assets.filter(a => a.status === 'approved' || a.status === 'published').length;

  const clientBottlenecks = clients.map(c => ({
    client: c,
    waitingAssets: assets.filter(a => a.clientId === c.id && a.status === 'client_review').length,
  })).filter(x => x.waitingAssets > 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Good morning, Maya</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening across your agency today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Assets" value={assets.filter(a => !['approved','published'].includes(a.status)).length} sub={`${assets.length} total`} />
        <StatCard label="Awaiting Review" value={awaitingReview} sub="Internal queue" color="#3b82f6" />
        <StatCard label="Client Review" value={awaitingClient} sub="Awaiting client" color="#f59e0b" />
        <StatCard label="Overdue" value={overdue} sub="Needs attention" color={overdue > 0 ? '#ef4444' : undefined} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Approval Rate" value="88%" sub="+6% vs last month" color="#10b981" />
        <StatCard label="Avg Revisions" value="2.1" sub="Per asset this month" />
        <StatCard label="Avg Review Time" value="3.2d" sub="Client turnaround" />
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Review Queue */}
        <div className="bg-card border border-border rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>Review Queue</h3>
            <button onClick={() => navigate('/assets')} className="text-xs text-primary flex items-center gap-1 hover:underline">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {assets.filter(a => a.status === 'internal_review' || a.status === 'client_review').slice(0, 5).map(asset => {
              const client = getClient(asset.clientId);
              const cfg = statusConfig[asset.status];
              return (
                <div
                  key={asset.id}
                  onClick={() => navigate(`/assets/${asset.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                >
                  <img src={asset.previewUrl} alt={asset.name} className="w-10 h-10 rounded-md object-cover bg-secondary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">{client?.name} · Due {asset.dueDate}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Client Bottlenecks */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: 'var(--font-display)' }}>Client Bottlenecks</h3>
            {clientBottlenecks.length === 0 ? (
              <p className="text-xs text-muted-foreground">No bottlenecks — all clear!</p>
            ) : (
              <div className="space-y-2">
                {clientBottlenecks.map(({ client, waitingAssets }) => (
                  <div key={client.id} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: client.color }}>
                      {client.initials[0]}
                    </div>
                    <span className="text-xs flex-1 truncate">{client.name}</span>
                    <span className="text-xs font-semibold text-amber-400">{waitingAssets} pending</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Designer Workload */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-3" style={{ fontFamily: 'var(--font-display)' }}>Designer Workload</h3>
            <div className="space-y-2">
              {designers.map(d => (
                <div key={d.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{d.name}</span>
                    <span className="text-xs font-medium">{d.activeAssets} active</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(d.activeAssets / 10) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ fontFamily: 'var(--font-display)' }}>Recent Activity</h3>
        <div className="space-y-3">
          {activityItems.slice(0, 6).map((item) => (
            <div key={item.id} className="flex items-start gap-3 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium">{item.user}</span>
                <span className="text-muted-foreground"> {item.description}</span>
                {item.assetName && (
                  <button
                    onClick={() => item.assetId && navigate(`/assets/${item.assetId}`)}
                    className="text-primary hover:underline ml-1"
                  >
                    {item.assetName}
                  </button>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesignerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Good morning, Alex</h1>
        <p className="text-sm text-muted-foreground">You have {assets.filter(a => a.designerId === 'd1').length} assets in your queue.</p>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4 -mx-6 px-6">
        <div className="flex gap-4 min-w-max">
          {kanbanColumns.map(col => {
            const colAssets = assets.filter(a => a.status === col && a.designerId === 'd1');
            const cfg = statusConfig[col];
            return (
              <div key={col} className="w-64 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{cfg.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{colAssets.length}</span>
                </div>
                <div className="space-y-2 min-h-32">
                  {colAssets.map(asset => (
                    <AssetKanbanCard key={asset.id} asset={asset} />
                  ))}
                  {colAssets.length === 0 && (
                    <div className="h-16 rounded-lg border-2 border-dashed border-border/30 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground/40">Empty</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All assets kanban (shows all designers' assets for full picture) */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ fontFamily: 'var(--font-display)' }}>All Active Assets</h3>
        <div className="overflow-x-auto -mx-5 px-5 pb-2">
          <div className="flex gap-4 min-w-max">
            {kanbanColumns.filter(c => !['approved', 'published'].includes(c)).map(col => {
              const colAssets = assets.filter(a => a.status === col);
              const cfg = statusConfig[col];
              return (
                <div key={col} className="w-56 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{cfg.label}</span>
                    <span className="text-[10px] bg-muted rounded-full px-1.5 text-muted-foreground ml-auto">{colAssets.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {colAssets.slice(0, 3).map(asset => {
                      const client = getClient(asset.clientId);
                      return (
                        <div
                          key={asset.id}
                          onClick={() => navigate(`/assets/${asset.id}`)}
                          className="p-2.5 bg-secondary rounded-md cursor-pointer hover:bg-muted transition-colors"
                        >
                          <div className="text-xs font-medium truncate mb-1">{asset.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{client?.name}</div>
                        </div>
                      );
                    })}
                    {colAssets.length > 3 && (
                      <button
                        onClick={() => navigate('/assets')}
                        className="w-full text-[10px] text-primary text-center py-1 hover:underline"
                      >
                        +{colAssets.length - 3} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientDashboard() {
  const navigate = useNavigate();
  const clientAssets = assets.filter(a => a.clientId === 'c1');
  const pending = clientAssets.filter(a => a.status === 'client_review');
  const approved = clientAssets.filter(a => a.status === 'approved' || a.status === 'published');

  const sections = [
    { label: 'Pending Your Review', items: pending, emptyMsg: "You're all caught up!", accent: '#f59e0b' },
    { label: 'Approved Assets', items: approved, emptyMsg: 'No approved assets yet.', accent: '#10b981' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Good morning, Elena</h1>
        <p className="text-sm text-muted-foreground">Luminary Brands — {pending.length} asset{pending.length !== 1 ? 's' : ''} awaiting your review.</p>
      </div>

      {sections.map(({ label, items, emptyMsg, accent }) => (
        <div key={label}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
            <h2 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{label}</h2>
            <span className="text-xs text-muted-foreground">({items.length})</span>
          </div>
          {items.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <CheckCircle2 size={24} className="mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">{emptyMsg}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(asset => {
                const cfg = statusConfig[asset.status];
                return (
                  <div
                    key={asset.id}
                    onClick={() => navigate(`/assets/${asset.id}`)}
                    className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all group"
                  >
                    <div className="aspect-video bg-secondary overflow-hidden">
                      <img src={asset.previewUrl} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-medium mb-1 truncate">{asset.name}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">V{asset.currentVersion}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Due {asset.dueDate}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useRole();
  if (role === 'founder') return <FounderDashboard />;
  if (role === 'designer') return <DesignerDashboard />;
  return <ClientDashboard />;
}
