import React, { useState, useEffect, useRef } from 'react';
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
  Milestone,
  Share2,
  Check,
  ChevronDown,
  Search,
  Keyboard,
  X
} from 'lucide-react';
import { ForumPost, User, Badge } from '../types';
import { EXCLUSIVE_ROOM_MESSAGES, AVAILABLE_BADGES } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface ForumProps {
  isEyeCare: boolean;
  posts: ForumPost[];
  currentUser: User;
  onAddPost: (post: Omit<ForumPost, 'id' | 'authorName' | 'authorRole' | 'authorColor' | 'likes' | 'replies_count' | 'votes' | 'timestamp' | 'replies'>) => void;
  onAddReply: (postId: string, content: string) => void;
  onMarkBestAnswer: (postId: string, replyId: string) => void;
  leaderboard: Array<{ name: string; rank: number; points: number; level: number; badgeCount: number; role: string; avatarColor: string }>;
  onUpvotePost: (postId: string) => void;
  onOpenProfile: (username: string) => void;
  onVotePoll?: (postId: string, optionId: string) => void;
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
  onOpenProfile,
  onVotePoll,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeSubTab, setActiveSubTab] = useState<'public' | 'exclusive'>('public');

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const categoriesList = [
    { id: 'All', name: 'Semua Kategori', desc: 'Tampilkan semua rikuest', icon: '🌐', color: 'bg-slate-100 text-slate-700' },
    { id: 'TWK', name: 'TWK', desc: 'Tes Wawasan Kebangsaan (CPNS)', icon: '🇮🇩', color: 'bg-red-50 text-red-700 border-red-100' },
    { id: 'TIU', name: 'TIU', desc: 'Tes Inteligensia Umum (CPNS)', icon: '💡', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { id: 'TKP', name: 'TKP', desc: 'Tes Karakteristik Pribadi (CPNS)', icon: '🤝', color: 'bg-purple-50 text-purple-700 border-purple-100' },
    { id: 'IPS SMP', name: 'IPS SMP', desc: 'Ilmu Pengetahuan Sosial Kelas VII - IX', icon: '📚', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { id: 'Geografi', name: 'Geografi', desc: 'Geografi SMA Kelas XII', icon: '🗺️', color: 'bg-sky-50 text-sky-700 border-sky-100' },
    { id: 'CPNS', name: 'CPNS', desc: 'Materi Persiapan Seleksi ASN & PPPK', icon: '📋', color: 'bg-orange-50 text-orange-700 border-orange-100' },
    { id: 'Pedagogi', name: 'Pedagogi', desc: 'Metode Pengajaran & Teori Belajar', icon: '✍️', color: 'bg-pink-50 text-pink-700 border-pink-100' },
    { id: 'Kurikulum Merdeka', name: 'Kurikulum Merdeka', desc: 'Draf Rencana Ajar & Modul Projek', icon: '✨', color: 'bg-amber-50 text-amber-700 border-amber-100' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form states for creating a new request with localStorage backup
  const [showForm, setShowForm] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('forum_show_form');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  const [newTitle, setNewTitle] = useState<string>(() => {
    try {
      return localStorage.getItem('forum_new_title') || '';
    } catch {
      return '';
    }
  });
  const [newDesc, setNewDesc] = useState<string>(() => {
    try {
      return localStorage.getItem('forum_new_desc') || '';
    } catch {
      return '';
    }
  });
  const [newCategory, setNewCategory] = useState<'TWK' | 'TIU' | 'TKP' | 'IPS SMP' | 'Geografi' | 'CPNS' | 'Pedagogi' | 'Kurikulum Merdeka'>(() => {
    try {
      const saved = localStorage.getItem('forum_new_category');
      return (saved as any) || 'IPS SMP';
    } catch {
      return 'IPS SMP';
    }
  });
  const [newType, setNewType] = useState<'modul' | 'soal' | 'prediksi' | 'bahas'>(() => {
    try {
      const saved = localStorage.getItem('forum_new_type');
      return (saved as any) || 'modul';
    } catch {
      return 'modul';
    }
  });

  // Poll creation form states
  const [includePoll, setIncludePoll] = useState<boolean>(false);
  const [pollQuestion, setPollQuestion] = useState<string>('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']); // start with 2 empty options

  const handleAddPollOptionState = () => {
    if (pollOptions.length < 6) {
      setPollOptions(prev => [...prev, '']);
    }
  };

  const handleRemovePollOptionState = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleUpdatePollOptionState = (index: number, value: string) => {
    setPollOptions(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  // Interactive replies input state mapping (postId -> input text) with localStorage backup
  const [repliesInputs, setRepliesInputs] = useState<{ [postId: string]: string }>(() => {
    try {
      const saved = localStorage.getItem('forum_replies_inputs');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Automatically synchronize state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('forum_show_form', JSON.stringify(showForm));
    } catch (e) {
      console.warn('Gagal menyimpan status form ke localStorage', e);
    }
  }, [showForm]);

  useEffect(() => {
    try {
      localStorage.setItem('forum_new_title', newTitle);
    } catch (e) {
      console.warn('Gagal menyimpan judul ke localStorage', e);
    }
  }, [newTitle]);

  useEffect(() => {
    try {
      localStorage.setItem('forum_new_desc', newDesc);
    } catch (e) {
      console.warn('Gagal menyimpan deskripsi ke localStorage', e);
    }
  }, [newDesc]);

  useEffect(() => {
    try {
      localStorage.setItem('forum_new_category', newCategory);
    } catch (e) {
      console.warn('Gagal menyimpan kategori ke localStorage', e);
    }
  }, [newCategory]);

  useEffect(() => {
    try {
      localStorage.setItem('forum_new_type', newType);
    } catch (e) {
      console.warn('Gagal menyimpan tipe ke localStorage', e);
    }
  }, [newType]);

  useEffect(() => {
    try {
      localStorage.setItem('forum_replies_inputs', JSON.stringify(repliesInputs));
    } catch (e) {
      console.warn('Gagal menyimpan input balasan ke localStorage', e);
    }
  }, [repliesInputs]);
  
  // Selected single post to discuss / expand details
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Parse deep-linked post parameter from URL and auto-scroll
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const postParam = params.get('post');
      if (postParam && posts.some(p => p.id === postParam)) {
        setExpandedPostId(postParam);
        setTimeout(() => {
          const element = document.getElementById(postParam);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    } catch (e) {
      console.warn('Gagal membaca parameter deep-link untuk rikuest:', e);
    }
  }, [posts]);

  const handleSharePost = (postId: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?post=${postId}`;
    
    // Attempt modern copy API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedPostId(postId);
        setTimeout(() => {
          setCopiedPostId(null);
        }, 2000);
      }).catch((err) => {
        console.warn('Gagal menggunakan modern clipboard, mencoba fallback...', err);
        fallbackCopyText(shareUrl, postId);
      });
    } else {
      fallbackCopyText(shareUrl, postId);
    }
  };

  const fallbackCopyText = (text: string, postId: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopiedPostId(postId);
        setTimeout(() => {
          setCopiedPostId(null);
        }, 2000);
      } else {
        alert(`Tautan bagikan: ${text}`);
      }
    } catch (err) {
      console.error('Fallback copy failed', err);
      const decodedText = decodeURIComponent(text);
      prompt("Salin tautan di bawah ini secara manual:", decodedText);
    }
  };

  const handleUpvote = (e: React.MouseEvent<HTMLButtonElement>, postId: string) => {
    onUpvotePost(postId);

    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      // Double-burst confetti from the upvote button coordinates
      confetti({
        particleCount: 15,
        angle: 60,
        spread: 40,
        origin: { x, y },
        colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#ffedd5'],
        scalar: 0.85,
        disableForReducedMotion: true
      });
      confetti({
        particleCount: 15,
        angle: 120,
        spread: 40,
        origin: { x, y },
        colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#ffedd5'],
        scalar: 0.85,
        disableForReducedMotion: true
      });
    } catch (err) {
      console.warn('Gagal memicu animasi confetti:', err);
    }
  };

  // Filter posts logic
  const filteredPosts = posts.filter((post) => {
    const matchCat = selectedCategory === 'All' || post.category === selectedCategory;
    const matchType = selectedType === 'All' || post.type === selectedType;
    return matchCat && matchType;
  });

  // Keyboard Navigation & Shortcuts gamification setup
  const [keyboardActivePostId, setKeyboardActivePostId] = useState<string | null>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Safety check: Ignore hotkeys if native inputs or textareas are focused
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.hasAttribute('contenteditable')
      );
      
      if (isTyping) {
        if (e.key === 'Escape') {
          (activeEl as HTMLElement).blur();
        }
        return;
      }

      // Read key in lowercase
      const key = e.key.toLowerCase();

      // Show shortcuts help sheet on '?' or 'h'
      if (key === 'h' || e.key === '?') {
        e.preventDefault();
        setShowShortcutsHelp(prev => !prev);
        return;
      }

      // Close overlays or clear highlighted active selection on 'Escape'
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showShortcutsHelp) {
          setShowShortcutsHelp(false);
        } else if (keyboardActivePostId !== null) {
          setKeyboardActivePostId(null);
        }
        return;
      }

      // Quit early if there are no visible active filtered posts
      if (filteredPosts.length === 0) return;

      // J or ArrowDown -> Next Post in Feed
      if (key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        let nextIndex = 0;
        if (keyboardActivePostId) {
          const currentIndex = filteredPosts.findIndex(p => p.id === keyboardActivePostId);
          if (currentIndex !== -1) {
            nextIndex = (currentIndex + 1) % filteredPosts.length;
          }
        }
        const nextPost = filteredPosts[nextIndex];
        setKeyboardActivePostId(nextPost.id);
        
        // Scroll post smoothly into user focus
        setTimeout(() => {
          const el = document.getElementById(nextPost.id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50);
      } 
      
      // K or ArrowUp -> Previous Post in Feed
      else if (key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        let prevIndex = filteredPosts.length - 1;
        if (keyboardActivePostId) {
          const currentIndex = filteredPosts.findIndex(p => p.id === keyboardActivePostId);
          if (currentIndex !== -1) {
            prevIndex = (currentIndex - 1 + filteredPosts.length) % filteredPosts.length;
          }
        }
        const prevPost = filteredPosts[prevIndex];
        setKeyboardActivePostId(prevPost.id);
        
        // Scroll post smoothly into view
        setTimeout(() => {
          const el = document.getElementById(prevPost.id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50);
      } 
      
      // O or Enter -> Toggle Expand/Collapse Post Accordion
      else if (key === 'o' || e.key === 'Enter') {
        e.preventDefault();
        if (keyboardActivePostId) {
          setExpandedPostId(prev => prev === keyboardActivePostId ? null : keyboardActivePostId);
        }
      } 
      
      // U or L -> Upvote Active Post
      else if (key === 'u' || key === 'l') {
        e.preventDefault();
        if (keyboardActivePostId) {
          onUpvotePost(keyboardActivePostId);
          
          try {
            const upvoteBtnEl = document.getElementById(`upvote-btn-${keyboardActivePostId}`);
            let originObj = { x: 0.5, y: 0.5 };
            if (upvoteBtnEl) {
              const rect = upvoteBtnEl.getBoundingClientRect();
              originObj = {
                x: (rect.left + rect.width / 2) / window.innerWidth,
                y: (rect.top + rect.height / 2) / window.innerHeight
              };
            }
            confetti({
              particleCount: 22,
              spread: 60,
              origin: originObj,
              colors: ['#10b981', '#34d399', '#f59e0b', '#fbbf24', '#e0f2fe'],
              disableForReducedMotion: true
            });
          } catch (err) {
            console.warn('Gagal memicu upvote confetti:', err);
          }
        }
      } 
      
      // R or C -> Focus/Direct reply to active post
      else if (key === 'r' || key === 'c') {
        e.preventDefault();
        if (keyboardActivePostId) {
          setExpandedPostId(keyboardActivePostId);
          setTimeout(() => {
            const inputEl = document.getElementById(`reply-input-${keyboardActivePostId}`) as HTMLInputElement | null;
            if (inputEl) {
              inputEl.focus();
              inputEl.select();
            }
          }, 180);
        }
      } 
      
      // N -> Initiate/Open "Buat Rikuest Baru" form & Auto-focus
      else if (key === 'n') {
        e.preventDefault();
        setShowForm(true);
        setTimeout(() => {
          const titleInput = document.getElementById('new-post-title');
          if (titleInput) {
            titleInput.focus();
            titleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 120);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardActivePostId, filteredPosts, showShortcutsHelp]);

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
    setRepliesInputs((prev) => {
      const copy = { ...prev };
      delete copy[postId];
      return copy;
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    let pollData = undefined;
    if (includePoll && pollQuestion.trim()) {
      const validOptions = pollOptions.filter(opt => opt.trim() !== '');
      if (validOptions.length >= 2) {
        pollData = {
          question: pollQuestion.trim(),
          options: validOptions.map((optText, index) => ({
            id: `opt-${Date.now()}-${index}`,
            text: optText.trim(),
            votes: 0
          })),
          userVotes: {}
        };
      }
    }

    onAddPost({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      type: newType,
      status: 'open',
      poll: pollData
    });

    setNewTitle('');
    setNewDesc('');
    setIncludePoll(false);
    setPollQuestion('');
    setPollOptions(['', '']);
    setShowForm(false);

    try {
      localStorage.removeItem('forum_new_title');
      localStorage.removeItem('forum_new_desc');
    } catch (err) {
      console.warn('Gagal menghapus draf post dari localStorage', err);
    }
  };

  const handlePostLoungeMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoungeMsg.trim()) return;
    const randomId = Math.random().toString(36).substring(2, 9);
    setLoungeMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}_${randomId}`,
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
              
              {/* Category selector dropdown */}
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-emerald-500" />
                  Kategori Pembahasan
                </p>
                
                <div ref={categoryDropdownRef} className="relative w-full sm:max-w-md">
                  {/* Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-300 cursor-pointer text-xs font-bold"
                  >
                    <div className="flex items-center gap-2">
                      {(() => {
                        const matched = categoriesList.find(c => c.id === selectedCategory) || categoriesList[0];
                        return (
                          <>
                            <span className="text-base shrink-0">{matched.icon}</span>
                            <span className="text-slate-700">{matched.name}</span>
                            <span className="text-[9px] text-slate-450 font-semibold bg-slate-100 px-1.5 py-0.5 rounded ml-1">
                              {posts.filter(p => matched.id === 'All' ? true : p.category === matched.id).length} permohonan
                            </span>
                          </>
                        );
                      })()}
                    </div>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Popup */}
                  {isCategoryDropdownOpen && (
                    <div className={`absolute left-0 mt-2 w-full border rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-300 ${
                      isEyeCare ? 'bg-[#fbf6eb] border-[#eae0cf]' : 'bg-white border-slate-150'
                    }`}>
                      {/* Search filter inside dropdown */}
                      <div className="p-2 border-b border-slate-100/80 flex items-center gap-2">
                        <Search className="h-3.5 w-3.5 text-slate-400 ml-2 shrink-0" />
                        <input
                          type="text"
                          value={categorySearchQuery}
                          onChange={(e) => setCategorySearchQuery(e.target.value)}
                          placeholder="Cari kategori materi..."
                          className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-1.5 font-medium"
                          onClick={(e) => e.stopPropagation()} // Prevent closing dropdown on input focus/click
                        />
                        {categorySearchQuery && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCategorySearchQuery('');
                            }}
                            className="text-[10px] text-slate-400 hover:text-slate-600 px-2 cursor-pointer font-bold shrink-0"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      {/* Scrollable lists */}
                      <div className="max-h-60 overflow-y-auto py-1 divide-y divide-slate-100/40">
                        {(() => {
                          const tempFiltered = categoriesList.filter(c => 
                            c.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) || 
                            c.desc.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
                            c.id.toLowerCase().includes(categorySearchQuery.toLowerCase())
                          );

                          if (tempFiltered.length === 0) {
                            return (
                              <div className="p-4 text-center text-slate-450 text-xs italic">
                                Kategori tidak ditemukan
                              </div>
                            );
                          }

                          return tempFiltered.map((cat) => {
                            const isSelected = selectedCategory === cat.id;
                            const postCount = posts.filter(p => cat.id === 'All' ? true : p.category === cat.id).length;
                            
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(cat.id);
                                  setIsCategoryDropdownOpen(false);
                                  setCategorySearchQuery('');
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors font-bold ${
                                  isSelected 
                                    ? 'bg-emerald-50 text-emerald-800' 
                                    : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="text-lg shrink-0">{cat.icon}</span>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-[11px] leading-tight font-extrabold flex items-center gap-1.5">
                                      {cat.name}
                                      {cat.id !== 'All' && (
                                        <span className="text-[9px] font-normal px-1.5 py-0.2 bg-slate-100 rounded text-slate-500">
                                          {cat.id}
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-[10px] font-normal text-slate-405 leading-normal truncate">{cat.desc}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    postCount > 0 ? 'bg-slate-100 text-slate-500' : 'bg-transparent text-slate-300'
                                  }`}>
                                    {postCount} Rikuest
                                  </span>
                                  {isSelected && (
                                    <Check className="h-4 w-4 text-emerald-600" />
                                  )}
                                </div>
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
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
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500" />
                    Ajukan Rikuest Pembahasan / Modul Baru
                  </h3>
                  <div className="flex items-center gap-3">
                    {(newTitle || newDesc) && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                        <Check className="h-3 w-3 text-emerald-600" />
                        Draf Tersimpan
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Judul Rikuest (Sederhana & Padat)
                    </label>
                    <input
                      type="text"
                      required
                      id="new-post-title"
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
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 cursor-pointer"
                      >
                        <option value="IPS SMP">IPS SMP (Fase D)</option>
                        <option value="Geografi">Geografi (SMA XII)</option>
                        <option value="TWK">TWK (Wawasan Kebangsaan)</option>
                        <option value="TIU">TIU (Intelegensi Umum)</option>
                        <option value="TKP">TKP (Karakteristik Pribadi)</option>
                        <option value="CPNS">CPNS (Seleksi ASN & PPPK)</option>
                        <option value="Pedagogi">Pedagogi (Teori & Pengajaran)</option>
                        <option value="Kurikulum Merdeka">Kurikulum Merdeka (RPP & Modul)</option>
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

                  {/* Interactive Poll / Jajak Pendapat Designer Form */}
                  <div className="border border-slate-200/50 rounded-2xl p-4 bg-slate-50/40 space-y-3">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={includePoll}
                        onChange={(e) => setIncludePoll(e.target.checked)}
                        className="h-4.5 w-4.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer mt-0.5"
                      />
                      <div className="text-left">
                        <span className="block text-xs font-extrabold text-slate-700">Sertakan Jajak Pendapat (Interactive Poll)</span>
                        <span className="block text-[10px] text-slate-400 font-semibold leading-normal mt-0.5">Bagus untuk konsensus & pendapat praktis mufakat di antara sesama Guru.</span>
                      </div>
                    </label>

                    {includePoll && (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-[10.5px] text-slate-500 font-extrabold uppercase tracking-wider mb-1">
                            Pertanyaan Polling Jajak Pendapat
                          </label>
                          <input
                            type="text"
                            required={includePoll}
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                            placeholder="Contoh: Manakah strategi diferensiasi paling efektif menurut Anda?"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 bg-white shadow-xs font-bold"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[10.5px] text-slate-500 font-extrabold uppercase tracking-wider mb-1 flex items-center justify-between">
                            <span>Pilihan Jawaban (Minimal 2, Maksimal 6)</span>
                            <span className="text-[9.5px] text-slate-400 lowercase italic">({pollOptions.length} opsi aktif)</span>
                          </label>
                          
                          {pollOptions.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-slate-400 w-5 shrink-0 text-center">
                                #{i + 1}
                              </span>
                              <input
                                type="text"
                                required={includePoll && i < 2}
                                value={opt}
                                onChange={(e) => handleUpdatePollOptionState(i, e.target.value)}
                                placeholder={i === 0 ? "Contoh: Strategi Pembelajaran Difokuskan Visual" : i === 1 ? "Contoh: Diskusi Kelompok Kolaboratif" : `Opsi Jajak Pendapat #${i + 1}`}
                                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 bg-white shadow-xs"
                              />
                              {pollOptions.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemovePollOptionState(i)}
                                  className="p-1 px-2.5 text-rose-500 hover:text-white border border-rose-200 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                                  title="Hapus opsi ini"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}

                          {pollOptions.length < 6 && (
                            <button
                              type="button"
                              onClick={handleAddPollOptionState}
                              className="mt-1.5 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-[10px] font-black rounded-lg transition-all cursor-pointer"
                            >
                              + Tambah Opsi Pilihan
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100/60 w-full">
                  <p className="text-[10px] text-slate-400 font-medium">
                    * Ketikan Anda disimpan otomatis secara lokal ke browser
                  </p>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-sm cursor-pointer"
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
                  const isActiveShortcut = keyboardActivePostId === post.id;
                  return (
                    <div 
                      key={post.id}
                      id={post.id}
                      className={`p-5 rounded-2xl border transition-all duration-300 text-left relative ${
                        isActiveShortcut
                          ? isEyeCare 
                            ? 'bg-[#f3ebd0] border-amber-500 shadow-md ring-3 ring-amber-400/40 scale-[1.01] z-10' 
                            : 'bg-indigo-50/20 border-indigo-500 shadow-md ring-3 ring-indigo-500/15 scale-[1.01] z-10'
                          : isEyeCare 
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
                        
                        {isActiveShortcut && (
                          <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wide shadow-xs animate-pulse ${
                            isEyeCare ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'
                          }`} title="Navigasi Keyboard Pintas Aktif untuk postingan ini. Tekan Enter untuk membuka, R untuk menanggapi, U untuk memberikan upvote">
                            <span className="h-1.5 w-1.5 rounded-full bg-white inline-block"></span>
                            ⌨️ Sorotan Aktif
                          </span>
                        )}

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

                      {/* Interactive Poll / Jajak Pendapat section */}
                      {post.poll && (
                        <div className={`mt-4 p-4 rounded-xl border ${
                          isEyeCare 
                            ? 'bg-amber-100/10 border-amber-250/30 text-[#4a3e2e]' 
                            : 'bg-slate-50/50 border-slate-150 text-slate-800'
                        }`}>
                          <div className="flex items-start gap-2 mb-3">
                            <span className="text-sm shrink-0">🗳️</span>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-700 leading-snug">
                                {post.poll.question}
                              </p>
                              <span className="text-[9px] font-bold text-slate-400">
                                Jajak Pendapat Pendidik • {Object.keys(post.poll.userVotes || {}).length} Suara masuk
                              </span>
                            </div>
                          </div>
                          
                          {/* Options list */}
                          <div className="space-y-2">
                            {post.poll.options.map((opt) => {
                              const totalVotes = post.poll!.options.reduce((sum, item) => sum + item.votes, 0) || 1;
                              const pct = Math.round((opt.votes / totalVotes) * 100);
                              const isCurrentUserVoted = post.poll!.userVotes?.[currentUser.name] === opt.id;
                              
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => onVotePoll && onVotePoll(post.id, opt.id)}
                                  className={`w-full relative text-left p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between overflow-hidden group cursor-pointer ${
                                    isCurrentUserVoted
                                      ? isEyeCare 
                                        ? 'border-amber-500 bg-amber-100/40 text-amber-900 ring-2 ring-amber-400/20' 
                                        : 'border-emerald-500 bg-emerald-50/40 text-emerald-990 ring-2 ring-emerald-500/10'
                                      : isEyeCare
                                      ? 'border-[#eae0cf] bg-white/60 hover:bg-white hover:border-amber-300 text-slate-700'
                                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-650'
                                  }`}
                                >
                                  {/* Animated/Rendered percentage progress background fill */}
                                  <div
                                    className={`absolute left-0 top-0 bottom-0 transition-all duration-500 pointer-events-none ${
                                      isCurrentUserVoted
                                        ? isEyeCare ? 'bg-amber-500/10' : 'bg-emerald-500/12'
                                        : isEyeCare ? 'bg-amber-600/5' : 'bg-slate-100/70'
                                    }`}
                                    style={{ width: `${pct}%` }}
                                  />
                                  
                                  {/* Custom option indicator */}
                                  <div className="flex items-center gap-2 relative z-10 min-w-0 pr-4">
                                    <span className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center text-[8px] font-black shrink-0 ${
                                      isCurrentUserVoted
                                        ? isEyeCare 
                                          ? 'bg-amber-600 border-amber-600 text-white' 
                                          : 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'bg-white border-slate-300 text-transparent'
                                    }`}>
                                      {isCurrentUserVoted && '✓'}
                                    </span>
                                    <span className="truncate leading-normal py-0.5">{opt.text}</span>
                                  </div>

                                  <div className="text-right text-[10px] font-extrabold relative z-10 shrink-0 text-slate-500 flex items-center gap-1.5 whitespace-nowrap">
                                    <span>{opt.votes} suara</span>
                                    <span className={`px-1.5 py-0.5 rounded ${
                                      isCurrentUserVoted 
                                        ? isEyeCare ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800' 
                                        : 'bg-slate-100 text-slate-500'
                                    }`}>{pct}%</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-inherit/40 pt-3 mt-4 text-[11px] text-slate-400">
                        <button
                          onClick={() => onOpenProfile(post.authorName)}
                          className="flex items-center gap-2 hover:opacity-85 text-left transition-all cursor-pointer focus:outline-none"
                          title={`Lihat profil detail ${post.authorName}`}
                        >
                          <div className={`h-6 w-6 rounded-full ${post.authorColor} text-white font-bold flex items-center justify-center text-[10px] shrink-0`}>
                            {post.authorName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-600 hover:underline">{post.authorName}</span>
                            <span className="text-[10px] ml-1 bg-slate-100 text-slate-500 px-1 py-0.5 rounded">
                              {post.authorRole}
                            </span>
                          </div>
                        </button>

                        <div className="flex items-center gap-4">
                          <motion.button 
                            id={`upvote-btn-${post.id}`}
                            onClick={(e) => handleUpvote(e, post.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.88 }}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-600 font-bold transition-colors cursor-pointer bg-slate-50/80 hover:bg-slate-100/50 border border-slate-200/50 hover:border-slate-350/50 px-2.5 py-1 rounded-xl shadow-xs"
                            title="Berikan upvote pada rikuest ini"
                          >
                            <motion.span
                              animate={{ 
                                scale: [1, 1.25, 1], 
                                rotate: [0, -10, 10, 0]
                              }}
                              transition={{ duration: 0.35, ease: "easeInOut" }}
                              key={post.likes}
                              className="flex items-center justify-center shrink-0"
                            >
                              <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                            </motion.span>
                            <div className="overflow-hidden h-4 flex items-center">
                              <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                  key={post.likes}
                                  initial={{ y: 8, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: -8, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                                  className="inline-block text-xs text-slate-650"
                                >
                                  {post.likes}
                                </motion.span>
                              </AnimatePresence>
                            </div>
                          </motion.button>
                          
                          <button
                            onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                            className="flex items-center gap-1 font-bold text-emerald-600 hover:underline cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            {post.replies?.length || 0} Tanggapan
                          </button>

                          <button
                            onClick={() => handleSharePost(post.id)}
                            className={`flex items-center gap-1 font-bold transition-colors duration-300 cursor-pointer ${
                              copiedPostId === post.id 
                                ? 'text-emerald-600' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                            title="Salin tautan bagikan untuk rikuest ini"
                          >
                            {copiedPostId === post.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-600 animate-bounce" />
                                <span>Disalin!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="h-3.5 w-3.5 text-slate-400" />
                                <span>Bagikan</span>
                              </>
                            )}
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

                                  <div className="flex items-center justify-between mb-2">
                                    <button
                                      onClick={() => onOpenProfile(rep.authorName)}
                                      className="flex items-center gap-2 hover:opacity-85 text-left focus:outline-none cursor-pointer"
                                      title={`Lihat profil detail ${rep.authorName}`}
                                    >
                                      <div className={`h-6 w-6 rounded-full ${rep.authorColor} text-white font-bold flex items-center justify-center text-[10px] shrink-0`}>
                                        {rep.authorName.charAt(0)}
                                      </div>
                                      <div className="text-[11px]">
                                        <span className="font-extrabold text-slate-700 hover:underline">{rep.authorName}</span>
                                        <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded ml-1 uppercase">{rep.authorRole}</span>
                                      </div>
                                    </button>
                                    <span className="text-slate-400 text-[10px] font-medium">{rep.timestamp}</span>
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
                                id={`reply-input-${post.id}`}
                                value={repliesInputs[post.id] || ''}
                                onChange={(e) => handleReplyChange(post.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') submitReply(post.id);
                                }}
                                placeholder="Tuliskan saran, jawaban, atau draf modul di sini (disimpan otomatis)..."
                                className="w-full pl-3.5 pr-16 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 bg-slate-50"
                              />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                {repliesInputs[post.id] && (
                                  <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-bold animate-pulse" title="Draf jawaban tersimpan otomatis">
                                    ✓ Saved
                                  </span>
                                )}
                                <button
                                  onClick={() => submitReply(post.id)}
                                  className="text-slate-400 hover:text-emerald-600 cursor-pointer"
                                  title="Kirim pembahasan"
                                >
                                  <Send className="h-3.5 w-3.5" />
                                </button>
                              </div>
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
                  onClick={() => onOpenProfile(item.name)}
                  className={`pt-2.5 first:pt-0 pb-1 text-left flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-all p-1.5 rounded-xl ${
                    isCurrentUser ? 'bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/50' : ''
                  }`}
                  title={`Lihat profil detail ${item.name}`}
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

      {/* Visual floating shortcuts hotkey reminder panel */}
      <div className="fixed bottom-4 right-4 z-40 bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 max-w-sm text-xs font-semibold select-none animate-fade-in sm:opacity-90 hover:opacity-100 transition-opacity">
        <span className="bg-indigo-600 px-2 py-0.5 rounded text-[10px] font-black uppercase text-white animate-pulse">⌨️ HOTKEYS</span>
        <span className="text-[10.5px] text-slate-200">Tekan <kbd className="bg-slate-800 border border-slate-700 px-1 py-0.2 rounded font-mono text-[9px]">?</kbd> atau <kbd className="bg-slate-800 border border-slate-700 px-1 py-0.2 rounded font-mono text-[9px]">H</kbd> untuk panduan pintasan</span>
        <button 
          onClick={() => setShowShortcutsHelp(true)}
          className="bg-indigo-600 hover:bg-indigo-750 text-white font-extrabold px-3 py-1 rounded-xl text-[10px] uppercase cursor-pointer"
        >
          Lihat
        </button>
      </div>

      {/* Keyboard Shortcuts Detailed Interactive Walkthrough Dialog Overlay */}
      <AnimatePresence>
        {showShortcutsHelp && (
          <div className="fixed inset-0 z-[1010] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShortcutsHelp(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 24 }}
              className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl border text-left overflow-hidden ${
                isEyeCare 
                  ? 'bg-[#fbf6eb] border-[#eae0cf] text-[#4a3e2e]' 
                  : 'bg-white border-slate-150 text-slate-800'
              }`}
            >
              {/* Header block with close icon */}
              <div className="flex justify-between items-center pb-4 border-b border-inherit/40 mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-600 text-white p-1.5 rounded-xl">
                    <Keyboard className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider leading-none">
                      Pintasan Keyboard (Shortcuts)
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                      Navigasi kilat di Forum Komunitas Pedagogi IPS
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShortcutsHelp(false)}
                  className="p-1.5 rounded-lg border bg-slate-50 hover:bg-slate-100 text-slate-400 cursor-pointer"
                  title="Tutup dialog"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Grid showing individual keys */}
              <div className="space-y-2.5">
                {[
                  { keys: ['J', '↓'], desc: 'Pilih postingan berikutnya di linimasa' },
                  { keys: ['K', '↑'], desc: 'Pilih postingan sebelumnya di linimasa' },
                  { keys: ['O', 'Enter'], desc: 'Buka atau tutup jawaban / diskusi detail' },
                  { keys: ['U', 'L'], desc: 'Beri upvote / jempol pembangun pada rikuest' },
                  { keys: ['R', 'C'], desc: 'Tulis tanggapan atau draf solusi baru' },
                  { keys: ['N'], desc: 'Buat postingan rikuest materi pedagogi baru' },
                  { keys: ['? / H'], desc: 'Tampilkan / sembunyikan dialog bantuan ini' },
                  { keys: ['Esc'], desc: 'Keluar dari ketikan / batalkan pilihan aktif' },
                ].map((item) => (
                  <div key={item.keys.join('')} className="flex items-center justify-between py-1 border-b border-slate-100/40 last:border-0">
                    <div className="flex gap-1.5 shrink-0">
                      {item.keys.map((k) => (
                        <kbd key={k} className="bg-slate-100 border border-slate-200 text-slate-700 shadow-sm font-mono text-[10px] font-black px-2 py-1 rounded-lg">
                          {k}
                        </kbd>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500 font-bold text-right ml-4">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick tip box */}
              <div className="mt-5 p-3 rounded-2xl bg-amber-500/5 border border-amber-200/50 text-slate-600 text-[10px] leading-relaxed">
                <span className="font-extrabold text-amber-700 uppercase block mb-0.5">💡 Tips Penggunaan</span>
                Setiap kali postingan aktif tersorot dalam warna indigo/amber yang elegan, Anda dapat menekan <kbd className="font-mono bg-slate-200/60 px-1 py-0.2 rounded font-bold">R</kbd> untuk langsung memicu kotak jawaban. Pintasan otomatis diabaikan ketika kursor sedang aktif di dalam area mengetik.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
