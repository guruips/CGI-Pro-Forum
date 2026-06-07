import { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Settings, 
  Sparkles, 
  ShieldAlert, 
  BellRing,
  BookOpen,
  Award,
  ChevronRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

// Dynamic sub-components
import { NavbarComponent } from './components/NavbarComponent';
import { LiveFeedSyncComponent } from './components/LiveFeedSyncComponent';
import { ForumComponent } from './components/ForumComponent';
import { ImageOptimizerComponent } from './components/ImageOptimizerComponent';
import { AdminDashboardComponent } from './components/AdminDashboardComponent';
import { ProfileModal } from './components/ProfileModal';

// Types and mock lists
import { ForumPost, Notification, User, SyncFeedItem } from './types';
import { 
  INITIAL_FORUM_POSTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_SYNCED_FEED, 
  LEADERBOARD,
  AVAILABLE_BADGES 
} from './data';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>('forum');

  // Eye Care / Tinted mode state
  const [isEyeCare, setIsEyeCare] = useState<boolean>(false);

  // Core App states
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [syncFeed, setSyncFeed] = useState<SyncFeedItem[]>(INITIAL_SYNCED_FEED);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date>(new Date());
  const [leaderboardList, setLeaderboardList] = useState(LEADERBOARD);

  // Active current logined dummy user (Catur Pamungkas)
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-catur',
    name: 'Catur Pamungkas, S.Pd., Gr.',
    role: 'Guru',
    points: 1540,
    level: 12,
    badges: [AVAILABLE_BADGES[0], AVAILABLE_BADGES[1]], // starts with some badges
    isPremium: true,
    avatarColor: 'bg-indigo-600'
  });

  // State to show eye-care help info bubble at start
  const [showWelcomeAlert, setShowWelcomeAlert] = useState<boolean>(true);

  // Profile modal states
  const [selectedProfileUsername, setSelectedProfileUsername] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const handleOpenProfile = (username: string) => {
    setSelectedProfileUsername(username);
    setIsProfileModalOpen(true);
  };

  // Push notifications controller
  const addPushNotification = (title: string, content: string, type: 'badge' | 'forum_reply' | 'request_solved' | 'level_up' | 'system') => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${randomId}`,
      title,
      content,
      type,
      timestamp: 'Baru saja',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Toggle Redup Ramah Mata
  const handleToggleEyeCare = () => {
    setIsEyeCare((prev) => {
      const next = !prev;
      if (next) {
        addPushNotification(
          'Mode Teduh Diaktifkan 🌅',
          'Tingkat radiasi kontras putih dihaluskan menjadi hangat (amber sepia) untuk kenyamanan mata malam hari.',
          'system'
        );
      }
      return next;
    });
  };

  // Automated/Manual API third-party sync simulation
  const handleManualSync = async () => {
    setIsSyncing(true);
    // Simulate API network ping delay
    await new Promise((resolve) => setTimeout(resolve, 900));
    
    const randomFeedTitle = [
      'Keputusan Dirjen GTK Kemendikbudristek No 4182/2026 Mengenai SKP Guru Terbaru',
      'Prediksi Tryout SKD CPNS PILAR NEGARA - Sila Kemanusiaan Yang Adil dan Beradab',
      'Unduhan Gratis LKPD Geografi Mitigasi Erupsi Gunung Api Kelas XI Terpilih'
    ][Math.floor(Math.random() * 3)];

    const randomCategory = ['Kombel', 'CPNS', 'Pedagogi'][Math.floor(Math.random() * 3)];

    const randomId = Math.random().toString(36).substring(2, 9);
    const newFeedItem: SyncFeedItem = {
      id: `feed-${Date.now()}-${randomId}`,
      source: 'Pusat Analisis Pendidikan RI',
      title: randomFeedTitle,
      url: 'https://catatanguruips.blogspot.com',
      timestamp: 'Baru saja',
      category: randomCategory
    };

    setSyncFeed((prev) => [newFeedItem, ...prev]);
    setIsSyncing(false);
    setLastSyncedAt(new Date());

    addPushNotification(
      'Umpan API Sinkron!',
      'Umpan portal kemendikbud baru berhasil ditarik masuk ke dashboard kolaboratif Anda secara real-time.',
      'system'
    );
  };

  // Q&A actions (Creating collaboration requests)
  const handleAddPost = (newPostData: Omit<ForumPost, 'id' | 'authorName' | 'authorRole' | 'authorColor' | 'likes' | 'replies_count' | 'votes' | 'timestamp' | 'replies'>) => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const newPost: ForumPost = {
      ...newPostData,
      id: `post-${Date.now()}-${randomId}`,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorColor: currentUser.avatarColor,
      likes: 0,
      replies_count: 0,
      votes: 1,
      timestamp: 'Baru saja',
      replies: []
    };

    setPosts((prev) => [newPost, ...prev]);

    // Give points +15 for creating a request
    updateUserPoints(15, 'Membuat Rikuest Pembahasan');
  };

  // Submitting an answer response with +10 reputation progression
  const handleAddReply = (postId: string, content: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const randomId = Math.random().toString(36).substring(2, 9);
        const newReplyObj = {
          id: `reply-${Date.now()}-${randomId}`,
          authorName: currentUser.name,
          authorRole: currentUser.role,
          authorColor: currentUser.avatarColor,
          points: currentUser.points,
          content,
          timestamp: 'Baru saja',
          likes: 0
        };
        return {
          ...post,
          replies_count: (post.replies_count || 0) + 1,
          replies: [...(post.replies || []), newReplyObj]
        };
      }
      return post;
    });

    setPosts(updated);
    updateUserPoints(10, 'Menjawab Rikuest Kolaboratif');
  };

  // Vote post
  const handleUpvotePost = (postId: string) => {
    setPosts((prev) => 
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, likes: post.likes + 1 };
        }
        return post;
      })
    );
  };

  // Handling poll votes inside posts
  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) => 
      prev.map((post) => {
        if (post.id === postId && post.poll) {
          const userVotes = post.poll.userVotes || {};
          const previousVoteOptionId = userVotes[currentUser.name];
          
          // Case 1: Unvote if user clicks the voted option again
          if (previousVoteOptionId === optionId) {
            const nextUserVotes = { ...userVotes };
            delete nextUserVotes[currentUser.name];
            
            const nextOptions = post.poll.options.map((opt) => {
              if (opt.id === optionId) {
                return { ...opt, votes: Math.max(0, opt.votes - 1) };
              }
              return opt;
            });
            
            return {
              ...post,
              poll: {
                ...post.poll,
                options: nextOptions,
                userVotes: nextUserVotes
              }
            };
          }
          
          // Case 2: Cast new vote or switch vote
          const nextUserVotes = { ...userVotes, [currentUser.name]: optionId };
          const nextOptions = post.poll.options.map((opt) => {
            let nextVotes = opt.votes;
            if (opt.id === optionId) {
              nextVotes += 1;
            }
            if (previousVoteOptionId && opt.id === previousVoteOptionId) {
              nextVotes = Math.max(0, nextVotes - 1);
            }
            return { ...opt, votes: nextVotes };
          });
          
          // Give points for participating (+5 XP)
          if (!previousVoteOptionId) {
            setTimeout(() => {
              updateUserPoints(5, 'Berpartisipasi Polling');
              addPushNotification(
                'Suara Anda Diterima! 🗳️',
                'Terima kasih telah berpartisipasi dalam jajak pendapat musyawarah guru. +5 Poin diperoleh.',
                'system'
              );
            }, 100);
          }
          
          return {
            ...post,
            poll: {
              ...post.poll,
              options: nextOptions,
              userVotes: nextUserVotes
            }
          };
        }
        return post;
      })
    );
  };

  // Confirming best response -> +50 Points & triggers level milestone
  const handleMarkBestAnswer = (postId: string, replyId: string) => {
    // Find who wrote that reply to award points and notifications
    let recipientName = 'Rekan Belajar';
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedReplies = (post.replies || []).map((rep) => {
          if (rep.id === replyId) {
            recipientName = rep.authorName;
            return { ...rep, isBestAnswer: true };
          }
          return rep;
        });
        return {
          ...post,
          status: 'solved' as const,
          replies: updatedReplies
        };
      }
      return post;
    });

    setPosts(updatedPosts);

    // Give points to the current user (arbitrator) and the recipient
    addPushNotification(
      'Baku Mutu Jawaban Terbaik 🏆',
      `Penjelasan berharga dari ${recipientName} terpilih sebagai Kunci Solusi. +50 Poin reputasi disinkronisasikan!`,
      'request_solved'
    );

    // Simulated reward sound / celebratory level up milestone triggers:
    const randomBadge = AVAILABLE_BADGES[Math.floor(Math.random() * AVAILABLE_BADGES.length)];
    const alreadyHas = currentUser.badges.some(b => b.id === randomBadge.id);

    if (!alreadyHas) {
      setCurrentUser((prev) => {
        const nextBadges = [...prev.badges, randomBadge];
        return {
          ...prev,
          badges: nextBadges
        };
      });
      addPushNotification(
        `Penghargaan Baru Dibuka: ${randomBadge.name} ${randomBadge.icon}`,
        `Selamat! Kompetensi pedagogi luar biasa Anda menganugerahkan lencana "${randomBadge.name}".`,
        'badge'
      );
    }
  };

  // Point management mechanics
  const updateUserPoints = (additionalPoints: number, reason: string) => {
    setCurrentUser((prev) => {
      const nextPoints = prev.points + additionalPoints;
      let nextLevel = prev.level;
      
      // Level thresholds every 100 points
      const calculatedLevel = Math.floor(nextPoints / 100) + 1;
      if (calculatedLevel > prev.level) {
        nextLevel = calculatedLevel;
        setTimeout(() => {
          addPushNotification(
            'Selamat! Level Naik Semakin Tinggi ⭐',
            `Poin Anda mencapai ${nextPoints}. Selamat menduduki kompetensi Level ${nextLevel}!`,
            'level_up'
          );
        }, 1200);
      }

      return {
        ...prev,
        points: nextPoints,
        level: nextLevel
      };
    });

    // Update the Leaderboard list dynamically to reflect real-time feel
    setLeaderboardList((prev) =>
      prev.map((item) => {
        if (item.name === currentUser.name) {
          return {
            ...item,
            points: item.points + additionalPoints,
            level: Math.floor((item.points + additionalPoints) / 100) + 1
          };
        }
        return item;
      }).sort((a, b) => b.points - a.points)
    );
  };

  // Notification actions
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotif = () => {
    setNotifications([]);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ease-in-out ${
      isEyeCare ? 'bg-[#fbf6eb] text-[#4a3e2e]' : 'bg-[#fafbfc] text-slate-800'
    }`}>
      
      {/* 1. Global Navigation Bar component */}
      <NavbarComponent
        isEyeCare={isEyeCare}
        onToggleEyeCare={handleToggleEyeCare}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkAsRead}
        onClearAllNotifications={handleClearAllNotif}
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={handleOpenProfile}
      />

      {/* 2. Top Banner Alert explaining the Eye Care Tint Mode */}
      {showWelcomeAlert && (
        <div className={`border-b transition-colors duration-500 ${
          isEyeCare 
            ? 'bg-[#eae0cf]/40 border-[#eae0cf] text-[#6c5a49]' 
            : 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-left">
              <span className={`h-2.5 w-2.5 rounded-full ${isEyeCare ? 'bg-amber-600' : 'bg-emerald-500 animate-pulse'}`} />
              <p className="font-semibold leading-relaxed">
                {isEyeCare 
                  ? 'Kenyamanan Malam Mata Aktif: Seluruh kecerahan visual diredam dengan filter kovergen amber.'
                  : 'Platform interaktif Catatan Guru IPS. Gunakan menu "Mode Teduh" di pojok kanan atas saat malam hari.'}
              </p>
            </div>
            <button 
              onClick={() => setShowWelcomeAlert(false)}
              className="text-[10px] font-bold underline opacity-85 hover:opacity-100 whitespace-nowrap"
            >
              Cukup tahu
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Dashboard Body container with generous whitespace spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        
        {/* Dynamic tabs routing rendering */}
        <section className="space-y-8">
          
          {/* HEADER HERO TITLE PORTION - Ultra Minimalist Editorial styling */}
          <div className="text-left max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1 bg-slate-900/5 text-slate-500 rounded-full px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase">
              <Sparkles className="h-3 w-3 text-amber-500 animate-spin" />
              Catatan Guru IPS • Komunitas Kolaborasi Pendidik Global
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display leading-[1.15]">
              Ruang Pendidikan Modern Terbuka
            </h2>
            
            <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed">
              Diskusikan modul Kurikulum Merdeka, tanya kisi-kisi soal SKD CPNS, optimasikan grafis visual peta, dan nikmati sinkronisasi api real-time.
            </p>
          </div>

          {/* TAB CONTENTS ROUTER */}
          {activeTab === 'forum' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Forum module takes 9 cols on wide grids */}
              <div className="xl:col-span-9">
                <ForumComponent
                  isEyeCare={isEyeCare}
                  posts={posts}
                  currentUser={currentUser}
                  onAddPost={handleAddPost}
                  onAddReply={handleAddReply}
                  onMarkBestAnswer={handleMarkBestAnswer}
                  leaderboard={leaderboardList}
                  onUpvotePost={handleUpvotePost}
                  onOpenProfile={handleOpenProfile}
                  onVotePoll={handleVotePoll}
                />
              </div>

              {/* API Live Sync widgets columns on 3 cols width */}
              <div className="xl:col-span-3 space-y-6">
                <LiveFeedSyncComponent
                  isEyeCare={isEyeCare}
                  syncFeed={syncFeed}
                  onManualSync={handleManualSync}
                  isSyncing={isSyncing}
                  lastSyncedAt={lastSyncedAt}
                />

                <div className={`p-5 rounded-2xl border text-left transition-colors duration-300 ${
                  isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
                }`}>
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#b25e29] border-b border-inherit pb-2.5 mb-2.5 flex items-center gap-1.5">
                    <BookOpen className="h-4.5 w-4.5" />
                    Bahan Ajar Eksklusif
                  </h4>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed">
                    Akses perangkat pembelajaran Kurikulum Merdeka SMP dan SMA yang disusun tim Catur Pamungkas di seluruh Indonesia.
                  </p>
                  <button 
                    onClick={() => setActiveTab('optimizer')}
                    className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-all"
                  >
                    Kompres Media Gambar Ajar →
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'optimizer' && (
            <div className="space-y-6">
              <div className="text-left space-y-1 mb-4">
                <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-emerald-500" />
                  Sistem Optimasi Gambar & Citra Geografis Otomatis
                </h3>
                <p className="text-slate-400 text-xs font-semibold">
                  Menghasilkan visual WebP super ringan yang me-reduksi 90% space data, menjamin kecepatan muat perangkat ajar di pelosok daerah.
                </p>
              </div>

              <ImageOptimizerComponent isEyeCare={isEyeCare} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="text-left space-y-1 mb-4">
                <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-500 animate-pulse" />
                  Dashboard Analisis Penggunaan Administrasi
                </h3>
                <p className="text-slate-400 text-xs font-semibold">
                  Pantau statistik kunjungan murid, log aktivitas real-time sync BKN, serta perkembangan kontribusi kombel IPS.
                </p>
              </div>

              <AdminDashboardComponent isEyeCare={isEyeCare} posts={posts} />
            </div>
          )}

        </section>

      </main>

      {/* 4. Global Footer with calming spacing */}
      <footer className={`mt-auto border-t py-12 transition-colors duration-500 ${
        isEyeCare 
          ? 'bg-[#f6efe0] border-[#eae0cf] text-[#4a3e2e]/85' 
          : 'bg-white border-slate-100 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="h-6 w-6 text-slate-800" />
            <span className="font-extrabold text-[#b25e29] font-display text-sm">CATATAN GURU IPS PRO</span>
          </div>
          
          <p className="text-xs max-w-md mx-auto leading-relaxed">
            Platform modern penunjang kolaborasi pendidik IPS seluruh nusantara. Dikembangkan teroptimasi, ringan, dan ramah kesehatan mata.
          </p>

          <p className="text-[10px] text-slate-400 font-bold">
            © 2026 Catatan Guru IPS. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>

      {/* 5. Mobile Navigation Rail (Visible strictly on viewports below 768px for native ergonomics) */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 border-t flex items-center justify-around py-3 px-4 z-[100] shadow-xl backdrop-blur-md transition-colors duration-500 ${
        isEyeCare ? 'bg-[#f6efe0]/90 border-[#eae0cf]' : 'bg-white/95 border-slate-100'
      }`}>
        {[
          { id: 'forum', label: 'Kolaborasi', icon: MessageSquare },
          { id: 'optimizer', label: 'Kompresor', icon: Settings },
          { id: 'analytics', label: 'Analitik', icon: Users },
        ].map((item) => {
          const IconComp = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1.5 transition-all text-[10px] font-extrabold ${
                isSelected 
                  ? isEyeCare ? 'text-[#b25e29]' : 'text-emerald-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <IconComp className="h-5.5 w-5.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile Detail Summary Modal */}
      {isProfileModalOpen && selectedProfileUsername && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          username={selectedProfileUsername}
          isCurrentUser={selectedProfileUsername === currentUser.name}
          currentUser={currentUser}
          posts={posts}
          isEyeCare={isEyeCare}
        />
      )}

    </div>
  );
}
