import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import ReportForm from '@/components/ReportForm';

export default function ReportPage() {
  return (
    <>
      <Head>
        <title>Report an Issue - CivicPulse</title>
        <meta name="description" content="Report infrastructure issues in your community" />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-primary mb-8">Report an Issue</h1>
          <div className="max-w-2xl">
            <ReportForm />
          </div>
        </div>
      </Layout>
    </>
  );
}
