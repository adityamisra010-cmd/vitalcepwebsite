'use client';

import { useState } from 'react';
import { useNavigate } from '../lib/navigation';
import {
  Search, Kanban, List, Table2, Calendar,
  Filter, SlidersHorizontal, Plus, ChevronDown, ArrowRight
} from 'lucide-react';
import {
  assets, clients, statusConfig, priorityConfig,
  getClient, getCampaign, type AssetStatus, type Priority
} from '../data/mockData';
import { cn } from '../lib/utils';

const kanbanColumns: AssetStatus[] = [
  'brief_received', 'generating', 'internal_review',
  'revision_required', 'client_review', 'approved', 'published'
];

type ViewMode = 'kanban' | 'list' | 'table';

function AssetCard({ assetId }: { assetId: string }) {
  const navigate = useNavigate();
  const asset = assets.find(a => a.id === assetId)!;
  const client = getClient(asset.clientId);
  const { color: priorityColor } = priorityConfig[asset.priority];
  const cfg = statusConfig[asset.status];

  return (
    <div
      onClick={() => navigate(`/assets/${asset.id}`)}
      className="bg-secondary border border-border/30 rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all group"
    >
      <div className="aspect-video bg-muted overflow-hidden">
        <img src={asset.previewUrl} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-medium line-clamp-2 leading-tight group-hover:text-primary transition-colors">{asset.name}</span>
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: priorityColor }} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {client && (
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: client.color }}>
                {client.initials[0]}
              </div>
            )}
            <span className="text-[10px] text-muted-foreground truncate">{client?.name}</span>
          </div>
          <span className="text-[10px] font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
        </div>
      </div>
    </div>
  );
}

function KanbanView({ filtered }: { filtered: string[] }) {
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto pb-4 -mx-6 px-6 flex-1">
      <div className="flex gap-4 min-w-max h-full">
        {kanbanColumns.map(col => {
          const colAssets = assets.filter(a => a.status === col && filtered.includes(a.id));
          const cfg = statusConfig[col];
          return (
            <div key={col} className="w-64 flex-shrink-0 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{cfg.label}</span>
                <span className="ml-auto text-xs bg-muted rounded-full px-1.5 text-muted-foreground">{colAssets.length}</span>
              </div>
              <div className="space-y-2 flex-1">
                {colAssets.map(asset => {
                  const client = getClient(asset.clientId);
                  const { color: priorityColor } = priorityConfig[asset.priority];
                  return (
                    <div
                      key={asset.id}
                      onClick={() => navigate(`/assets/${asset.id}`)}
                      className="bg-card border border-border/30 rounded-lg p-3 cursor-pointer hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">{asset.name}</span>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: priorityColor }} />
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        {client && (
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: client.color }}>
                            {client.initials[0]}
                          </div>
                        )}
                        <span className="truncate">{client?.name}</span>
                        <span className="ml-auto flex-shrink-0">V{asset.currentVersion}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">Due {asset.dueDate}</div>
                    </div>
                  );
                })}
                {colAssets.length === 0 && (
                  <div className="h-16 rounded-lg border-2 border-dashed border-border/20 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground/30">Empty</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListView({ filtered }: { filtered: string[] }) {
  const navigate = useNavigate();
  const filteredAssets = assets.filter(a => filtered.includes(a.id));
  return (
    <div className="space-y-2">
      {filteredAssets.map(asset => {
        const client = getClient(asset.clientId);
        const campaign = getCampaign(asset.campaignId);
        const cfg = statusConfig[asset.status];
        const { color: priorityColor, label: priorityLabel } = priorityConfig[asset.priority];
        return (
          <div
            key={asset.id}
            onClick={() => navigate(`/assets/${asset.id}`)}
            className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-all flex items-center gap-4"
          >
            <img src={asset.previewUrl} alt={asset.name} className="w-12 h-12 rounded-lg object-cover bg-secondary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm mb-0.5 truncate">{asset.name}</div>
              <div className="text-xs text-muted-foreground">{client?.name} · {campaign?.name}</div>
            </div>
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priorityColor }} title={priorityLabel} />
            </div>
            <div className="hidden md:block flex-shrink-0 text-xs text-muted-foreground">V{asset.currentVersion} · {asset.revisionCount}r</div>
            <div className="flex-shrink-0">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
                {cfg.label}
              </span>
            </div>
            <div className="hidden lg:block text-xs text-muted-foreground flex-shrink-0">{asset.dueDate}</div>
            <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
          </div>
        );
      })}
    </div>
  );
}

function TableView({ filtered }: { filtered: string[] }) {
  const navigate = useNavigate();
  const filteredAssets = assets.filter(a => filtered.includes(a.id));
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {['Asset', 'Client', 'Status', 'Priority', 'Designer', 'Version', 'Due Date'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((asset, i) => {
            const client = getClient(asset.clientId);
            const cfg = statusConfig[asset.status];
            const { color: priorityColor, label: priorityLabel } = priorityConfig[asset.priority];
            return (
              <tr
                key={asset.id}
                className={cn('border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors', i === filteredAssets.length - 1 && 'border-b-0')}
                onClick={() => navigate(`/assets/${asset.id}`)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <img src={asset.previewUrl} alt="" className="w-8 h-8 rounded-md object-cover bg-secondary flex-shrink-0" />
                    <span className="text-sm font-medium truncate max-w-48">{asset.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {client && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: client.color }}>
                        {client.initials[0]}
                      </div>
                      <span className="text-sm text-muted-foreground">{client.name}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
                    {cfg.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priorityColor }} />
                    <span className="text-sm text-muted-foreground">{priorityLabel}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">Alex Kim</td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">V{asset.currentVersion}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{asset.dueDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function AssetsPage() {
  const [view, setView] = useState<ViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesClient = clientFilter === 'all' || a.clientId === clientFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesClient && matchesStatus;
  }).map(a => a.id);

  const views = [
    { id: 'kanban' as ViewMode, icon: Kanban, label: 'Kanban' },
    { id: 'list' as ViewMode, icon: List, label: 'List' },
    { id: 'table' as ViewMode, icon: Table2, label: 'Table' },
  ];

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Assets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} of {assets.length} assets</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={15} />
          New Asset
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 border border-border/50 flex-1 min-w-48 max-w-72">
          <Search size={14} className="text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assets..."
            className="bg-transparent text-sm flex-1 outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Client filter */}
        <select
          value={clientFilter}
          onChange={e => setClientFilter(e.target.value)}
          className="bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground outline-none cursor-pointer"
        >
          <option value="all">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-secondary border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground outline-none cursor-pointer"
        >
          <option value="all">All Status</option>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        {/* View switcher */}
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 border border-border/50 ml-auto">
          {views.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              title={label}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                view === id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* View */}
      <div className={cn('flex-1', view === 'kanban' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto')}>
        {view === 'kanban' && <KanbanView filtered={filtered} />}
        {view === 'list' && <ListView filtered={filtered} />}
        {view === 'table' && <TableView filtered={filtered} />}
      </div>
    </div>
  );
}
