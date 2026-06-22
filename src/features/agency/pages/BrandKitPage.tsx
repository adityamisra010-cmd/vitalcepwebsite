'use client';

import { useState } from 'react';
import { clients } from '../data/mockData';
import { Upload, Plus, Type, Image, FileText, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';

const brandKit = {
  colors: [
    { name: 'Primary Purple', hex: '#6B21E8', usage: 'CTA, links, primary actions' },
    { name: 'Deep Indigo', hex: '#1E1B4B', usage: 'Backgrounds, dark surfaces' },
    { name: 'Lilac', hex: '#F5F0FF', usage: 'Light backgrounds, hover states' },
    { name: 'Warm White', hex: '#FAFAF9', usage: 'Page backgrounds, copy areas' },
    { name: 'Charcoal', hex: '#1C1C1E', usage: 'Primary text' },
    { name: 'Stone', hex: '#78716C', usage: 'Secondary text, captions' },
  ],
  fonts: [
    { name: 'Bricolage Grotesque', weights: ['400', '500', '600', '700'], usage: 'All headings, display text', sample: 'Summer Drop 2025' },
    { name: 'Inter', weights: ['400', '500', '600'], usage: 'Body copy, UI text', sample: 'Premium fashion for the discerning few.' },
  ],
  logos: [
    { name: 'Primary Lockup', variant: 'Dark Background', bg: '#1E1B4B' },
    { name: 'Primary Lockup', variant: 'Light Background', bg: '#FAFAF9' },
    { name: 'Icon Mark', variant: 'Purple', bg: '#6B21E8' },
    { name: 'Wordmark', variant: 'Mono Dark', bg: '#1C1C1E' },
  ],
  voice: [
    { principle: 'Confident', description: 'We speak with authority, never arrogance. Short sentences. Active voice.' },
    { principle: 'Minimal', description: 'Say exactly what needs to be said — no filler, no jargon, no corporate speak.' },
    { principle: 'Editorial', description: 'Our tone is closer to a fashion magazine than a retailer. Aspirational, never pushy.' },
    { principle: 'Direct', description: 'CTAs are imperatives: "Shop Now", "Explore SS25". Never "Click here to find out more".' },
  ],
  guidelines: [
    'Minimum logo clearspace: equal to the height of the "L" in Luminary on all sides.',
    'Never stretch or distort the logo.',
    'Do not apply drop shadows to the logo.',
    'Typography: never use all-caps for more than 4 words in a row.',
    'Photography must use natural light. Studio flash is prohibited.',
    'Lifestyle imagery must feature a maximum of 2 people per frame.',
  ],
};

const tabs = ['Colors', 'Typography', 'Logos', 'Voice', 'Guidelines', 'Assets'] as const;
type Tab = typeof tabs[number];

export default function BrandKitPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Colors');
  const [selectedClient, setSelectedClient] = useState('c1');

  const client = clients.find(c => c.id === selectedClient)!;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Brand Kits</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Visual identity and guidelines per client</p>
        </div>
        <button className="flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus size={15} />
          New Kit
        </button>
      </div>

      {/* Client selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {clients.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedClient(c.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
              selectedClient === c.id ? 'border-transparent text-white' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
            )}
            style={selectedClient === c.id ? { backgroundColor: c.color, borderColor: c.color } : {}}
          >
            <div
              className="w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
              style={{ backgroundColor: c.color }}
            >
              {c.initials[0]}
            </div>
            {c.name}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 border-b border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px',
              activeTab === tab ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Colors */}
      {activeTab === 'Colors' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {brandKit.colors.map(color => (
              <div key={color.name} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="h-20" style={{ backgroundColor: color.hex }} />
                <div className="p-3">
                  <div className="text-xs font-semibold mb-0.5 truncate">{color.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{color.hex}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{color.usage}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1.5 text-sm text-primary hover:underline">
            <Plus size={14} /> Add Color
          </button>
        </div>
      )}

      {/* Typography */}
      {activeTab === 'Typography' && (
        <div className="space-y-4 max-w-2xl">
          {brandKit.fonts.map(font => (
            <div key={font.name} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Type size={16} className="text-muted-foreground" />
                    <span className="font-semibold text-sm">{font.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{font.usage}</div>
                </div>
                <div className="flex gap-1">
                  {font.weights.map(w => (
                    <span key={w} className="text-[10px] bg-secondary rounded px-1.5 py-0.5 text-muted-foreground font-mono">{w}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {font.weights.slice(0, 2).map(w => (
                  <div key={w} className="flex items-baseline gap-4">
                    <span className="text-[10px] text-muted-foreground w-8 font-mono flex-shrink-0">{w}</span>
                    <span
                      className="text-2xl truncate"
                      style={{ fontFamily: font.name === 'Bricolage Grotesque' ? 'var(--font-display)' : 'var(--font-sans)', fontWeight: w }}
                    >
                      {font.sample}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logos */}
      {activeTab === 'Logos' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {brandKit.logos.map((logo, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <div
                  className="h-32 flex items-center justify-center"
                  style={{ backgroundColor: logo.bg }}
                >
                  <div
                    className="text-xl font-bold tracking-tight"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: logo.bg === '#6B21E8' || logo.bg === '#1E1B4B' || logo.bg === '#1C1C1E' ? '#fff' : '#1C1C1E'
                    }}
                  >
                    {logo.name === 'Icon Mark' ? 'L' : 'Luminary'}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs font-medium">{logo.name}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{logo.variant}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1.5 text-sm text-primary hover:underline">
            <Upload size={14} /> Upload Logo Variant
          </button>
        </div>
      )}

      {/* Voice */}
      {activeTab === 'Voice' && (
        <div className="max-w-2xl space-y-3">
          {brandKit.voice.map(v => (
            <div key={v.principle} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 size={14} className="text-muted-foreground" />
                <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{v.principle}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Guidelines */}
      {activeTab === 'Guidelines' && (
        <div className="max-w-2xl">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-muted-foreground" />
              <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>Usage Rules</span>
            </div>
            <ul className="space-y-3">
              {brandKit.guidelines.map((g, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xs text-muted-foreground font-mono mt-0.5 flex-shrink-0 w-5">{i + 1}.</span>
                  <span className="text-sm leading-relaxed">{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Reference Assets */}
      {activeTab === 'Assets' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop&auto=format',
              'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=400&fit=crop&auto=format',
            ].map((url, i) => (
              <div key={i} className="bg-secondary rounded-xl overflow-hidden aspect-square">
                <img src={url} alt={`Reference ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <button className="mt-4 flex items-center gap-1.5 text-sm text-primary hover:underline">
            <Plus size={14} /> Add Reference Asset
          </button>
        </div>
      )}
    </div>
  );
}
