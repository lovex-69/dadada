import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import ReportForm from '@/components/ReportForm';
import MapView from '@/components/MapView';

export default function Home() {
  return (
    <>
      <Head>
        <title>CivicPulse - Report Infrastructure Issues</title>
        <meta
          name="description"
          content="Report and track local infrastructure issues in your community"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Report Infrastructure Issues</h1>
            <p className="text-xl text-gray-600">
              Help improve your community by reporting local infrastructure problems
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Report an Issue</h2>
              <ReportForm />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">Nearby Issues</h2>
              <MapView />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
