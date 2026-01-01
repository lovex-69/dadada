import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { MOCK_CONTRACTORS } from '@/lib/responsibility';

const MOCK_WARDS_PERFORMANCE = [
  { name: 'Downtown Central', score: 82, resolved: 145, overdue: 12, trend: 'up' },
  { name: 'Suburban North', score: 64, resolved: 98, overdue: 24, trend: 'down' },
  { name: 'Eastern Industrial', score: 45, resolved: 67, overdue: 38, trend: 'stable' },
  { name: 'Western Greens', score: 91, resolved: 112, overdue: 5, trend: 'up' },
];

const MOCK_CONTRACTOR_STATS = MOCK_CONTRACTORS.map(c => ({
  ...c,
  score: Math.floor(Math.random() * 40) + 60,
  resolved: Math.floor(Math.random() * 100) + 50,
  overdue: Math.floor(Math.random() * 15),
}));

export default function RankingsPage() {
  return (
    <Layout>
      <Head>
        <title>City Performance Index | CivicPulse</title>
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-primary mb-2">Civic Performance Index (CPI)</h1>
          <p className="text-gray-600">
            Transparent metrics on ward and contractor performance. Data updated in real-time.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Ward Rankings */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-bold">Ward-wise Governance</h2>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Sort: Highest Score</span>
            </div>
            <div className="space-y-6">
              {MOCK_WARDS_PERFORMANCE.sort((a, b) => b.score - a.score).map((ward) => (
                <div key={ward.name} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800">{ward.name}</h3>
                    <div className="flex items-center">
                      <span className={`text-lg font-black ${ward.score > 80 ? 'text-green-600' : ward.score > 60 ? 'text-amber-500' : 'text-red-600'}`}>
                        {ward.score}%
                      </span>
                      {ward.trend === 'up' && <svg className="w-4 h-4 ml-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>}
                      {ward.trend === 'down' && <svg className="w-4 h-4 ml-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                    <div 
                      className={`h-2 rounded-full ${ward.score > 80 ? 'bg-green-500' : ward.score > 60 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: `${ward.score}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Resolved: <strong>{ward.resolved}</strong></span>
                    <span>Overdue: <strong className={ward.overdue > 20 ? 'text-red-600' : ''}>{ward.overdue}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contractor Profiles */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl font-bold">Contractor Accountability</h2>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Active Contracts</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4">Contractor</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4 text-center">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_CONTRACTOR_STATS.sort((a, b) => b.score - a.score).slice(0, 8).map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-gray-800 group-hover:text-primary transition-colors cursor-pointer">{c.name}</div>
                        <div className="text-[10px] text-gray-400">ID: {c.id}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${c.score > 85 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                          {c.score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-gray-100 rounded-full h-1 mr-2">
                             <div className="bg-primary h-1 rounded-full" style={{ width: `${c.score}%` }}></div>
                          </div>
                          <span className="text-[10px] font-medium text-gray-600">{c.score}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-gray-800 rounded-xl text-white">
              <h4 className="text-sm font-bold mb-1 italic">Pro Insight:</h4>
              <p className="text-xs text-gray-400">
                Wards with higher contractor compliance scores see a 42% faster resolution time on water leakage issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
