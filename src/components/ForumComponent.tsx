import React, { useState } from 'react';
import { 
  MessageSquare, 
  Filter, 
  Send, 
  PlusCircle, 
  CheckCircle, 
  Award, 
  Lock, 
  Sparkles, 
  BadgeHelp,
  ThumbsUp,
  Globe,
  Flame,
  Milestone
} from 'lucide-react';
import { ForumPost, User, Badge } from '../types';
import { EXCLUSIVE_ROOM_MESSAGES, AVAILABLE_BADGES } from '../data';

interface ForumProps {
  isEyeCare: boolean;
  posts: ForumPost[];
  currentUser: User;
  onAddPost: (post: Omit<ForumPost, 'id' | 'authorName' | 'authorRole' | 'authorColor' | 'likes' | 'replies_count' | 'votes' | 'timestamp' | 'replies'>) => void;
  onAddReply: (postId: string, content: string) => void;
  onMarkBestAnswer: (postId: string, replyId: string) => void;
  leaderboard: Array<{ name: string; rank: number; points: number; level: number; badgeCount: number; role: string; avatarColor: string }>;
  onUpvotePost: (postId: string) => void;
}

export const ForumComponent: React.FC<ForumProps> = ({
  isEyeCare,
  posts,
  currentUser,
  onAddPost,
  onAddReply,
  onMarkBestAnswer,
  leaderboard,
  onUpvotePost,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeSubTab, setActiveSubTab] = useState<'public' | 'exclusive'>('public');

  // Form states for creating a new request
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'TWK' | 'TIU' | 'TKP' | 'IPS SMP' | 'Geografi'>('IPS SMP');
  const [newType, setNewType] = useState<'modul' | 'soal' | 'prediksi' | 'bahas'>('modul');

  // Interactive replies input state mapping (postId -> input text)
  const [repliesInputs, setRepliesInputs] = useState<{ [postId: string]: string }>({});
  
  // Selected single post to discuss / expand details
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Exclusive Chat room state
  const [loungeMessages, setLoungeMessages] = useState(EXCLUSIVE_ROOM_MESSAGES);
  const [newLoungeMsg, setNewLoungeMsg] = useState('');

  // Handle writing replies
  const handleReplyChange = (postId: string, val: string) => {
    setRepliesInputs((prev) => ({ ...prev, [postId]: val }));
  };

  const submitReply = (postId: string) => {
    const txt = repliesInputs[postId];
    if (!txt || !txt.trim()) return;
    onAddReply(postId, txt);
    setRepliesInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    onAddPost({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      type: newType,
      status: 'open',
    });
    setNewTitle('');
    setNewDesc('');
    setShowForm(false);
  };

  const handlePostLoungeMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoungeMsg.trim()) return;
    setLoungeMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        author: currentUser.name,
        role: currentUser.role,
        color: currentUser.avatarColor,
        text: newLoungeMsg,
        timestamp: 'Baru saja'
      }
    ]);
    setNewLoungeMsg('');
  };

  // Check if current user is eligible for exclusive lounge (points >= 800)
  const canAccessExclusive = currentUser.points >= 800;

  // Filter posts logic
  const filteredPosts = posts.filter((post) => {
    const matchCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchType = selectedType === 'All' || post.type === selectedType;
    return matchCat && matchType;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      
      {/* LEFT SECTION (9 columns): Posts List and Forums */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* Forum Header containing Tab Selection (Public Discussion vs Exclusive Master Lounge) */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300 ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
        }`}>
          <div className="flex rounded-xl bg-slate-50 p-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab('public')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeSubTab === 'public'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Globe className="h-4 w-4" />
              Forum Publik ({filteredPosts.length})
            </button>
            <button
              onClick={() => setActiveSubTab('exclusive')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 relative ${
                activeSubTab === 'exclusive'
                  ? 'bg-amber-800 text-amber-50 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              Grup Eksklusif Master
              {!canAccessExclusive && (
                <span className="absolute -top-1.5 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-sm shadow-emerald-600/10 hover:shadow-md"
          >
            <PlusCircle className="h-4 w-4" />
            Buat Rikuest Baru
          </button>
        </div>

        {/* 1. PUBLIC DISCUSSION FORUM */}
        {activeSubTab === 'public' && (
          <div className="space-y-6">
            
            {/* Filter buttons bar */}
            <div className={`p-4 rounded-2xl border space-y-4 transition-colors duration-300 ${
              isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
            }`}>
              
              {/* Category selector */}
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5 text-emerald-500" />
                  Kategori Pembahasan
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'IPS SMP', 'Geografi', 'TWK', 'TIU', 'TKP'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all duration-300 ${
                        selectedCategory === cat
                          ? isEyeCare ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-900 text-white'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type selector (Modul / Soal / Prediksi / Pembahasan) */}
              <div className="pt-2 border-t border-inherit">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-2">
                  Tipe Permohonan Kolaborasi
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'All', label: 'Semua Tipe' },
                    { id: 'modul', label: 'Rikuest Modul' },
                    { id: 'soal', label: 'Soal & Pembahasan' },
                    { id: 'prediksi', label: 'Prediksi Materi' },
                    { id: 'bahas', label: 'Diskusi Tematik' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all duration-300 ${
                        selectedType === t.id
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* "Buat Rikuest Baru" interactive Modal Form */}
            {showForm && (
              <form 
                onSubmit={handleCreatePost}
                className={`p-6 rounded-2xl border shadow-lg space-y-4 transition-colors duration-300 animate-fade-in ${
                  isEyeCare ? 'bg-[#fbf6eb] border-[#eae0cf]' : 'bg-white border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                    Ajukan Rikuest Pembahasan / Modul Baru
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Batal
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Judul Rikuest (Sederhana & Padat)
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Contoh: Rikuest Modul: Struktur Lempeng Tektonik Fase E..."
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 bg-slate-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Deskripsi Masalah / Pertanyaan Materi
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Terangkan secara detail konsep apa saja yang ingin dibahas kolaboratif..."
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 bg-slate-50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                        Kategori Materi
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                      >
                        <option value="IPS SMP">IPS SMP (Fase D)</option>
                        <option value="Geografi">Geografi (SMA XII)</option>
                        <option value="TWK">TWK (Wawasan Kebangsaan)</option>
                        <option value="TIU">TIU (Intelegensi Umum)</option>
                        <option value="TKP">TKP (Karakteristik Pribadi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                        Jenis Kegiatan
                      </label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                      >
                        <option value="modul">Rikuest Penyusunan Modul</option>
                        <option value="soal">Tanya Pembahasan Soal</option>
                        <option value="prediksi">Gagasan/Prediksi Ujian</option>
                        <option value="bahas">Diskusi / Kupas Tuntas</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    Terbitkan Ke Forum
                  </button>
                </div>
              </form>
            )}

            {/* Forum Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-2xl border border-slate-100/60 max-w-lg mx-auto">
                  <BadgeHelp className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-700 text-sm">Tidak ada rikuest yang cocok</p>
                  <p className="text-xs text-slate-400 mt-1">Gunakan penyaring di atas atau tanyakan kasus baru Anda.</p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isExpanded = expandedPostId === post.id;
                  return (
                    <div 
                      key={post.id}
                      className={`p-5 rounded-2xl border transition-all duration-300 text-left ${
                        isEyeCare 
                          ? 'bg-[#f6efe0] border-[#eae0cf] hover:border-[#eae0cf]/80' 
                          : 'bg-white border-slate-100 hover:border-slate-200 shadow-xs'
                      }`}
                    >
                      {/* Meta badges space */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[10px] bg-slate-900 text-white px-2.5 py-0.5 rounded-full font-bold">
                          {post.category}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          post.type === 'modul' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          post.type === 'soal' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          post.type === 'prediksi' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {post.type === 'modul' ? '📖 Rikuest Modul' :
                           post.type === 'soal' ? '🧩 Tanya Soal' :
                           post.type === 'prediksi' ? '🔮 Prediksi' :
                           '🗣️ Diskusi'}
                        </span>
                        {post.status === 'solved' && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ml-auto">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Solved
                          </span>
                        )}
                      </div>

                      {/* Title and author details */}
                      <h4 className="text-sm font-extrabold text-slate-800 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between border-t border-inherit/40 pt-3 mt-4 text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded-full ${post.authorColor} text-white font-bold flex items-center justify-center text-[10px]`}>
                            {post.authorName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-600">{post.authorName}</span>
                            <span className="text-[10px] ml-1 bg-slate-100 text-slate-500 px-1 py-0.5 rounded">
                              {post.authorRole}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => onUpvotePost(post.id)}
                            className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 font-bold transition-colors"
                          >
                            <ThumbsUp className="h-3.5 w-3.5 text-slate-400" />
                            {post.likes}
                          </button>
                          
                          <button
                            onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                            className="flex items-center gap-1 font-bold text-emerald-600 hover:underline"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            {post.replies?.length || 0} Tanggapan
                          </button>
                        </div>
                      </div>

                      {/* EXPANDED SECTION: Replies thread & Reply box */}
                      {isExpanded && (
                        <div className="mt-5 pt-4 border-t border-inherit/60 space-y-4 animate-fade-in text-left">
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                            Seluruh Jawaban & Pembahasan ({post.replies?.length})
                          </p>
                          
                          {/* Replies listing */}
                          <div className="space-y-3">
                            {post.replies?.length === 0 ? (
                              <p className="text-xs text-slate-400 italic">Belum ada tanggapan. Jadilah yang pertama memberikan solusi!</p>
                            ) : (
                              post.replies?.map((rep) => (
                                <div 
                                  key={rep.id} 
                                  className={`p-3.5 rounded-xl border relative transition-all duration-300 ${
                                    rep.isBestAnswer 
                                      ? 'bg-amber-500/5 border-amber-300 ring-2 ring-amber-100' 
                                      : 'bg-slate-50/50 border-slate-100'
                                  }`}
                                >
                                  {rep.isBestAnswer && (
                                    <span className="absolute top-3 right-3 text-[10px] bg-amber-500 text-white font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                                      <Award className="h-3 w-3" /> JAWABAN TERBAIK
                                    </span>
                                  )}

                                  <div className="flex items-center gap-2 mb-2">
                                    <div className={`h-6 w-6 rounded-full ${rep.authorColor} text-white font-bold flex items-center justify-center text-[10px]`}>
                                      {rep.authorName.charAt(0)}
                                    </div>
                                    <div className="text-[11px]">
                                      <span className="font-extrabold text-slate-700">{rep.authorName}</span>
                                      <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded ml-1 uppercase">{rep.authorRole}</span>
                                      <span className="text-slate-400 font-medium ml-2">{rep.timestamp}</span>
                                    </div>
                                  </div>

                                  <p className="text-xs text-slate-600 mt-1.5 whitespace-pre-line leading-relaxed">
                                    {rep.content}
                                  </p>

                                  {/* Best answer trigger for post author / global Catur admin */}
                                  {!rep.isBestAnswer && currentUser.points >= 1000 && (
                                    <button
                                      onClick={() => onMarkBestAnswer(post.id, rep.id)}
                                      className="mt-3 text-[10px] bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                                      title="Tandai jawaban ini sebagai terbaik untuk memberi reward +50 Poin!"
                                    >
                                      ✓ Tandai Jawaban Terbaik (+50 Poin)
                                    </button>
                                  )}
                                </div>
                              ))
                            )}
                          </div>

                          {/* Write a response box */}
                          <div className="flex items-start gap-2 pt-3 border-t border-inherit/40 w-full">
                            <div className={`h-8 w-8 rounded-full ${currentUser.avatarColor} text-white font-extrabold flex items-center justify-center text-xs shrink-0`}>
                              {currentUser.name.charAt(0)}
                            </div>
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={repliesInputs[post.id] || ''}
                                onChange={(e) => handleReplyChange(post.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') submitReply(post.id);
                                }}
                                placeholder="Tuliskan saran, jawaban, atau sertakan link dokumen modul di sini..."
                                className="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 bg-slate-50"
                              />
                              <button
                                onClick={() => submitReply(post.id)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                              >
                                <Send className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* 2. EXCLUSIVE MASTER CHAT LOUNGE */}
        {activeSubTab === 'exclusive' && (
          <div className="space-y-6 animate-fade-in">
            {!canAccessExclusive ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 max-w-md mx-auto space-y-4">
                <div className="h-14 w-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800">Ruang Eksklusif Terkunci</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ruang kolaborasi tingkat tinggi ini hanya dapat diakses oleh praktisi & siswa terpilih dengan kontribusi minimal <b className="text-amber-600">800 poin</b>.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 font-medium">
                  Saat ini Poin Anda: {currentUser.points} Poin. <br />
                  Silakan jawab ragam permohonan modul/soal di tab Forum Publik untuk mendapatkan reputasi!
                </div>
              </div>
            ) : (
              <div className={`p-5 rounded-2xl border flex flex-col h-[500px] transition-colors duration-300 ${
                isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-100'
              }`}>
                {/* Lounge info bar */}
                <div className="border-b border-inherit pb-3 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Milestone className="h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">Master Group Discussion Lounge</h4>
                      <p className="text-[10px] text-slate-400">Pendidik peringkat tertinggi global</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-extrabold">
                    ● Eksklusif Aktif
                  </span>
                </div>

                {/* Messages screen */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
                  <div className="text-center">
                    <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                      HARI INI
                    </span>
                  </div>

                  {loungeMessages.map((msg) => {
                    const isOwn = msg.author === currentUser.name;
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex gap-2.5 max-w-[80%] ${isOwn ? 'ml-auto flex-row-reverse' : ''}`}
                      >
                        <div className={`h-7.5 w-7.5 rounded-full shrink-0 ${msg.color} text-white font-bold text-xs flex items-center justify-center`}>
                          {msg.author.charAt(0)}
                        </div>
                        <div>
                          <div className={`text-[10px] text-slate-400 font-bold mb-0.5 ${isOwn ? 'text-right' : ''}`}>
                            {msg.author} <span className="font-medium text-slate-300 text-[8px]">({msg.role})</span>
                          </div>
                          <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isOwn 
                              ? 'bg-slate-900 text-white rounded-tr-none' 
                              : isEyeCare 
                                ? 'bg-[#eae0cf] text-[#4a3e2e] rounded-tl-none' 
                                : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                          <p className={`text-[8px] text-slate-400 mt-1 ${isOwn ? 'text-right' : ''}`}>{msg.timestamp}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message input */}
                <form onSubmit={handlePostLoungeMsg} className="mt-4 pt-3 border-t border-inherit/40 flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newLoungeMsg}
                    onChange={(e) => setNewLoungeMsg(e.target.value)}
                    placeholder="Diskusikan modul/prediksi penting bersama Catur..."
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-amber-500"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    Kirim <Send className="h-3 w-3" />
                  </button>
                </form>

              </div>
            )}
          </div>
        )}

      </div>

      {/* RIGHT SIDEBAR (3 columns): Leaderboards & Achievements info */}
      <div className="lg:col-span-3 space-y-6 text-left">
        
        {/* Level Up System & Available Badges */}
        <div className={`p-5 rounded-2xl border transition-colors duration-300 ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-xs font-extrabold text-slate-800 border-b border-inherit pb-3 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <Award className="h-4 w-4 text-amber-500" />
            Lencana Penghargaan
          </h3>
          <p className="text-[10px] text-slate-400 leading-snug mb-3">
            Dapatkan lencana penghargaan setiap kali solusi jawaban Anda terpilih membantu yang lain!
          </p>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {AVAILABLE_BADGES.map((badge) => {
              const hasBadge = currentUser.badges.some((b) => b.id === badge.id);
              return (
                <div 
                  key={badge.id}
                  className={`p-2.5 rounded-xl border flex gap-2.5 items-start ${
                    hasBadge 
                      ? 'bg-amber-50/70 border-amber-200' 
                      : 'bg-slate-50/50 border-slate-100 opacity-60'
                  }`}
                >
                  <span className="text-xl shrink-0">{badge.icon}</span>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">{badge.name}</p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{badge.description}</p>
                    {hasBadge && (
                      <span className="inline-block text-[8px] bg-amber-500 text-white font-extrabold px-1.5 py-0.2 rounded mt-1.5 uppercase">
                        Selesai
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Leaderboard Panel */}
        <div className={`p-5 rounded-2xl border transition-colors duration-300 ${
          isEyeCare ? 'bg-[#f6efe0] border-[#eae0cf]' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-xs font-extrabold text-slate-800 border-b border-inherit pb-3 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <Flame className="h-4.5 w-4.5 text-rose-500" />
            Peringkat Kontributor
          </h3>

          <div className="space-y-3 divide-y divide-inherit max-h-[350px] overflow-y-auto">
            {leaderboard.map((item, idx) => {
              const isCurrentUser = item.name === currentUser.name;
              return (
                <div 
                  key={item.name} 
                  className={`pt-2.5 first:pt-0 pb-1 text-left flex items-center justify-between ${
                    isCurrentUser ? 'bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-4">#{idx + 1}</span>
                    <div className={`h-7 w-7 rounded-lg ${item.avatarColor} text-white font-bold flex items-center justify-center text-[10px]`}>
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-700 max-w-[120px] truncate leading-tight">
                        {item.name}
                      </p>
                      <span className="text-[8px] bg-slate-100 text-slate-500 px-1 rounded uppercase font-bold">
                        {item.role}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[11px] font-extrabold text-slate-800 leading-none">{item.points} Pts</p>
                    <p className="text-[8px] text-slate-400 font-medium">Lvl {item.level}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-inherit/40 text-[10px] text-center text-slate-400 font-bold">
            Peringkat ini diperbarui global tiap 15 menit.
          </div>
        </div>

      </div>

    </div>
  );
};
