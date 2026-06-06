import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  Wifi, 
  TrendingUp, 
  Radio,
  ExternalLink
} from 'lucide-react';
import { SyncFeedItem } from '../types';

interface LiveFeedSyncProps {
  isEyeCare: boolean;
  syncFeed: SyncFeedItem[];
  onManualSync: () => Promise<void>;
  isSyncing: boolean;
  lastSyncedAt: Date;
}

export const LiveFeedSyncComponent: React.FC<LiveFeedSyncProps> = ({
  isEyeCare,
  syncFeed,
  onManualSync,
  isSyncing,
  lastSyncedAt
}) => {
  const [countdown, setCountdown] = useState<number>(30);
  const [networkPing, setNetworkPing] = useState<number>(34);

  // Countdown timer simulation for real-time third-party background API fetching
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Trigger automatic silent sync simulation
          setNetworkPing(Math.floor(Math.random() * 25) + 20);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${
      isEyeCare 
        ? 'bg-[#f6efe0] border-[#eae0cf] text-[#4a3e2e]' 
        : 'bg-white border-slate-100 text-slate-800'
    }`}>
      
      {/* Header section with live network status */}
      <div className="flex items-center justify-between border-b border-inherit pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <h3 className="text-xs font-extrabold tracking-tight">Koneksi API Sinkronisasi</h3>
            <p className="text-[10px] text-slate-400">Kemendikbud & BKN Portal</p>
          </div>
        </div>

        <button
          onClick={onManualSync}
          disabled={isSyncing}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-all duration-300 ${
            isSyncing 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : isEyeCare
                ? 'bg-[#eae0cf] hover:bg-[#eae0cf]/80 text-[#b25e29]'
                : 'bg-emerald-50 hover:bg-emerald-100/70 text-emerald-700'
          }`}
        >
          <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sedang Sinkron...' : 'Sinkronisasi'}
        </button>
      </div>

      {/* Network Stats Metrics Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-3 gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/50 text-left">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Kecepatan Ping</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-extrabold text-slate-700">{networkPing}</span>
            <span className="text-[9px] text-slate-400 font-bold">ms</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/50 text-left">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Auto-Refresh</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-sm font-extrabold text-slate-700">{countdown}</span>
            <span className="text-[9px] text-slate-400 font-bold">detik</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/50 col-span-2 xs:col-span-1 text-left">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Status Payload</p>
          <div className="flex items-center gap-1 mt-1">
            <Wifi className="h-3 w-3 text-emerald-500" />
            <span className="text-[11px] font-bold text-slate-700">Terkompresi</span>
          </div>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-[11px] text-emerald-800 text-left flex items-start gap-2 mb-4">
        <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Informasi Terkini Sinkron</p>
          <p className="text-emerald-700 text-[10px]">Terakhir disinkronisasikan pukul {lastSyncedAt.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Sycned Feed Items List */}
      <div className="space-y-3 text-left">
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
          <Radio className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
          Feed Terkini (Real-time Portal)
        </p>

        <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto pr-1">
          {syncFeed.map((feed) => (
            <div key={feed.id} className="py-2.5 first:pt-0 last:pb-0 transition-all duration-300 hover:translate-x-1">
              <div className="flex items-center gap-1.5 justify-between">
                <span className="text-[9px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded-full uppercase scale-95 border border-indigo-100">
                  {feed.category}
                </span>
                <span className="text-[9px] text-slate-400">{feed.timestamp}</span>
              </div>
              <a 
                href={feed.url} 
                target="_blank" 
                rel="noreferrer" 
                className="block text-slate-700 font-bold text-xs mt-1 leading-snug hover:text-emerald-600 transition-colors flex items-center gap-1"
              >
                {feed.title}
                <ExternalLink className="h-2.5 w-2.5 shrink-0" />
              </a>
              <p className="text-[10px] text-slate-400 mt-0.5">Sumber: {feed.source}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer on lightweight loading */}
      <div className="mt-4 pt-3 border-t border-inherit/40 text-center text-[10px] text-slate-400">
        Payload API dioptimasi &lt; 2.4KB untuk memangkas waktu muat loading browser.
      </div>

    </div>
  );
};
