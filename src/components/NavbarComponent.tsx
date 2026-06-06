import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bell, 
  Eye, 
  Sparkles, 
  Award, 
  Check, 
  Trash2,
  BookOpen
} from 'lucide-react';
import { Notification, User } from '../types';

interface NavbarProps {
  isEyeCare: boolean;
  onToggleEyeCare: () => void;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const NavbarComponent: React.FC<NavbarProps> = ({
  isEyeCare,
  onToggleEyeCare,
  notifications,
  onMarkNotificationAsRead,
  onClearAllNotifications,
  currentUser,
  activeTab,
  setActiveTab,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className={`sticky top-0 z-[100] border-b transition-colors duration-500 ${
      isEyeCare 
        ? 'bg-[#f6efe0]/90 border-[#eae0cf] backdrop-blur-md' 
        : 'bg-white/95 border-slate-100 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Slogan */}
        <div 
          onClick={() => setActiveTab('forum')} 
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 duration-300">
            <GraduationCap className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-800 flex items-center gap-1.5">
              CATATAN GURU IPS 
              <span className="hidden sm:inline-block text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full border border-emerald-100 font-bold">
                PRO v4
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
              Futuristic Edu-Hub
            </p>
          </div>
        </div>

        {/* Global Navigation Tabs (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { id: 'forum', label: 'Ruang Kolaborasi' },
            { id: 'optimizer', label: 'Optimasi Gambar' },
            { id: 'analytics', label: 'Analitik Admin' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 relative ${
                activeTab === tab.id
                  ? isEyeCare 
                    ? 'text-[#b25e29] bg-[#eae0cf]/60' 
                    : 'text-emerald-700 bg-emerald-50/60'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                  isEyeCare ? 'bg-[#b25e29]' : 'bg-emerald-500'
                }`} />
              )}
            </button>
          ))}
        </nav>

        {/* Dynamic Controls Bar */}
        <div className="flex items-center gap-4">
          
          {/* "Mode Teduhkan Mata" - Custom warm sepia Amber tint toggle */}
          <button
            onClick={onToggleEyeCare}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all duration-300 ${
              isEyeCare
                ? 'bg-amber-100 border-amber-200 text-amber-800 shadow-inner'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Redupkan ketajaman layar dengan Filter Cahaya Ramah Mata"
          >
            <Eye className={`h-4 w-4 ${isEyeCare ? 'text-amber-600 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Mode Teduh</span>
          </button>

          {/* Gamified Rank Display */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1 bg-gradient-to-r from-slate-50 to-emerald-50/10 border border-slate-100 rounded-lg">
            <Award className="h-4 w-4 text-amber-500 animate-bounce" />
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 leading-3">Lvl {currentUser.level}</p>
              <p className="text-[11px] font-bold text-slate-700 leading-3">{currentUser.points} Poin</p>
            </div>
          </div>

          {/* Real-time Push Notifications Hub Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors relative"
            >
              <Bell className="h-4.5 w-4.5 text-slate-500" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-xl border overflow-hidden z-50 transition-all duration-300 ${
                isEyeCare ? 'bg-[#fbf6eb] border-[#eae0cf]' : 'bg-white border-slate-100'
              }`}>
                <div className="p-4 border-b border-inherit flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <h3 className="text-xs font-bold text-slate-800">Riwayat Notifikasi Aktivitas</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={onClearAllNotifications}
                      className="text-[10px] font-semibold text-rose-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Hapus Semua
                    </button>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Notifications History List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-inherit">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <BookOpen className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-medium">Belum ada notifikasi baru.</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`p-3.5 text-left text-xs transition-colors relative ${
                          !notif.read 
                            ? isEyeCare ? 'bg-[#eae0cf]/30' : 'bg-emerald-50/45' 
                            : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-slate-800 leading-snug">{notif.title}</p>
                          <span className="text-[9px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{notif.content}</p>
                        
                        {!notif.read && (
                          <button
                            onClick={() => onMarkNotificationAsRead(notif.id)}
                            className="mt-2 text-[10px] font-bold text-emerald-600 flex items-center gap-1 hover:underline"
                          >
                            <Check className="h-3 w-3" /> Tandai Terbaca
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 text-center border-t border-inherit bg-slate-50/50 text-[10px] text-slate-400">
                  Riwayat ini disinkronisasikan secara global & real-time
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-xl ${currentUser.avatarColor} text-white font-extrabold text-xs flex items-center justify-center shadow-inner`}>
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-700 leading-3">{currentUser.name}</p>
              <p className="text-[9px] font-semibold text-emerald-600 capitalize leading-3">Pendidik {currentUser.role}</p>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
