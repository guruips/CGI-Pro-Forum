import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, FileText, CheckCircle2, MessageSquare, Trophy, Star, ShieldCheck } from 'lucide-react';
import { User, Badge, ForumPost } from '../types';
import { AVAILABLE_BADGES } from '../data';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  isCurrentUser: boolean;
  currentUser: User;
  posts: ForumPost[];
  isEyeCare: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  username,
  isCurrentUser,
  currentUser,
  posts,
  isEyeCare,
}) => {
  if (!isOpen) return null;

  // Derive target user's details based on whether it is the current logged-in user or a forum author
  let targetUser: {
    name: string;
    role: string;
    points: number;
    level: number;
    avatarColor: string;
    isPremium: boolean;
  };

  if (isCurrentUser) {
    targetUser = {
      name: currentUser.name,
      role: currentUser.role,
      points: currentUser.points,
      level: currentUser.level,
      avatarColor: currentUser.avatarColor,
      isPremium: currentUser.isPremium,
    };
  } else {
    // Attempt to search in forum posts metadata
    const postsOfUser = posts.filter(p => p.authorName === username);
    const repliesOfUser = posts.flatMap(p => p.replies || []).filter(r => r.authorName === username);
    
    let role = 'Guru';
    let avatarColor = 'bg-slate-500';
    let points = 120; // default baseline

    if (postsOfUser.length > 0) {
      role = postsOfUser[0].authorRole;
      avatarColor = postsOfUser[0].authorColor;
    } else if (repliesOfUser.length > 0) {
      role = repliesOfUser[0].authorRole;
      avatarColor = repliesOfUser[0].authorColor;
      points = repliesOfUser[0].points || points;
    }

    // Try mapping standard database points from LEADERBOARD
    const leaderboardUsers: Record<string, { points: number; level: number; role: string; avatarColor: string }> = {
      'Catur Pamungkas, S.Pd., Gr.': { points: currentUser.points, level: currentUser.level, role: 'Guru', avatarColor: 'bg-indigo-600' },
      'Dra. Endang Herawati': { points: 1120, level: 9, role: 'Guru', avatarColor: 'bg-purple-600' },
      'Dewi Lestari, S.Pd.': { points: 880, level: 7, role: 'Guru', avatarColor: 'bg-pink-600' },
      'Ahmad Faisal': { points: 810, level: 7, role: 'Siswa', avatarColor: 'bg-blue-600' },
      'Siti Kinasih, S.Pd.': { points: 550, level: 5, role: 'Guru', avatarColor: 'bg-rose-500' },
      'Ahmad Danial': { points: 410, level: 4, role: 'Siswa', avatarColor: 'bg-emerald-500' },
      'Budi Santoso': { points: 320, level: 3, role: 'Umum', avatarColor: 'bg-sky-500' },
      'Lukman Hakim': { points: 260, level: 2, role: 'Siswa', avatarColor: 'bg-amber-600' },
    };

    if (leaderboardUsers[username]) {
      const match = leaderboardUsers[username];
      points = match.points;
      role = match.role;
      avatarColor = match.avatarColor;
    }

    const calculatedLevel = Math.floor(points / 100) + 1;

    targetUser = {
      name: username,
      role: role as any,
      points: points,
      level: calculatedLevel,
      avatarColor: avatarColor,
      isPremium: username === currentUser.name || username.includes('Catur') || username.includes('Endang'),
    };
  }

  // Calculate dynamic statistics
  const userPostsCount = posts.filter(p => p.authorName === targetUser.name).length;
  
  const allReplies = posts.flatMap(p => p.replies || []);
  const userRepliesCount = allReplies.filter(r => r.authorName === targetUser.name).length;
  
  const bestAnswersCount = allReplies.filter(
    r => r.authorName === targetUser.name && r.isBestAnswer
  ).length;

  // Determine unlocked badges list dynamically
  let earnedBadgeIds: string[] = [];

  if (isCurrentUser) {
    earnedBadgeIds = currentUser.badges.map(b => b.id);
  } else {
    // Determine realistically based on user name maps
    const badgeAllocation: Record<string, string[]> = {
      'Catur Pamungkas, S.Pd., Gr.': ['b1', 'b2', 'b3', 'b4', 'b5'],
      'Dra. Endang Herawati': ['b1', 'b2', 'b3', 'b4'],
      'Dewi Lestari, S.Pd.': ['b1', 'b2', 'b5'],
      'Ahmad Faisal': ['b1', 'b3', 'b4'],
      'Siti Kinasih, S.Pd.': ['b1', 'b5'],
      'Ahmad Danial': ['b1', 'b3'],
      'Budi Santoso': ['b1'],
      'Lukman Hakim': ['b1'],
    };

    if (badgeAllocation[targetUser.name]) {
      earnedBadgeIds = badgeAllocation[targetUser.name];
    } else {
      // dynamic fallback logic based on points
      if (targetUser.points >= 1000) earnedBadgeIds = ['b1', 'b2', 'b3', 'b4'];
      else if (targetUser.points >= 700) earnedBadgeIds = ['b1', 'b2', 'b3'];
      else if (targetUser.points >= 400) earnedBadgeIds = ['b1', 'b2'];
      else earnedBadgeIds = ['b1'];
    }
  }

  // Point progression progress bar math (level threshold is 100 points per level)
  const basePointsForCurrentLevel = (targetUser.level - 1) * 100;
  const pointsInCurrentLevel = Math.max(0, targetUser.points - basePointsForCurrentLevel);
  const percentToNextLevel = Math.min(100, Math.floor((pointsInCurrentLevel / 100) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />

        {/* Modal Sheet panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 380, damping: 25 }}
          className={`relative w-full max-w-xl rounded-3xl shadow-2xl border overflow-hidden max-h-[90vh] flex flex-col text-left transition-colors duration-500 ${
            isEyeCare 
              ? 'bg-[#fbf6eb] border-[#eae0cf] text-[#4a3e2e]' 
              : 'bg-white border-slate-150 text-slate-800'
          }`}
        >
          {/* Top colored aesthetic bar */}
          <div className={`h-2.5 w-full bg-gradient-to-r ${
            isEyeCare ? 'from-amber-500 via-[#b25e29] to-orange-400' : 'from-emerald-500 via-teal-600 to-indigo-600'
          }`} />

          {/* Close button absolute top corner */}
          <button
            onClick={onClose}
            className={`absolute right-4 top-5 p-2 rounded-xl transition-all border cursor-pointer ${
              isEyeCare 
                ? 'bg-[#f6efe0] hover:bg-[#eae0cf] border-[#eae0cf]/80 text-slate-600' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200/50 text-slate-500'
            }`}
            title="Tutup dialog"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal Content Scroll Area */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            
            {/* 1. Header Profile Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Giant Avatar Circle with animated initial letter scale */}
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`h-16 w-16 rounded-2xl ${targetUser.avatarColor} text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shrink-0`}
              >
                {targetUser.name.charAt(0)}
              </motion.div>

              <div className="text-center sm:text-left space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-extrabold tracking-tight text-slate-800 truncate max-w-xs md:max-w-md">
                    {targetUser.name}
                  </h3>
                  
                  {targetUser.isPremium && (
                    <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase shadow-xs">
                      <ShieldCheck className="h-3 w-3 inline-block" /> PRO
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-lg border tracking-wider ${
                    targetUser.role === 'Guru' 
                      ? 'bg-indigo-50 border-indigo-150 text-indigo-700'
                      : targetUser.role === 'Siswa'
                      ? 'bg-blue-50 border-blue-150 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    Pendidik {targetUser.role}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {isCurrentUser ? 'Akun Anda • Sedang Aktif' : 'Profil Kontributor Guru'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. LEVEL & POINTS STATS PROJECTION */}
            <div className={`p-4 rounded-2xl border ${
              isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                  <span className="text-xs font-black text-slate-700">Tingkat {targetUser.level}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-extrabold text-slate-800">{targetUser.points} Poin Reputasi</span>
                </div>
              </div>

              {/* Seamless minimalist progress bar tracking progress to next level */}
              <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentToNextLevel}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <p className="text-[9.5px] text-slate-400 font-semibold mt-1.5 text-left">
                {percentToNextLevel}% kemajuan ke tingkat berikutnya ({100 - pointsInCurrentLevel} poin tersisa)
              </p>
            </div>

            {/* 3. CONTRIBUTION CARDS ROW */}
            <div className="grid grid-cols-3 gap-3">
              {/* Post count */}
              <div className={`p-3 rounded-2xl border text-center transition-all ${
                isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
              }`}>
                <FileText className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">Rikuest</p>
                <p className="text-lg font-black text-slate-800 mt-1 leading-tight">{userPostsCount}</p>
              </div>

              {/* Reply count */}
              <div className={`p-3 rounded-2xl border text-center transition-all ${
                isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
              }`}>
                <MessageSquare className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">Tanggapan</p>
                <p className="text-lg font-black text-slate-800 mt-1 leading-tight">{userRepliesCount}</p>
              </div>

              {/* Best Answer selection count */}
              <div className={`p-3 rounded-2xl border text-center transition-all ${
                isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
              }`}>
                <Trophy className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">Solusi</p>
                <p className="text-lg font-black text-slate-850 mt-1 leading-tight text-amber-600">{bestAnswersCount}</p>
              </div>
            </div>

            {/* 4. DRIVEN BADGES LIST */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 text-left">
                <Award className="h-4.5 w-4.5 text-amber-500" />
                Daftar Lencana Kompetensi Pendidik
              </h4>

              <div className="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {AVAILABLE_BADGES.map((badge) => {
                  const hasUnlocked = earnedBadgeIds.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-opacity duration-300 ${
                        hasUnlocked
                          ? isEyeCare 
                            ? 'bg-amber-100/30 border-amber-200/55 text-[#4a3e2e]' 
                            : 'bg-emerald-50/40 border-emerald-100 text-slate-800'
                          : 'opacity-40 bg-slate-50/60 border-slate-200/50'
                      }`}
                    >
                      <span className={`text-2xl shrink-0 p-1 rounded-xl shadow-xs transition-transform ${hasUnlocked ? 'bg-white border text-inherit scale-105' : 'bg-slate-100 grayscale filter'}`}>
                        {badge.icon}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-extrabold text-slate-800 leading-none">
                            {badge.name}
                          </p>
                          {hasUnlocked ? (
                            <span className="inline-flex items-center text-[8px] font-bold text-emerald-600 bg-emerald-50/80 px-1 py-0.2 rounded uppercase">
                              <CheckCircle2 className="h-2 w-2 inline-block mr-0.5" /> Terbuka
                            </span>
                          ) : (
                            <span className="inline-block text-[8px] font-bold text-slate-400 bg-slate-100 px-1 py-0.2 rounded uppercase">
                              Terkunci
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-snug font-medium">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Modal bottom actions */}
          <div className={`p-4 border-t text-center text-[10px] font-semibold transition-colors duration-300 ${
            isEyeCare ? 'bg-[#f6efe0]/55 border-[#eae0cf]' : 'bg-slate-50/60 border-slate-100'
          }`}>
            {isCurrentUser 
              ? 'Terus bantu kombel pedagogi IPS untuk mengumpulkan poin dan naik level!'
              : `Catatan reputasi disinkronisasikan aman dengan modul Guru Indonesia™`
            }
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
