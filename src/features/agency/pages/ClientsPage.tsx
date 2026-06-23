'use client';

import { useState } from 'react';
import { useNavigate } from '../lib/navigation';
import { Search, ExternalLink, Mail, TrendingUp, BarChart2, ImageIcon, Briefcase } from 'lucide-react';
import {
  clients as mockClients,
  assets as mockAssets,
  campaigns as mockCampaigns,
  type Client,
  type Asset,
  type Campaign,
} from '../data/mockData';
import { cn } from '../lib/utils';
import { NewClientButton } from '../components/NewClientButton';

interface ClientsPageProps {
  clients?: Client[];
  assets?: Asset[];
  campaigns?: Campaign[];
}

export default function ClientsPage(props: ClientsPageProps = {}) {
  const clients = props.clients?.length ? props.clients : mockClients;
  const assets = props.assets ?? mockAssets;
  const campaigns = props.campaigns ?? mockCampaigns;

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const selected = clients.find(c => c.id === selectedClient);
  const selectedAssets = assets.filter(a => a.clientId === selectedClient);
  const selectedCampaigns = campaigns.filter(c => c.clientId === selectedClient);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Client List */}
      <div className={cn('flex flex-col border-r border-border transition-all', selectedClient ? 'w-72 flex-shrink-0' : 'flex-1')}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Clients</h1>
            <NewClientButton />
          </div>
          <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 border border-border/50">
            <Search size={14} className="text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="bg-transparent text-sm flex-1 outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map(client => {
            const clientAssets = assets.filter(a => a.clientId === client.id);
            const clientCampaigns = campaigns.filter(c => c.clientId === client.id);
            const isSelected = selectedClient === client.id;
            return (
              <div
                key={client.id}
                onClick={() => setSelectedClient(isSelected ? null : client.id)}
                className={cn(
                  'rounded-xl p-4 cursor-pointer border transition-all',
                  isSelected
                    ? 'bg-secondary border-primary/30 shadow-lg shadow-primary/5'
                    : 'bg-card border-border hover:border-border/60 hover:bg-secondary/50'
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: client.color }}
                  >
                    {client.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{client.name}</div>
                    <div className="text-xs text-muted-foreground">{client.industry}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>{clientCampaigns.length}</div>
                    <div className="text-[10px] text-muted-foreground">Campaigns</div>
                  </div>
                  <div>
                    <div className="text-base font-bold" style={{ fontFamily: 'var(--font-display)' }}>{clientAssets.length}</div>
                    <div className="text-[10px] text-muted-foreground">Assets</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-emerald-400" style={{ fontFamily: 'var(--font-display)' }}>{client.approvalRate}%</div>
                    <div className="text-[10px] text-muted-foreground">Approval</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Client Detail Panel */}
      {selected && (
        <div className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                style={{ backgroundColor: selected.color }}
              >
                {selected.initials}
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{selected.name}</h2>
                <p className="text-sm text-muted-foreground">{selected.industry}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/assets?client=' + selected.id)}
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              View assets <ExternalLink size={13} />
            </button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Active Campaigns', value: selectedCampaigns.filter(c => c.status === 'active').length, icon: Briefcase },
              { label: 'Active Assets', value: selectedAssets.filter(a => !['approved','published'].includes(a.status)).length, icon: ImageIcon },
              { label: 'Approval Rate', value: `${selected.approvalRate}%`, icon: TrendingUp },
              { label: 'Avg Revisions', value: selected.avgRevisions, icon: BarChart2 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4">
                <Icon size={16} className="text-muted-foreground mb-2" />
                <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {/* Contacts */}
          <div className="bg-card border border-border rounded-xl p-5 mb-4">
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Contacts</h3>
            <div className="space-y-3">
              {selected.contacts.map(contact => (
                <div key={contact.email} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: selected.color }}
                  >
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{contact.name}</div>
                    <div className="text-xs text-muted-foreground">{contact.role}</div>
                  </div>
                  <a href={`mailto:${contact.email}`} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <Mail size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Campaigns */}
          <div className="bg-card border border-border rounded-xl p-5 mb-4">
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Campaigns</h3>
            <div className="space-y-2">
              {selectedCampaigns.map(camp => {
                const pct = Math.round((camp.completedAssets / camp.totalAssets) * 100);
                const statusColors = { active: '#10b981', completed: '#6b7280', paused: '#f59e0b' };
                return (
                  <div key={camp.id} className="p-3 rounded-lg bg-secondary">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium truncate">{camp.name}</span>
                      <span className="text-xs ml-2 flex-shrink-0" style={{ color: statusColors[camp.status] }}>{camp.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">{camp.completedAssets}/{camp.totalAssets}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Assets */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Active Assets</h3>
              <button onClick={() => navigate('/assets')} className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="space-y-2">
              {selectedAssets.slice(0, 4).map(asset => (
                <div
                  key={asset.id}
                  onClick={() => navigate(`/assets/${asset.id}`)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                >
                  <img src={asset.previewUrl} alt={asset.name} className="w-8 h-8 rounded-md object-cover bg-secondary flex-shrink-0" />
                  <span className="text-sm truncate flex-1">{asset.name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">V{asset.currentVersion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!selectedClient && (
        <div className="hidden" />
      )}
    </div>
  );
}
