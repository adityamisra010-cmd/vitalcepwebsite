'use client';

import { useState, type ReactNode } from 'react';
import { Check, Bell, Shield, Users, Palette, Zap, Globe, Mail, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { SignOutButton } from '../components/SignOutButton';

type Section = 'general' | 'notifications' | 'team' | 'integrations' | 'security';

const sections: { id: Section; label: string; icon: LucideIcon }[] = [
  { id: 'general', label: 'General', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'team', label: 'Team & Roles', icon: Users },
  { id: 'integrations', label: 'Integrations', icon: Zap },
  { id: 'security', label: 'Security', icon: Shield },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'relative w-9 h-5 rounded-full transition-colors flex-shrink-0',
        checked ? 'bg-primary' : 'bg-muted'
      )}
    >
      <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all', checked ? 'left-[18px]' : 'left-0.5')} />
    </button>
  );
}

function SettingRow({ label, sub, action }: { label: string; sub?: string; action: ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/50 last:border-b-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      {action}
    </div>
  );
}

export default function SettingsPage() {
  const [section, setSection] = useState<Section>('general');
  const [saved, setSaved] = useState(false);

  const [notifs, setNotifs] = useState({
    newFeedback: true,
    assetApproved: true,
    reviewDeadline: true,
    revisionReady: true,
    clientComment: true,
    weeklyDigest: false,
  });

  const [general, setGeneral] = useState({
    agencyName: 'Pivot Creative',
    timezone: 'Asia/Kolkata',
    defaultDeadline: '7',
    autoConsolidate: true,
    requireFounderApproval: true,
    clientFeedbackGuide: false,
  });

  const toggleNotif = (key: keyof typeof notifs) => setNotifs(n => ({ ...n, [key]: !n[key] }));
  const toggleGeneral = (key: keyof typeof general) => setGeneral(g => ({ ...g, [key]: !g[key as keyof typeof general] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const teamMembers = [
    { name: 'Maya Chen', email: 'maya@pivotcreative.co', role: 'Founder', initials: 'MC', color: '#7c3aed' },
    { name: 'Alex Kim', email: 'alex@pivotcreative.co', role: 'Designer', initials: 'AK', color: '#3b82f6' },
    { name: 'Priya Sharma', email: 'priya@pivotcreative.co', role: 'Designer', initials: 'PS', color: '#8b5cf6' },
    { name: 'Tomás Rivera', email: 'tomas@pivotcreative.co', role: 'Designer', initials: 'TR', color: '#06b6d4' },
  ];

  const integrations = [
    { name: 'Figma', desc: 'Design handoff and asset export', connected: true, icon: '◈' },
    { name: 'Frame.io', desc: 'Video review and approval', connected: false, icon: '▶' },
    { name: 'Slack', desc: 'Activity notifications and alerts', connected: true, icon: '#' },
    { name: 'Google Drive', desc: 'Asset storage and delivery', connected: false, icon: '△' },
    { name: 'Notion', desc: 'Brief and documentation sync', connected: false, icon: 'N' },
  ];

  return (
    <div className="p-6 flex gap-6">
      {/* Sidebar nav */}
      <div className="w-48 flex-shrink-0">
        <h1 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Settings</h1>
        <div className="mb-4">
          <SignOutButton />
        </div>
        <nav className="space-y-0.5">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                section === s.id ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              <s.icon size={14} className={section === s.id ? 'text-primary' : ''} />
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl">
        {/* General */}
        {section === 'general' && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-1">
            <h2 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>General</h2>
            <SettingRow
              label="Agency Name"
              sub="Used in client communications and exports"
              action={
                <input
                  value={general.agencyName}
                  onChange={e => setGeneral(g => ({ ...g, agencyName: e.target.value }))}
                  className="bg-secondary border border-border/50 rounded-lg px-3 py-1.5 text-sm outline-none w-48 focus:border-primary/50"
                />
              }
            />
            <SettingRow
              label="Timezone"
              action={
                <select
                  value={general.timezone}
                  onChange={e => setGeneral(g => ({ ...g, timezone: e.target.value }))}
                  className="bg-secondary border border-border/50 rounded-lg px-3 py-1.5 text-sm outline-none cursor-pointer"
                >
                  <option value="Asia/Kolkata">IST (UTC+5:30)</option>
                  <option value="America/New_York">EST (UTC-5)</option>
                  <option value="Europe/London">GMT (UTC+0)</option>
                </select>
              }
            />
            <SettingRow
              label="Default Asset Deadline"
              sub="Days from brief creation"
              action={
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={general.defaultDeadline}
                    onChange={e => setGeneral(g => ({ ...g, defaultDeadline: e.target.value }))}
                    className="bg-secondary border border-border/50 rounded-lg px-3 py-1.5 text-sm outline-none w-16 text-center"
                  />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              }
            />
            <SettingRow
              label="Auto-Consolidate Feedback"
              sub="Automatically run AI consolidation when review closes"
              action={<Toggle checked={general.autoConsolidate} onChange={() => toggleGeneral('autoConsolidate')} />}
            />
            <SettingRow
              label="Require Founder Approval"
              sub="Consolidation must be approved before revision package is generated"
              action={<Toggle checked={general.requireFounderApproval} onChange={() => toggleGeneral('requireFounderApproval')} />}
            />
            <SettingRow
              label="Client Feedback Guide"
              sub="Show onboarding tips to clients when they first review an asset"
              action={<Toggle checked={general.clientFeedbackGuide} onChange={() => toggleGeneral('clientFeedbackGuide')} />}
            />
          </div>
        )}

        {/* Notifications */}
        {section === 'notifications' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Notification Preferences</h2>
            <div className="space-y-1">
              {[
                { key: 'newFeedback', label: 'New Feedback Submitted', sub: 'When a reviewer adds feedback to an asset' },
                { key: 'assetApproved', label: 'Asset Approved', sub: 'When an asset receives final approval' },
                { key: 'reviewDeadline', label: 'Review Deadline Approaching', sub: '24 hours before a review cycle closes' },
                { key: 'revisionReady', label: 'Revision Package Ready', sub: 'When a designer marks revision package complete' },
                { key: 'clientComment', label: 'Client Comment', sub: 'When a client submits any feedback' },
                { key: 'weeklyDigest', label: 'Weekly Digest', sub: 'Summary of all activity sent every Monday' },
              ].map(({ key, label, sub }) => (
                <SettingRow
                  key={key}
                  label={label}
                  sub={sub}
                  action={<Toggle checked={notifs[key as keyof typeof notifs]} onChange={() => toggleNotif(key as keyof typeof notifs)} />}
                />
              ))}
            </div>
          </div>
        )}

        {/* Team */}
        {section === 'team' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Team Members</h2>
              <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                <Mail size={13} /> Invite Member
              </button>
            </div>
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div key={member.email} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: member.color }}>
                    {member.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                  </div>
                  <select
                    defaultValue={member.role}
                    className="bg-secondary border border-border/50 rounded-md px-2 py-1 text-xs outline-none cursor-pointer"
                  >
                    <option>Founder</option>
                    <option>Designer</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations */}
        {section === 'integrations' && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Integrations</h2>
            <div className="space-y-3">
              {integrations.map(integration => (
                <div key={integration.name} className="flex items-center gap-4 py-3 border-b border-border/50 last:border-b-0">
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-base font-bold text-muted-foreground flex-shrink-0">
                    {integration.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{integration.name}</div>
                    <div className="text-xs text-muted-foreground">{integration.desc}</div>
                  </div>
                  <button
                    className={cn(
                      'text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors flex-shrink-0',
                      integration.connected
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    {integration.connected ? '✓ Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security */}
        {section === 'security' && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-1">
            <h2 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Security</h2>
            <SettingRow
              label="Two-Factor Authentication"
              sub="Require 2FA for all team members"
              action={<Toggle checked={true} onChange={() => {}} />}
            />
            <SettingRow
              label="Client Session Timeout"
              sub="Auto-logout clients after inactivity"
              action={
                <select className="bg-secondary border border-border/50 rounded-lg px-3 py-1.5 text-sm outline-none">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>Never</option>
                </select>
              }
            />
            <SettingRow
              label="Audit Log Retention"
              sub="How long to keep the activity trail"
              action={
                <select className="bg-secondary border border-border/50 rounded-lg px-3 py-1.5 text-sm outline-none">
                  <option>90 days</option>
                  <option>1 year</option>
                  <option>Forever</option>
                </select>
              }
            />
            <SettingRow
              label="IP Allowlist"
              sub="Restrict access to known IP ranges"
              action={<Toggle checked={false} onChange={() => {}} />}
            />
          </div>
        )}

        {/* Save Button */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            {saved ? <><Check size={15} /> Saved</> : 'Save Changes'}
          </button>
          {saved && <span className="text-sm text-emerald-400">Settings saved successfully</span>}
        </div>
      </div>
    </div>
  );
}
