import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import IssueDetailPanel from '@/components/IssueDetailPanel';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getIssueById, incrementViewCount } from '@/lib/firestore';
import { Issue } from '@/types';

export default function IssueDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  const loadIssue = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getIssueById(id as string);
      setIssue(data);
    } catch (error) {
      console.error('Error loading issue:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadIssue();
      incrementViewCount(id as string);
    }
  }, [id, loadIssue]);

  return (
    <>
      <Head>
        <title>{issue ? `${issue.title} | CivicPulse` : 'Issue Details | CivicPulse'}</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK TO FEED
          </button>

          {loading ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner size="lg" />
            </div>
          ) : issue ? (
            <div className="max-w-5xl mx-auto">
              <IssueDetailPanel issue={issue} onUpdate={loadIssue} />
            </div>
          ) : (
            <div className="text-center py-24">
              <h2 className="text-2xl font-bold text-gray-400">Issue not found</h2>
              <p className="text-gray-500 mt-2">The issue you are looking for does not exist or has been removed.</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
