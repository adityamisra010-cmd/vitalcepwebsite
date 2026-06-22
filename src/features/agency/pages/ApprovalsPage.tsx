'use client';

import { useState } from 'react';
import { useNavigate } from '../lib/navigation';
import { CheckCircle2, X, AlertCircle, Eye, Filter, type LucideIcon } from 'lucide-react';
import {
  assets as mockAssets,
  clients as mockClients,
  campaigns as mockCampaigns,
  statusConfig,
  type Asset,
  type Client,
  type Campaign,
} from '../data/mockData';
import { cn } from '../lib/utils';

type Action = 'approved' | 'minor_edits' | 'changes_required';

interface ApprovalsPageProps {
  assets?: Asset[];
  clients?: Client[];
  campaigns?: Campaign[];
}

export default function ApprovalsPage(props: ApprovalsPageProps = {}) {
  const assets = props.assets?.length ? props.assets : mockAssets;
  const clients = props.clients?.length ? props.clients : mockClients;
  const campaigns = props.campaigns?.length ? props.campaigns : mockCampaigns;
  const getClient = (id: string) => clients.find((c) => c.id === id);
  const getCampaign = (id: string) => campaigns.find((c) => c.id === id);

  const navigate = useNavigate();
  const [decisions, setDecisions] = useState<Record<string, Action>>({});
  const [filter, setFilter] = useState<'all' | 'internal' | 'client'>('all');

  const pendingAssets = assets.filter(a =>
    a.status === 'internal_review' || a.status === 'client_review'
  ).filter(a => !decisions[a.id]);

  const decidedAssets = assets.filter(a => decisions[a.id]);

  const handleDecision = (assetId: string, action: Action) => {
    setDecisions(prev => ({ ...prev, [assetId]: action }));
  };

  const actionConfig: Record<Action, { label: string; color: string; bg: string; icon: LucideIcon }> = {
    approved: { label: 'Approved', color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: CheckCircle2 },
    minor_edits: { label: 'Approved w/ Minor Edits', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: AlertCircle },
    changes_required: { label: 'Changes Required', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: X },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Approvals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{pendingAssets.length} assets awaiting decision</p>
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 border border-border/50">
          {(['all', 'internal', 'client'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize',
                filter === f ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {f === 'all' ? 'All' : f === 'internal' ? 'Internal' : 'Client'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pendingAssets.length, color: '#f59e0b' },
          { label: 'Approved Today', value: Object.values(decisions).filter(d => d === 'approved').length, color: '#10b981' },
          { label: 'Changes Required', value: Object.values(decisions).filter(d => d === 'changes_required').length, color: '#ef4444' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color }}>{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      {pendingAssets.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Awaiting Decision</h2>
          <div className="space-y-3">
            {pendingAssets.map(asset => {
              const client = getClient(asset.clientId);
              const campaign = getCampaign(asset.campaignId);
              const statusCfg = statusConfig[asset.status];
              return (
                <div key={asset.id} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={asset.previewUrl}
                      alt={asset.name}
                      className="w-20 h-14 rounded-lg object-cover bg-secondary flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-sm mb-0.5 truncate">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">{client?.name} · {campaign?.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}>
                              {statusCfg.label}
                            </span>
                            <span className="text-xs text-muted-foreground">V{asset.currentVersion} · Due {asset.dueDate}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/assets/${asset.id}`)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                        >
                          <Eye size={13} /> Preview
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleDecision(asset.id, 'approved')}
                          className="flex items-center gap-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-600/30 transition-colors"
                        >
                          <CheckCircle2 size={13} /> Approve
                        </button>
                        <button
                          onClick={() => handleDecision(asset.id, 'minor_edits')}
                          className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors"
                        >
                          <AlertCircle size={13} /> Minor Edits
                        </button>
                        <button
                          onClick={() => handleDecision(asset.id, 'changes_required')}
                          className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <X size={13} /> Request Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Decided */}
      {decidedAssets.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Decided</h2>
          <div className="space-y-2">
            {decidedAssets.map(asset => {
              const client = getClient(asset.clientId);
              const decision = decisions[asset.id];
              const cfg = actionConfig[decision];
              const Icon = cfg.icon;
              return (
                <div key={asset.id} className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-4 opacity-75">
                  <img src={asset.previewUrl} alt="" className="w-12 h-8 rounded-md object-cover bg-secondary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{asset.name}</div>
                    <div className="text-xs text-muted-foreground">{client?.name}</div>
                  </div>
                  <span className="text-xs flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
                    <Icon size={11} />{cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pendingAssets.length === 0 && decidedAssets.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <CheckCircle2 size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground text-sm">No assets awaiting approval</p>
        </div>
      )}
    </div>
  );
}
