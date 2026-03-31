'use client';

import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/dummy-data';

interface RealtimeVisitorsCardProps {
  initialValue: number;
}

export default function RealtimeVisitorsCard({ initialValue }: RealtimeVisitorsCardProps) {
  const [onlineRealtime, setOnlineRealtime] = useState(initialValue);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Function to fetch updated data
    const fetchRealtimeData = async () => {
      try {
        setIsRefreshing(true);
        // We use relative path or absolute depending on environment, 
        // but since this is client-side, we use the browser-accessible URL.
        const res = await fetch('/api/admin/dashboard/realtime-visitors');
        if (res.ok) {
          const json = await res.json();
          setOnlineRealtime(json.onlineRealtime ?? 0);
        }
      } catch (err) {
        console.error('Error polling realtime visitors:', err);
      } finally {
        setTimeout(() => setIsRefreshing(false), 1000);
      }
    };

    // Set interval to poll every 30 seconds
    const interval = setInterval(fetchRealtimeData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#1a4731]/30 hover:shadow-md transition-all group relative overflow-hidden">
      {/* Pinging effect for "Realtime" feel */}
      <div className="absolute top-2 right-2 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium whitespace-nowrap">Total Online Realtime</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900 mt-1 font-serif transition-all duration-500">
              {formatNumber(onlineRealtime)}
            </p>
            {isRefreshing && (
              <span className="text-[8px] text-yellow-600 animate-pulse font-bold uppercase tracking-tighter">Updating...</span>
            )}
          </div>
          <p className="text-xs text-green-600 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp size={11} /> Realtime (GA4)
          </p>
        </div>
        <div className="bg-yellow-500 w-10 h-10 rounded-xl flex items-center justify-center bg-opacity-10 group-hover:scale-110 transition-transform">
          <Activity size={20} className="text-yellow-500" />
        </div>
      </div>
    </div>
  );
}
