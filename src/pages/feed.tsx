import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import MapView from '@/components/MapView';
import IssueCard from '@/components/IssueCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchIssues } from '@/lib/firestore';
import { Issue, Category, IssueStatus } from '@/types';

export default function PublicFeed() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<IssueStatus | 'all'>('all');

  const loadIssues = useCallback(async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (filterCategory !== 'all') filters.category = filterCategory;
      if (filterStatus !== 'all') filters.status = filterStatus;
      
      const data = await fetchIssues(filters);
      setIssues(data);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterStatus]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  return (
    <Layout>
      <Head>
        <title>Public Accountability Feed | CivicPulse</title>
      </Head>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        {/* Left Sidebar: Live Issues */}
        <div className="w-full lg:w-1/3 overflow-y-auto bg-gray-50 border-r border-gray-200">
          <div className="p-4 sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary mb-4">Live Accountability Feed</h1>
            
            <div className="flex flex-wrap gap-2 mb-2">
              <select 
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
              >
                <option value="all">All Categories</option>
                <option value="road_damage">Road Damage</option>
                <option value="garbage">Garbage</option>
                <option value="water_leak">Water Leak</option>
                <option value="broken_infra">Broken Infra</option>
                <option value="other">Other</option>
              </select>

              <select 
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="p-4 grid gap-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="md" />
              </div>
            ) : issues.length > 0 ? (
              issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No issues found matching your filters.
              </div>
            )}
          </div>
        </div>

        {/* Main Content: Map View */}
        <div className="hidden lg:block lg:flex-1 relative">
          <MapView issues={issues} className="h-full w-full" />
          
          {/* CPI Mini Dashboard Overlay */}
          <div className="absolute top-4 right-4 z-[400] bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64">
            <h3 className="text-sm font-bold mb-3 border-b pb-1">City Health Index</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span>Downtown Central</span>
                  <span className="font-bold text-green-600">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span>Suburban North</span>
                  <span className="font-bold text-amber-500">64%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-4 text-[10px] bg-primary text-white py-1 rounded hover:opacity-90">
              View Full Rankings
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
