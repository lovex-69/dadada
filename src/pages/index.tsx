import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
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

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">Report a Failure</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Capture visual evidence, geotag the location, and auto-assign responsibility. 
                  Public timelines begin the moment you submit.
                </p>
                <ReportForm />
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold uppercase tracking-widest">Active Watch</h2>
                  <Link href="/feed" className="text-xs font-bold text-primary hover:underline">
                    VIEW FULL FEED →
                  </Link>
                </div>
                <MapView issues={[]} className="h-64 mb-6" />
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded border border-white/10">
                    <div className="w-10 h-10 bg-red-500/20 rounded flex items-center justify-center text-red-500 font-bold">14</div>
                    <div>
                      <p className="text-xs font-bold">Critical Overdue Issues</p>
                      <p className="text-[10px] text-gray-500">Unresolved past SLA deadlines</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded border border-white/10">
                    <div className="w-10 h-10 bg-green-500/20 rounded flex items-center justify-center text-green-500 font-bold">82%</div>
                    <div>
                      <p className="text-xs font-bold">City Resolution Rate</p>
                      <p className="text-[10px] text-gray-500">Overall contractor compliance</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-primary/5 border border-primary/10 rounded-xl">
                <h3 className="font-bold text-primary mb-2">Public. Automated. Verifiable.</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  CivicPulse isn&apos;t a complaint box. It&apos;s an accountability engine. We use AI to match problems 
                  to responsible parties and enforce public timelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
