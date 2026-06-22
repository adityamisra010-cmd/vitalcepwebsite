'use client';

import { useState } from 'react';
import { useNavigate } from '../lib/navigation';
import {
  Upload, MessageSquare, CheckCircle2, Package,
  FileText, History, Clock, Filter, type LucideIcon
} from 'lucide-react';
import { activityItems } from '../data/mockData';
import { cn } from '../lib/utils';

const typeConfig: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  version_upload: { icon: Upload, color: '#3b82f6', label: 'Upload' },
  feedback_submitted: { icon: MessageSquare, color: '#f59e0b', label: 'Feedback' },
  review_opened: { icon: History, color: '#8b5cf6', label: 'Review' },
  review_closed: { icon: CheckCircle2, color: '#10b981', label: 'Review' },
  asset_approved: { icon: CheckCircle2, color: '#10b981', label: 'Approval' },
  revision_approved: { icon: Package, color: '#06b6d4', label: 'Revision' },
  asset_published: { icon: Upload, color: '#6b7280', label: 'Publish' },
  brief_created: { icon: FileText, color: '#8b5cf6', label: 'Brief' },
};

// Extend mock activity for fuller feed
const extendedActivity = [
  ...activityItems,
  { id: 'act13', type: 'version_upload', description: 'uploaded V2', user: 'Tomás Rivera', timestamp: '2025-04-26T10:00:00Z', assetId: 'a9', assetName: 'Luminary — Brand Refresh Logo' },
  { id: 'act14', type: 'feedback_submitted', description: 'submitted 2 feedback items', user: 'Sasha Bloom', timestamp: '2025-04-25T14:00:00Z', assetId: 'a10', assetName: 'Verde — Social Post Series (6pc)' },
  { id: 'act15', type: 'review_opened', description: 'opened internal review cycle', user: 'Maya Chen', timestamp: '2025-04-24T09:00:00Z', assetId: 'a2', assetName: 'SS25 Campaign Video — 30s' },
  { id: 'act16', type: 'asset_approved', description: 'approved asset', user: 'David Frost', timestamp: '2025-04-23T16:00:00Z', assetId: 'a12', assetName: 'Frost — Digital Display Banner Set' },
  { id: 'act17', type: 'brief_created', description: 'created brief', user: 'Maya Chen', timestamp: '2025-04-22T11:00:00Z', assetId: 'a5', assetName: 'Nexus AI — Feature Explainer' },
  { id: 'act18', type: 'version_upload', description: 'uploaded V3', user: 'Alex Kim', timestamp: '2025-04-21T13:00:00Z', assetId: 'a7', assetName: 'Frost — Wealth Series Print Ad' },
];

const allTypes = ['All', 'Upload', 'Feedback', 'Review', 'Approval', 'Revision', 'Brief', 'Publish'];
const allUsers = ['All Users', 'Maya Chen', 'Alex Kim', 'Priya Sharma', 'Tomás Rivera', 'Elena Vasquez', 'James Park', 'Rohan Mehta', 'David Frost', 'Sasha Bloom'];

export default function ActivityPage() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState('All');
  const [userFilter, setUserFilter] = useState('All Users');

  const filtered = extendedActivity.filter(item => {
    const meta = typeConfig[item.type];
    const matchesType = typeFilter === 'All' || (meta && meta.label === typeFilter);
    const matchesUser = userFilter === 'All Users' || item.user === userFilter;
    return matchesType && matchesUser;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Group by date
  const grouped: { date: string; items: typeof filtered }[] = [];
  filtered.forEach(item => {
    const date = new Date(item.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const existing = grouped.find(g => g.date === date);
    if (existing) {
      existing.items.push(item);
    } else {
      grouped.push({ date, items: [item] });
    }
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Activity Feed</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Complete audit trail of all agency actions</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          {allTypes.map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                typeFilter === type ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              )}
            >
              {type}
            </button>
          ))}
        </div>
        <select
          value={userFilter}
          onChange={e => setUserFilter(e.target.value)}
          className="ml-auto bg-secondary border border-border/50 rounded-lg px-3 py-1.5 text-sm text-foreground outline-none cursor-pointer"
        >
          {allUsers.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>

      {/* Activity Groups */}
      <div className="max-w-2xl space-y-6">
        {grouped.map(({ date, items }) => (
          <div key={date}>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-background py-1">{date}</div>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border/50" />
              <div className="space-y-0">
                {items.map((item, i) => {
                  const meta = typeConfig[item.type] || { icon: Clock, color: '#6b7280', label: 'Event' };
                  const Icon = meta.icon;
                  const isLast = i === items.length - 1;
                  return (
                    <div key={item.id} className="flex items-start gap-4 py-3 pl-1">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 relative"
                        style={{ backgroundColor: `${meta.color}20`, border: `1px solid ${meta.color}40` }}
                      >
                        <Icon size={12} style={{ color: meta.color }} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="text-sm flex items-baseline gap-1 flex-wrap">
                          <span className="font-medium">{item.user}</span>
                          <span className="text-muted-foreground">{item.description}</span>
                          {item.assetName && (
                            <button
                              onClick={() => item.assetId && navigate(`/assets/${item.assetId}`)}
                              className="text-primary hover:underline font-medium"
                            >
                              {item.assetName}
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          <span className="ml-2 px-1.5 rounded text-[10px]" style={{ color: meta.color, backgroundColor: `${meta.color}15` }}>
                            {meta.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Clock size={24} className="mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No activity matches your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
