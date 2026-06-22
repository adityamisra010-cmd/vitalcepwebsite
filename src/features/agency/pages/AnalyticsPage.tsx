'use client';

import type { ReactNode } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  approvalRateData, revisionCountData, reviewTimeData,
  feedbackTypeData, clients, designers
} from '../data/mockData';

const PURPLE = 'oklch(0.63 0.25 282)';
const BLUE = '#3b82f6';
const GREEN = '#10b981';
const AMBER = '#f59e0b';

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: '#0d0c1e',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  color: '#e2e0ef',
  fontSize: '12px',
};

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Performance metrics across all clients and campaigns</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Approval Rate', value: '88%', delta: '+6%', color: GREEN, deltaPositive: true },
          { label: 'Avg Revision Count', value: '2.1', delta: '-0.4', color: PURPLE, deltaPositive: true },
          { label: 'Avg Review Time', value: '3.2d', delta: '-1.1d', color: BLUE, deltaPositive: true },
          { label: 'Asset Throughput', value: '8/mo', delta: '+2', color: AMBER, deltaPositive: true },
        ].map(({ label, value, delta, color, deltaPositive }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{label}</div>
            <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color }}>{value}</div>
            <div className="text-xs font-medium" style={{ color: deltaPositive ? GREEN : '#ef4444' }}>{delta} vs last month</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Approval Rate" sub="Monthly approval rate (%)">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={approvalRateData}>
              <defs>
                <linearGradient id="approvalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#6b6b9a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#6b6b9a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="rate" stroke="#7c3aed" fill="url(#approvalGrad)" strokeWidth={2} dot={{ fill: '#7c3aed', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Avg Revision Count by Client" sub="Lower is better">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revisionCountData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="client" tick={{ fill: '#6b6b9a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b6b9a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="avg" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Review Time Trend" sub="Internal vs client review time (days)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={reviewTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: '#6b6b9a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b6b9a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#6b6b9a' }} />
              <Line type="monotone" dataKey="internal" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3, fill: '#7c3aed' }} name="Internal" />
              <Line type="monotone" dataKey="client" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b' }} name="Client" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Feedback Type Distribution" sub="Most common feedback categories">
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={feedbackTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {feedbackTypeData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {feedbackTypeData.map(item => (
                <div key={item.type} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground flex-1 truncate">{item.type}</span>
                  <span className="text-xs font-mono text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Designer Performance */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ fontFamily: 'var(--font-display)' }}>Designer Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {designers.map(d => (
            <div key={d.id} className="bg-secondary rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {d.initials}
                </div>
                <div>
                  <div className="text-sm font-medium">{d.name}</div>
                  <div className="text-xs text-muted-foreground">Designer</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{d.activeAssets}</div>
                  <div className="text-[10px] text-muted-foreground">Active</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-display)' }}>{d.completedThisMonth}</div>
                  <div className="text-[10px] text-muted-foreground">Completed</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Delays */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm mb-4" style={{ fontFamily: 'var(--font-display)' }}>Client Review Delays</h3>
        <div className="space-y-3">
          {clients.map(c => {
            const delay = c.avgRevisions * 1.2;
            const maxDelay = 6;
            return (
              <div key={c.id} className="flex items-center gap-4">
                <div className="flex items-center gap-2 w-36 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ backgroundColor: c.color }}>
                    {c.initials[0]}
                  </div>
                  <span className="text-sm truncate">{c.name}</span>
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(delay / maxDelay) * 100}%`, backgroundColor: delay > 3 ? AMBER : GREEN }} />
                </div>
                <span className="text-xs font-mono text-muted-foreground w-12 text-right">{delay.toFixed(1)}d avg</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
