'use client';

import { useState } from 'react';
import { useNavigate } from '../lib/navigation';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import {
  campaigns as mockCampaigns,
  clients as mockClients,
  type Campaign,
  type Client,
} from '../data/mockData';
import { cn } from '../lib/utils';
import { NewCampaignButton } from '../components/NewCampaignButton';

interface CampaignsPageProps {
  campaigns?: Campaign[];
  clients?: Client[];
}

export default function CampaignsPage(props: CampaignsPageProps = {}) {
  const campaigns = props.campaigns?.length ? props.campaigns : mockCampaigns;
  const clients = props.clients?.length ? props.clients : mockClients;
  const getClient = (id: string) => clients.find((c) => c.id === id);

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  const filtered = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    active: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Active' },
    completed: { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', label: 'Completed' },
    paused: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Paused' },
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{campaigns.length} total · {campaigns.filter(c => c.status === 'active').length} active</p>
        </div>
        <NewCampaignButton clients={clients} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 border border-border/50 w-64">
          <Search size={14} className="text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="bg-transparent text-sm flex-1 outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 border border-border/50">
          {(['all', 'active', 'paused', 'completed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize',
                statusFilter === s ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active', count: campaigns.filter(c => c.status === 'active').length, color: '#10b981' },
          { label: 'Paused', count: campaigns.filter(c => c.status === 'paused').length, color: '#f59e0b' },
          { label: 'Completed', count: campaigns.filter(c => c.status === 'completed').length, color: '#6b7280' },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color }}>{count}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Campaign Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Campaign</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Client</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Timeline</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((campaign, i) => {
              const client = getClient(campaign.clientId);
              const pct = Math.round((campaign.completedAssets / campaign.totalAssets) * 100);
              const cfg = statusColors[campaign.status];
              return (
                <tr
                  key={campaign.id}
                  className={cn('border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer', i === filtered.length - 1 && 'border-b-0')}
                  onClick={() => navigate('/assets')}
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-sm">{campaign.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 hidden lg:block line-clamp-1">{campaign.description}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {client && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ backgroundColor: client.color }}>
                          {client.initials[0]}
                        </div>
                        <span className="text-sm text-muted-foreground truncate">{client.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>{campaign.startDate} → {campaign.endDate}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden w-20">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 flex-shrink-0">{pct}%</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{campaign.completedAssets}/{campaign.totalAssets} assets</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                      <ArrowRight size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
