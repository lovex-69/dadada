import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import IssueDetailPanel from '@/components/IssueDetailPanel';

export default function IssueDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Issue Details - CivicPulse</title>
        <meta name="description" content="View issue details" />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="mb-6 text-primary hover:underline"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-primary mb-8">Issue Details</h1>
          <div className="max-w-2xl">
            <p className="text-gray-600">Issue ID: {id}</p>
            <div className="mt-4">
              <IssueDetailPanel issue={
                {
                  id: id as string,
                  title: 'Sample Issue',
                  description: 'This is a placeholder issue detail',
                  category: 'other',
                  severity: 'medium',
                  imageUrl: '/placeholder.jpg',
                  latitude: 0,
                  longitude: 0,
                  address: 'Sample Address',
                  timestamp: Date.now(),
                  userId: 'sample-user',
                  viewCount: 0,
                  shareToken: 'sample-token'
                }
              } />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
