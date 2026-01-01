import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { Category, Severity } from '@/types';

const STAT_CARDS = [
  { label: 'Open Issues', value: 428, change: '+12%', sub: 'vs last week' },
  { label: 'Avg Resolution Time', value: '46h', change: '-4h', sub: 'improvement' },
  { label: 'Critical Overdue', value: 14, change: '+2', sub: 'needs attention', color: 'text-red-600' },
  { label: 'Total Budget Managed', value: '$2.4M', change: '84%', sub: 'SLA compliance' },
];

const CATEGORY_STATS: Record<Category, number> = {
  road_damage: 156,
  garbage: 89,
  water_leak: 42,
  broken_infra: 112,
  other: 29
};

export default function AdminDashboard() {
  return (
    <Layout>
      <Head>
        <title>Intelligence Dashboard | CivicPulse</title>
      </Head>

      <div className="bg-gray-900 text-white min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Infrastructure Health View</h1>
              <p className="text-gray-400 text-sm">Decision-grade analytics for city administrators.</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-white/10 hover:bg-white/20 text-xs font-bold px-4 py-2 rounded transition-colors border border-white/5">
                EXPORT PDF
              </button>
              <button className="bg-primary hover:bg-primary/90 text-xs font-bold px-4 py-2 rounded transition-colors">
                REFRESH DATA
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 p-5 rounded-xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-2xl font-black mb-2 ${stat.color || 'text-white'}`}>{stat.value}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${stat.change.startsWith('+') && stat.label.includes('Issues') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {stat.change}
                  </span>
                  <span className="text-[10px] text-gray-500">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Heatmap Placeholder */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-sm">City-wide Risk Heatmap</h3>
                  <div className="flex gap-4 text-[10px] font-bold text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Low Risk</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> High Risk</span>
                  </div>
                </div>
                <div className="h-[400px] bg-white/5 flex items-center justify-center relative">
                   <div className="text-gray-500 text-sm italic">Interactive GIS Heatmap Engine</div>
                   {/* Mock Heatmap Blobs */}
                   <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-red-500/20 rounded-full blur-3xl"></div>
                   <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl"></div>
                   <div className="absolute top-1/2 right-1/2 w-24 h-24 bg-red-500/10 rounded-full blur-3xl"></div>
                </div>
              </div>

              {/* Predictor */}
              <div className="bg-gradient-to-r from-primary/20 to-transparent border border-white/10 p-6 rounded-xl">
                 <h3 className="font-bold mb-4 flex items-center gap-2">
                   <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM5.884 6.607a1 1 0 01-.226 1.396l-1.003.813a1 1 0 11-1.27-1.559l1.003-.813a1 1 0 011.496.163zm9.502 1.396a1 1 0 01-1.396-.226l-.813-1.003a1 1 0 011.559-1.27l.813 1.003a1 1 0 01-.15 1.496zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm14 0a1 1 0 100-2h-1a1 1 0 100 2h1zM5.884 15.393a1 1 0 101.396-.226l-.813-1.003a1 1 0 10-1.559 1.27l.813 1.003zM11 18a1 1 0 100-2h-1a1 1 0 100 2h1zm5.116-2.607a1 1 0 00-.226-1.396l-1.003-.813a1 1 0 10-1.27 1.559l1.003.813a1 1 0 001.496-.163zM8 11a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /></svg>
                   Infrastructure Decay Prediction
                 </h3>
                 <p className="text-sm text-gray-400 mb-4">
                   Based on issue density and repeat problem frequency, the following zones are predicted to experience critical failures in the next 30 days:
                 </p>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5">
                       <span className="text-sm">Sector 4 Water Main</span>
                       <span className="text-xs font-bold text-red-400">92% Probability</span>
                    </div>
                    <div className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5">
                       <span className="text-sm">Bridge #421 Support Structure</span>
                       <span className="text-xs font-bold text-amber-400">74% Probability</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Side Analytics */}
            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                 <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-gray-500">Issues by Category</h3>
                 <div className="space-y-4">
                    {Object.entries(CATEGORY_STATS).map(([cat, count]) => (
                      <div key={cat}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="capitalize">{cat.replace('_', ' ')}</span>
                          <span>{count}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1">
                          <div className="bg-primary h-1 rounded-full" style={{ width: `${(count / 156) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
                 <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-gray-500">Top Delinquent Contractors</h3>
                 <div className="space-y-4">
                    {[
                      { name: 'Urban Build Ltd.', overdue: 18, rate: '42%' },
                      { name: 'CleanCity Solutions', overdue: 12, rate: '68%' },
                      { name: 'Regional Maintenance', overdue: 9, rate: '71%' },
                    ].map((c) => (
                      <div key={c.name} className="flex justify-between items-center group cursor-pointer">
                        <div>
                          <p className="text-xs font-bold group-hover:text-primary transition-colors">{c.name}</p>
                          <p className="text-[10px] text-gray-500">{c.overdue} Overdue Issues</p>
                        </div>
                        <span className="text-xs font-bold text-red-500">{c.rate}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
