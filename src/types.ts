export interface User {
  id: string;
  name: string;
  role: 'Guru' | 'Siswa' | 'Admin' | 'Umum';
  points: number;
  level: number;
  badges: Badge[];
  isPremium: boolean;
  avatarColor: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'badge' | 'forum_reply' | 'request_solved' | 'level_up' | 'system';
  timestamp: string;
  read: boolean;
}

export interface Reply {
  id: string;
  authorName: string;
  authorRole: string;
  authorColor: string;
  points: number;
  content: string;
  timestamp: string;
  likes: number;
  isBestAnswer?: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  description: string;
  category: 'TWK' | 'TIU' | 'TKP' | 'IPS SMP' | 'Geografi';
  type: 'modul' | 'soal' | 'prediksi' | 'bahas';
  authorName: string;
  authorRole: string;
  authorColor: string;
  replies_count: number;
  likes: number;
  status: 'open' | 'solved' | 'draft';
  votes: number;
  timestamp: string;
  replies?: Reply[];
}

export interface SyncFeedItem {
  id: string;
  source: string;
  title: string;
  url: string;
  timestamp: string;
  category: string;
}
