'use client';

import { useState } from 'react';
import { useParams, useNavigate } from '../lib/navigation';
import { ArrowLeft, Sparkles, Copy, RefreshCw, Check, Wand2 } from 'lucide-react';
import { getAsset } from '../data/mockData';

const generatedPrompt = `You are a professional graphic designer creating a revised version of the Luminary Brands SS25 Instagram campaign hero banner.

**BRIEF CONTEXT**
Campaign: SS25 "Summer Drop 2025" by Luminary Brands
Platform: Instagram 1:1 feed (1080x1080px)
Objective: Drive awareness and direct traffic to /collections/ss25 within 48 hours of posting

**BRAND STANDARDS**
- Primary color: Luminary Purple (#6B21E8)
- Typography: Bricolage Grotesque, weight 700 for headlines
- Logo: Minimum 64px height, top-left placement, 24px padding
- Tone: Editorial, minimal, confident. No clutter.

**REVISION REQUIREMENTS (from approved consolidation)**
1. CRITICAL: Add "T&Cs apply" in 8pt minimum font below the promotional price
2. CRITICAL: Increase logo to 64px height, reposition top-left with 24px padding
3. REQUIRED: Replace "New Collection" headline with "Summer Drop 2025"
4. REQUIRED: CTA button — apply #6B21E8 background, white text, 4px blur shadow at 20% opacity
5. OPTIONAL: Try Bricolage Grotesque 700 for the "SS25" callout

**VISUAL DIRECTION**
Full-bleed editorial photography. Strong diagonal composition. Model gazing off-camera. Soft natural light. Maximum 2 text elements per frame. NO white backgrounds, NO busy compositions.

**DO NOT CHANGE**
- Overall layout structure (diagonal composition)
- Model photography treatment
- Background color palette
- Any element not referenced in revision requirements above

Output: Single revised 1080x1080px JPEG. Name file SS25_Hero_Instagram_V4.jpg`;

export default function AIPromptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = getAsset(id || '');
  const [prompt, setPrompt] = useState(generatedPrompt);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  if (!asset) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2000);
  };

  const inputs = [
    { label: 'Brief', status: 'loaded', items: ['Objective', 'Target Audience', 'Platform', 'Key Message', 'CTA', 'Do\'s and Don\'ts'] },
    { label: 'Brand Kit', status: 'loaded', items: ['Colors (#6B21E8, #F5F0FF)', 'Typography (Bricolage Grotesque)', 'Logo usage rules'] },
    { label: 'Current Version', status: 'loaded', items: ['V3 — SS25 Hero Instagram (uploaded 2025-05-08)'] },
    { label: 'Revision Package', status: 'loaded', items: ['2 critical tasks', '2 required tasks', '1 suggested task'] },
  ];

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/assets/${id}`)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
          <ArrowLeft size={16} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <Wand2 size={16} className="text-violet-400" />
            <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>AI Prompt Generator</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{asset.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Inputs Summary */}
        <div className="space-y-3 lg:col-span-1">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input Sources</h2>
          {inputs.map(input => (
            <div key={input.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-sm font-medium">{input.label}</span>
                <span className="ml-auto text-[10px] text-emerald-400 font-medium">✓ Loaded</span>
              </div>
              <ul className="space-y-0.5">
                {input.items.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="mt-1 flex-shrink-0">·</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Prompt Output */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Generated Prompt</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <><Check size={12} className="text-emerald-400" /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
              <button
                onClick={() => setPrompt(generatedPrompt)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw size={12} /> Reset
              </button>
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="w-full h-96 bg-card border border-border rounded-xl px-4 py-4 text-xs text-foreground outline-none resize-none focus:border-primary/50 transition-colors leading-relaxed"
            style={{ fontFamily: 'var(--font-mono)' }}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {generating ? (
                <><RefreshCw size={15} className="animate-spin" /> Generating Version...</>
              ) : (
                <><Sparkles size={15} /> Generate New Version</>
              )}
            </button>
            {generated && (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <Check size={15} /> Version generation initiated — check your design tool
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Edit the prompt above before generating. This prompt synthesizes your brief, brand kit, current asset, and revision package into a single structured instruction for your design AI.
          </p>
        </div>
      </div>
    </div>
  );
}
