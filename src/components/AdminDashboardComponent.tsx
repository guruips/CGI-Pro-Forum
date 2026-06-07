import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Database,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ListRestart
} from 'lucide-react';
import { ForumPost } from '../types';

interface AdminDashboardProps {
  isEyeCare: boolean;
  posts: ForumPost[];
}

export const AdminDashboardComponent: React.FC<AdminDashboardProps> = ({ isEyeCare, posts }) => {
  // Analytical states
  const [activeUsersCount, setActiveUsersCount] = useState<number>(42);
  const [totalPageViews, setTotalPageViews] = useState<number>(14250);
  const [logFeed, setLogFeed] = useState<Array<{ id: string; time: string; type: string; desc: string }>>([
    { id: 'l1', time: '14:28:10', type: 'SYNC', desc: 'Sync sukses dengan Badan Kepegawaian Negara API. (0.3s)' },
    { id: 'l2', time: '14:26:05', type: 'BADGE', desc: 'Lencana Socrates IPS diberikan kepada Catur Pamungkas.' },
    { id: 'l3', time: '14:24:40', type: 'FORUM', desc: 'Siti Kinasih mengupload Rikuest Penyusunan RPP Kurikulum Merdeka.' },
    { id: 'l4', time: '14:19:15', type: 'IMAGE', desc: 'Kompresi Gambar Sukses: Map_Sunda_Plates_Optimized.webp (4.2MB → 185KB)' }
  ]);

  // Simulate active user ticking
  useEffect(() => {
    const userInterval = setInterval(() => {
      setActiveUsersCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const target = prev + delta;
        return Math.max(25, Math.min(85, target));
      });
      setTotalPageViews((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4500);

    return () => clearInterval(userInterval);
  }, []);

  // Compute stats metrics
  const totalPosts = posts.length;
  const solvedCount = posts.filter((p) => p.status === 'solved').length;
  const unresolvedPercent = totalPosts > 0 ? Math.round(((totalPosts - solvedCount) / totalPosts) * 100) : 0;

  // Category counts
  const categoryStats = {
    'IPS SMP': posts.filter((p) => p.category === 'IPS SMP').length,
    'Geografi': posts.filter((p) => p.category === 'Geografi').length,
    'TWK': posts.filter((p) => p.category === 'TWK').length,
    'TIU': posts.filter((p) => p.category === 'TIU').length,
    'TKP': posts.filter((p) => p.category === 'TKP').length,
    'CPNS': posts.filter((p) => p.category === 'CPNS').length,
    'Pedagogi': posts.filter((p) => p.category === 'Pedagogi').length,
    'Kurikulum Merdeka': posts.filter((p) => p.category === 'Kurikulum Merdeka').length,
  };

  const maxVal = Math.max(...Object.values(categoryStats), 1);

  return (
    <div className="space-y-6 text-left">
      
      {/* Upper overview status banner */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300 ${
        isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm shadow-slate-900/10">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-800">Panel Pemantauan Admin Utama</h3>
            <p className="text-[10px] text-slate-400">Status Platform terintegrasi Global</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Vite Hot reloading: Terproteksi
          </div>
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-1 font-bold text-slate-600">
            <Calendar className="h-4.5 w-4.5 text-slate-400" />
            Target Rilis: Q2 2026
          </div>
        </div>
      </div>

      {/* Main Core KPI Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active user counters */}
        <div className={`p-5 rounded-2xl border transition-colors duration-300 ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Kolaborator Online</span>
            <Users className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h4 className="text-2xl font-extrabold text-slate-800 tabular-nums animate-pulse">{activeUsersCount}</h4>
            <span className="text-[10px] font-bold text-slate-400">Guru/Peserta didik</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
            <span>● 100% Real-time Polling terjalin</span>
          </p>
        </div>

        {/* KPI 2: Total Page Views */}
        <div className={`p-5 rounded-2xl border transition-colors duration-300 ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Akses Kunjungan</span>
            <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h4 className="text-2xl font-extrabold text-slate-800 tabular-nums">{totalPageViews.toLocaleString()}</h4>
            <span className="text-[10px] font-bold text-slate-400">Halaman</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1.5">
            Meningkat +12% dibanding pekan lalu
          </p>
        </div>

        {/* KPI 3: Syllabus Request Items count */}
        <div className={`p-5 rounded-2xl border transition-colors duration-300 ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Rikuest Modul & Soal</span>
            <MessageSquare className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h4 className="text-2xl font-extrabold text-slate-800">{totalPosts}</h4>
            <span className="text-[10px] font-bold text-slate-400">Rikuest Aktif</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1.5 flex items-center gap-1">
            <span className="font-extrabold text-slate-500">{posts.filter(p => p.status === 'open').length}</span> dalam antrean pembahasan
          </p>
        </div>

        {/* KPI 4: Bandwidth savings or DB efficiency */}
        <div className={`p-5 rounded-2xl border transition-colors duration-300 ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Efisiensi Bandwidth</span>
            <Database className="h-4.5 w-4.5 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h4 className="text-2xl font-extrabold text-[#b25e29]">94.2%</h4>
            <span className="text-[10px] font-bold text-slate-400">Ruangan Hemat</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1.5">
            Berkat optimasi WebP otomatis
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category distribution visual chart dashboard (6 cols) */}
        <div className={`p-5 rounded-2xl border lg:col-span-6 transition-colors duration-300 ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
        }`}>
          <h3 className="text-xs font-extrabold text-slate-800 border-b border-inherit pb-3.5 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
            <Layers className="h-4.5 w-4.5 text-emerald-500" />
            Distribusi Permohonan Menurut Bidang Studi
          </h3>

          <div className="space-y-4">
            {Object.entries(categoryStats).map(([key, count]) => {
              const fraction = count / maxVal;
              const barWidth = Math.max(10, Math.round(fraction * 100));
              return (
                <div key={key} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-600">
                    <span>{key}</span>
                    <span>{count} Rikuest ({Math.round((count/totalPosts || 0)*100)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${barWidth}%` }}
                      className="h-full bg-slate-800 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-500 leading-relaxed font-semibold">
            🚨 Materi TWK & Geografi sedang mengalami lonjakan interaksi signifikan menjelang masa simulasi ujian nasional.
          </div>
        </div>

        {/* Real-time Logger & System activity monitor (6 cols) */}
        <div className={`p-5 rounded-2xl border lg:col-span-6 transition-colors duration-300 ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
        }`}>
          <h3 className="text-xs font-extrabold text-slate-800 border-b border-inherit pb-3.5 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
            <ListRestart className="h-4.5 w-4.5 text-indigo-500" />
            Log Aktivitas Server & Gamifikasi Real-time
          </h3>

          <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
            {logFeed.map((log) => (
              <div 
                key={log.id} 
                className="flex items-start gap-2 text-xs border-b border-slate-100/50 pb-2.5 last:border-b-0 last:pb-0"
              >
                <span className="text-[10px] text-slate-400 font-bold tabular-nums">
                  [{log.time}]
                </span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-sm shrink-0 font-mono tracking-wide ${
                  log.type === 'SYNC' ? 'bg-indigo-100 text-indigo-800' :
                  log.type === 'BADGE' ? 'bg-amber-100 text-amber-800' :
                  log.type === 'FORUM' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {log.type}
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {log.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3.5 border-t border-inherit/40 text-center text-[10px] text-slate-400">
            Node server: standard Cloud Run • TLS 1.3 Terenkripsi • Sinkronisasi multi-user
          </div>
        </div>

      </div>

      {/* Awaiting Review Queue lists */}
      <div className={`p-5 rounded-2xl border transition-colors duration-300 ${
        isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
      }`}>
        <h3 className="text-xs font-extrabold text-slate-800 border-b border-inherit pb-3.5 mb-4 uppercase tracking-wider">
          Antrean Q&A yang Membutuhkan Respon (Mendesak)
        </h3>

        <div className="divide-y divide-slate-100">
          {posts.filter((post) => post.status === 'open').slice(0, 3).map((post) => (
            <div key={post.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
              <div className="text-left">
                <p className="font-bold text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer">
                  {post.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                  <span className="font-extrabold uppercase text-slate-500 scale-90 mb-0.5">{post.category}</span>
                  <span>•</span>
                  <span>Oleh {post.authorName}</span>
                  <span>•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                  Belum Terjawab
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
