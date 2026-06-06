import { ForumPost, Badge, Notification, SyncFeedItem } from './types';

export const EXCLUSIVE_ROOM_MESSAGES = [
  { id: 'm1', author: 'Catur Pamungkas, S.Pd., Gr.', role: 'Guru', color: 'bg-emerald-600', text: 'Halo rekan-rekan pendidik dan peserta didik berprestasi! Ruang Eksklusif ini khusus untuk kalian yang mencapai Peringkat Master.', timestamp: '10 menit yang lalu' },
  { id: 'm2', author: 'Ahmad Faisal', role: 'Siswa', color: 'bg-blue-600', text: 'Terima kasih Pak Catur! Senang sekali bisa bergabung di forum eksklusif ini setelah mengumpulkan 800 poin.', timestamp: '8 menit yang lalu' },
  { id: 'm3', author: 'Dewi Lestari, S.Pd.', role: 'Guru', color: 'bg-indigo-600', text: 'Prediksi soal TWK terbaru yang membahas Integrasi Nasional kemarin sudah saya validasi. Sangat cocok dengan kisi-kisi BKN terbaru.', timestamp: '5 menit yang lalu' }
];

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'b1',
    name: 'Socrates IPS',
    description: 'Diberikan saat berhasil menjawab 5 pertanyaan di kategori IPS SMP',
    icon: '🎓',
    unlockedAt: '2026-06-01'
  },
  {
    id: 'b2',
    name: 'Pakar TWK',
    description: 'Diberikan karena memberikan jawaban terbaik berturut-turut pada simulasi bela negara',
    icon: '🇮🇩',
    unlockedAt: '2026-06-03'
  },
  {
    id: 'b3',
    name: 'Pemberi Solusi',
    description: 'Membantu 10 rekan belajar memecahkan soal matematika/logika TIU',
    icon: '💡',
    unlockedAt: '2026-06-04'
  },
  {
    id: 'b4',
    name: 'Kartografer Hebat',
    description: 'Menyajikan bagan/gambar geografi terowongan bumi teroptimasi',
    icon: '🗺️',
    unlockedAt: '2026-06-05'
  },
  {
    id: 'b5',
    name: 'Inovator Edukasi',
    description: 'Telah merancang 3 rikuest modul berkualitas tinggi yang diunduh secara global',
    icon: '✨',
    unlockedAt: '2026-06-06'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Jawaban Terbaik Ditandai',
    content: 'Wah, Catur Pamungkas menandai penjelasan TIU Anda tentang Syllogism sebagai JAWABAN TERBAIK. Anda mendapatkan +50 Poin!',
    type: 'request_solved',
    timestamp: '5 menit yang lalu',
    read: false
  },
  {
    id: 'n2',
    title: 'Lencana Pencapaian Baru',
    content: 'Selamat! Anda telah membuka lencana "Socrates IPS" karena aktif berkolaborasi.',
    type: 'badge',
    timestamp: '1 jam yang lalu',
    read: false
  },
  {
    id: 'n3',
    title: 'Rikuest Modul Baru',
    content: 'Pendidik Ahmad mengupload draf modul: "Geografi Pariwisata Kebencanaan Fase F"',
    type: 'system',
    timestamp: 'Yesterday',
    read: true
  },
  {
    id: 'n4',
    title: 'Naik Tingkat!',
    content: 'Poin Anda mencapai 500! Anda sekarang berada di Tingkat 6 (Spesialis Geografi).',
    type: 'level_up',
    timestamp: '2 hari yang lalu',
    read: true
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    title: 'Rikuest Pembahasan: Soal TIU Deret Angka Matematika Berpola Fibonacci bertingkat',
    description: 'Saya kesulitan memecahkan tipe soal deret berikut: 3, 5, 9, 17, 33, ... Bagaimana formula matematis tercepat untuk menjawab tipe soal ini di seleksi CPNS asli?',
    category: 'TIU',
    type: 'soal',
    authorName: 'Ahmad Danial',
    authorRole: 'Siswa',
    authorColor: 'bg-emerald-500',
    replies_count: 3,
    likes: 18,
    votes: 4,
    status: 'solved',
    timestamp: '20 menit yang lalu',
    replies: [
      {
        id: 'r1',
        authorName: 'Dra. Endang Herawati',
        authorRole: 'Guru',
        authorColor: 'bg-purple-600',
        points: 420,
        content: 'Formula cepatnya adalah Un = 2^n + 1. Contohnya: U1=3 (2^1+1), U2=5 (2^2+1), U3=9 (2^3+1). Jadi nilai berikutnya yakni U6 = 2^6 + 1 = 64 + 1 = 65!',
        timestamp: '15 menit yang lalu',
        likes: 12,
        isBestAnswer: true
      },
      {
        id: 'r2',
        authorName: 'Catur Pamungkas, S.Pd., Gr.',
        authorRole: 'Guru',
        authorColor: 'bg-indigo-600',
        points: 1540,
        content: 'Sangat tepat penjelasan dari Bu Endang! Pola selisihnya juga membentuk deret geometri yang berlipat ganda (+2, +4, +8, +16, +32). Jadi bilangan setelah 33 adalah 33 + 32 = 65.',
        timestamp: '10 menit yang lalu',
        likes: 8
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Rikuest Modul: Ringkasan Rencana Ajar IPS Kelas IX - Kurikulum Merdeka Tema Kebencanaan Global',
    description: 'Kami membutuhkan contoh draf Rencana Pelaksanaan Pembelajaran (RPP) interaktif yang ramah visual mengenai Kebencanaan Geografis di Indonesia (Patahan Semangko & Cincin Api Pasifik). Terima kasih sebelumnya.',
    category: 'IPS SMP',
    type: 'modul',
    authorName: 'Siti Kinasih, S.Pd.',
    authorRole: 'Guru',
    authorColor: 'bg-rose-500',
    replies_count: 1,
    likes: 24,
    votes: 9,
    status: 'open',
    timestamp: '1 jam yang lalu',
    replies: [
      {
        id: 'r3',
        authorName: 'Catur Pamungkas, S.Pd., Gr.',
        authorRole: 'Guru',
        authorColor: 'bg-indigo-600',
        points: 1540,
        content: 'Saya sedang menyusun infografis peta letak sesar aktif Semangko menggunakan simulator peta interaktif. Akan segera saya bagikan dalam format WebP teroptimasi sore ini agar tidak memberatkan presentasi sekolah!',
        timestamp: '45 menit yang lalu',
        likes: 14
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Prediksi Soal TWK: Karakteristik Soal Integritas Nasional & Pilar Negara CPNS 2026',
    description: 'Mari berdiskusi bersama mengenai bentuk pengamalan sila ke-4 Pancasila dalam situasi politik digital kontemporer. Apakah etika berpendapat di media sosial termasuk dalam butir pengamalan sila ini?',
    category: 'TWK',
    type: 'prediksi',
    authorName: 'Budi Santoso',
    authorRole: 'Umum',
    authorColor: 'bg-sky-500',
    replies_count: 0,
    likes: 12,
    votes: 3,
    status: 'open',
    timestamp: '3 jam yang lalu',
    replies: []
  },
  {
    id: 'post-4',
    title: 'Membahas Kolaboratif: Teori Teoretis Interaksi Lempeng Tektonik Indo-Australia & Eurasia di Geografi XII',
    description: 'Pemicu maraknya kegempaan vulkanik di busur dalam Sunda Banda. Diperlukan rincian skema subduksi yang mudah dicerna peserta didik SMA.',
    category: 'Geografi',
    type: 'bahas',
    authorName: 'Lukman Hakim',
    authorRole: 'Siswa',
    authorColor: 'bg-amber-600',
    replies_count: 0,
    likes: 7,
    votes: 1,
    status: 'open',
    timestamp: '5 jam yang lalu',
    replies: []
  }
];

export const INITIAL_SYNCED_FEED: SyncFeedItem[] = [
  {
    id: 'feed-1',
    source: 'Kementerian Pendidikan & Ristek',
    title: 'Panduan Penilaian Formatif IPS Kurikulum Merdeka 2026',
    url: 'https://kemdikbud.go.id',
    timestamp: '2 menit yang lalu',
    category: 'Edu-News'
  },
  {
    id: 'feed-2',
    source: 'Badan Kepegawaian Negara (BKN)',
    title: 'Penyesuaian Ambang Batas (Passing Grade) SKD CPNS Formasi Umum 2026',
    url: 'https://sscn.bkn.go.id',
    timestamp: '15 menit yang lalu',
    category: 'CPNS'
  },
  {
    id: 'feed-3',
    source: 'Blogger Catatan Guru IPS Feed',
    title: 'Kumpulan Media Pembelajaran Interaktif Geografi Mitigasi Bencana Terbitan V4',
    url: 'https://catatanguruips.blogspot.com',
    timestamp: '1 jam yang lalu',
    category: 'Blogger Tech'
  }
];

export const LEADERBOARD = [
  { name: 'Catur Pamungkas, S.Pd., Gr.', rank: 1, points: 1540, level: 12, badgeCount: 5, role: 'Guru', avatarColor: 'bg-indigo-600' },
  { name: 'Dra. Endang Herawati', rank: 2, points: 1120, level: 9, badgeCount: 4, role: 'Guru', avatarColor: 'bg-purple-600' },
  { name: 'Dewi Lestari, S.Pd.', rank: 3, points: 880, level: 7, badgeCount: 3, role: 'Guru', avatarColor: 'bg-pink-600' },
  { name: 'Ahmad Faisal', rank: 4, points: 810, level: 7, badgeCount: 3, role: 'Siswa', avatarColor: 'bg-blue-600' },
  { name: 'Siti Kinasih, S.Pd.', rank: 5, points: 550, level: 5, badgeCount: 2, role: 'Guru', avatarColor: 'bg-rose-500' },
  { name: 'Ahmad Danial', rank: 6, points: 410, level: 4, badgeCount: 2, role: 'Siswa', avatarColor: 'bg-emerald-500' }
];

export const THEME_PALETTES = {
  teduh: {
    name: 'Mode Teduh (Eye-Care Tint Mode)',
    bg: 'bg-[#fbf6eb]',
    text: 'text-[#4a3e2e]',
    secondaryText: 'text-[#6c5a49]',
    primaryAccent: 'text-[#b25e29]',
    border: 'border-[#eae0cf]',
    cardBg: 'bg-[#f6efe0]',
    tintHex: '#fbf6eb',
  },
  normal: {
    name: 'Minimalis Modern (Standard Mode)',
    bg: 'bg-slate-50',
    text: 'text-slate-800',
    secondaryText: 'text-slate-500',
    primaryAccent: 'text-emerald-600',
    border: 'border-slate-100',
    cardBg: 'bg-white',
    tintHex: '#f8fafc',
  }
};
