import { Project, Comment, Article } from "@/types";

// Mock user profiles
const users = [
  {
    id: "1",
    name: "Budi Santoso",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    university: "Universitas Indonesia",
    major: "Ilmu Komputer"
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    university: "Institut Teknologi Bandung",
    major: "Teknik Perangkat Lunak"
  },
  {
    id: "3",
    name: "Ahmad Rizki",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    university: "Universitas Gadjah Mada",
    major: "Sistem Informasi"
  }
];

// Mock project data
export const mockProjects: Project[] = [
  {
    id: "1",
    title: "EcoTrack - Aplikasi Pengelolaan Sampah",
    description: "Progressive Web App untuk melacak dan mengelola pengumpulan sampah di area perkotaan. Dilengkapi pelacakan real-time, klasifikasi sampah berbasis AI, dan papan peringkat komunitas.",
    thumbnailUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    techStack: ["Next.js", "TypeScript", "Supabase", "TailwindCSS", "PostGIS"],
    links: {
      github: "https://github.com/example/ecotrack",
      demo: "https://ecotrack-demo.vercel.app"
    },
    stats: {
      views: 1240,
      likes: 89,
      commentCount: 12
    },
    donationEnabled: true,
    type: "free",
    author: users[0]
  },
  {
    id: "2",
    title: "StudyBuddy - Platform Belajar Kolaboratif",
    description: "Platform belajar kolaboratif real-time dengan video chat, papan tulis bersama, dan asisten belajar AI. Sempurna untuk pembelajaran jarak jauh dan proyek kelompok.",
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop"
    ],
    techStack: ["React", "WebRTC", "Socket.io", "Node.js", "MongoDB"],
    links: {
      github: "https://github.com/example/studybuddy",
      demo: "https://studybuddy-demo.netlify.app"
    },
    stats: {
      views: 890,
      likes: 67,
      commentCount: 8
    },
    donationEnabled: true,
    type: "paid",
    price: 75000,
    author: users[1]
  },
  {
    id: "3",
    title: "SmartKampus - Navigasi Kampus",
    description: "Sistem navigasi indoor untuk kampus universitas menggunakan AR dan layanan lokasi real-time. Membantu mahasiswa menemukan ruang kelas, fasilitas, dan acara.",
    thumbnailUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607013407627-6ee814329547?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"
    ],
    techStack: ["React Native", "AR.js", "Firebase", "Google Maps API"],
    links: {
      github: "https://github.com/example/smartkampus",
      demo: "https://smartkampus.expo.dev"
    },
    stats: {
      views: 2100,
      likes: 156,
      commentCount: 24
    },
    donationEnabled: true,
    type: "free",
    author: users[2]
  },
  {
    id: "4",
    title: "FoodShare - Berbagi Makanan Kampus",
    description: "Menghubungkan mahasiswa untuk berbagi makanan berlebih dan mengurangi limbah. Dilengkapi daftar real-time, sistem chat, dan penilaian reputasi.",
    thumbnailUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    techStack: ["Vue.js", "Express", "PostgreSQL", "Redis"],
    links: {
      github: "https://github.com/example/foodshare",
      demo: "https://foodshare-campus.vercel.app"
    },
    stats: {
      views: 1560,
      likes: 112,
      commentCount: 18
    },
    donationEnabled: true,
    type: "paid",
    price: 50000,
    author: users[0]
  },
  {
    id: "5",
    title: "CodeReview.AI - Analisis Kode Otomatis",
    description: "Asisten review kode berbasis AI yang memberikan feedback instan tentang kualitas kode, kerentanan keamanan, dan best practices.",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
    techStack: ["Python", "FastAPI", "OpenAI", "Docker", "GitHub Actions"],
    links: {
      github: "https://github.com/example/codereview-ai",
      demo: "https://codereview-ai.herokuapp.com"
    },
    stats: {
      views: 3200,
      likes: 245,
      commentCount: 35
    },
    donationEnabled: true,
    type: "paid",
    price: 150000,
    author: users[1]
  },
  {
    id: "6",
    title: "EventHub - Manajer Acara Kampus",
    description: "Permudah pengorganisasian acara kampus dengan manajemen tiket, check-in kode QR, dan dashboard analitik untuk organisasi mahasiswa.",
    thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    techStack: ["Next.js", "Prisma", "tRPC", "Stripe", "QR Code"],
    links: {
      github: "https://github.com/example/eventhub",
      demo: "https://eventhub-campus.vercel.app"
    },
    stats: {
      views: 980,
      likes: 73,
      commentCount: 9
    },
    donationEnabled: true,
    type: "paid",
    price: 100000,
    author: users[2]
  }
];

// Mock comments
export const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      user: users[1],
      content: "Ini luar biasa! Fitur klasifikasi sampahnya sangat mengesankan. Seberapa akurat model AI-nya?",
      createdAt: new Date("2025-12-07T10:30:00")
    },
    {
      id: "c2",
      user: users[2],
      content: "Suka desain UI-nya! Sangat bersih dan intuitif. Semoga bisa diimplementasikan di kota saya.",
      createdAt: new Date("2025-12-07T14:15:00")
    }
  ],
  "2": [
    {
      id: "c3",
      user: users[0],
      content: "Kerja bagus untuk implementasi WebRTC-nya! Apakah ada tantangan dengan NAT traversal?",
      createdAt: new Date("2025-12-06T09:20:00")
    }
  ],
  "3": [
    {
      id: "c4",
      user: users[0],
      content: "Navigasi AR-nya super keren! Bagaimana cara menangani akurasi posisi indoor?",
      createdAt: new Date("2025-12-05T16:45:00")
    },
    {
      id: "c5",
      user: users[1],
      content: "Ini akan sangat berguna untuk mahasiswa baru! Apakah sudah tersedia untuk diunduh?",
      createdAt: new Date("2025-12-06T11:30:00")
    }
  ]
};

// Mock articles
export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Tips Membuat Portofolio yang Menarik untuk Mahasiswa IT",
    excerpt: "Panduan lengkap membangun portofolio developer yang impresif dan menonjol di mata rekruter.",
    content: `
# Tips Membuat Portofolio yang Menarik untuk Mahasiswa IT

Sebagai mahasiswa IT, memiliki portofolio yang kuat adalah kunci untuk menonjol di pasar kerja yang kompetitif. Berikut adalah beberapa tips untuk membangun portofolio yang impresif.

## 1. Pilih Proyek Terbaikmu

Fokuslah pada 3-5 proyek terbaik yang menunjukkan kemampuan dan kreativitasmu. Lebih baik memiliki beberapa proyek berkualitas tinggi daripada banyak proyek yang biasa saja.

## 2. Dokumentasi yang Baik

Setiap proyek harus memiliki README yang jelas dengan:
- Deskripsi proyek
- Teknologi yang digunakan
- Cara menjalankan proyek
- Screenshot atau demo

## 3. Live Demo

Jika memungkinkan, deploy proyekmu agar dapat diakses secara online. Ini menunjukkan bahwa kamu serius dengan proyekmu.

## 4. Kode yang Bersih

Pastikan kode-mu rapi, terdokumentasi, dan mengikuti best practices.

## 5. Ceritakan Prosesmu

Jelaskan tantangan yang kamu hadapi dan bagaimana kamu mengatasinya. Ini menunjukkan kemampuan problem-solving-mu.
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop",
    category: "Karier",
    readingTime: 8,
    publishedAt: new Date("2025-12-10T09:00:00"),
    author: users[0]
  },
  {
    id: "2",
    title: "Teknologi AI yang Wajib Dipelajari di 2025",
    excerpt: "Eksplorasi tren AI terbaru yang akan mendominasi industri teknologi tahun ini.",
    content: `
# Teknologi AI yang Wajib Dipelajari di 2025

Artificial Intelligence terus berkembang pesat. Berikut adalah teknologi AI yang wajib dipelajari mahasiswa di tahun 2025.

## 1. Large Language Models (LLM)

Setelah sukses ChatGPT, pemahaman tentang LLM menjadi sangat penting. Pelajari cara menggunakan API seperti OpenAI, Anthropic, dan Google Gemini.

## 2. Generative AI untuk Gambar dan Video

Tools seperti Midjourney, Stable Diffusion, dan Runway ML membuka peluang baru dalam kreatif industri.

## 3. AI Agents

Pengembangan AI yang dapat melakukan tugas secara otonom menjadi fokus utama. Pelajari framework seperti LangChain dan AutoGPT.

## 4. Edge AI

Menjalankan model AI di perangkat lokal tanpa cloud menjadi tren penting untuk privasi dan efisiensi.

## 5. Responsible AI

Pemahaman tentang etika AI, bias, dan fairness menjadi semakin krusial.
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    category: "Teknologi",
    readingTime: 6,
    publishedAt: new Date("2025-12-09T14:30:00"),
    author: users[1]
  },
  {
    id: "3",
    title: "Cara Efektif Mengelola Waktu sebagai Mahasiswa Developer",
    excerpt: "Strategi manajemen waktu untuk menyeimbangkan kuliah, proyek, dan kehidupan sosial.",
    content: `
# Cara Efektif Mengelola Waktu sebagai Mahasiswa Developer

Menyeimbangkan kuliah, projekt coding, dan kehidupan sosial bisa menjadi tantangan. Berikut strategi yang bisa membantu.

## 1. Prioritaskan dengan Matriks Eisenhower

Kategorikan tugas berdasarkan urgency dan importance. Fokus pada yang penting terlebih dahulu.

## 2. Time Blocking

Alokasikan waktu spesifik untuk coding, belajar, dan istirahat. Gunakan teknik Pomodoro untuk fokus maksimal.

## 3. Gunakan Tools Produktivitas

Manfaatkan tools seperti Notion, Trello, atau GitHub Projects untuk melacak progress.

## 4. Jangan Multitask

Fokus pada satu tugas dalam satu waktu. Context switching mengurangi produktivitas.

## 5. Istirahat yang Cukup

Jangan mengorbankan tidur. Otak yang segar akan lebih produktif daripada bekerja saat lelah.
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
    category: "Produktivitas",
    readingTime: 5,
    publishedAt: new Date("2025-12-08T10:00:00"),
    author: users[2]
  },
  {
    id: "4",
    title: "Open Source: Pintu Gerbang Menuju Karier Developer",
    excerpt: "Bagaimana berkontribusi pada proyek open source dapat mempercepat kariermu.",
    content: `
# Open Source: Pintu Gerbang Menuju Karier Developer

Kontribusi open source adalah salah satu cara terbaik untuk membangun reputasi sebagai developer.

## Mengapa Open Source?

- Belajar dari kode profesional
- Membangun jaringan dengan developer lain
- Menunjukkan kemampuan nyata kepada recruiter
- Mendapatkan pengalaman bekerja dalam tim

## Cara Memulai

1. Cari proyek yang sesuai dengan skillmu
2. Baca dokumentasi dan guidelines kontribusi
3. Mulai dari issue yang berlabel "good first issue"
4. Jangan takut bertanya di komunitas

## Tips Sukses

- Konsisten dalam berkontribusi
- Jaga kualitas kode
- Hormati maintainer dan kontributor lain
- Dokumentasikan kontribusimu
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop",
    category: "Pengembangan",
    readingTime: 7,
    publishedAt: new Date("2025-12-07T16:00:00"),
    author: users[0]
  },
  {
    id: "5",
    title: "Membangun Aplikasi Mobile dengan React Native di 2025",
    excerpt: "Panduan lengkap memulai pengembangan aplikasi mobile cross-platform.",
    content: `
# Membangun Aplikasi Mobile dengan React Native di 2025

React Native tetap menjadi pilihan populer untuk pengembangan mobile cross-platform.

## Mengapa React Native?

- Satu codebase untuk iOS dan Android
- Komunitas besar dan ekosistem yang matang
- Hot reload untuk development yang cepat
- Performa mendekati native

## Setup dan Tools

1. Install Node.js dan npm
2. Gunakan Expo untuk memulai dengan cepat
3. VS Code dengan extension React Native

## Best Practices

- Gunakan TypeScript untuk type safety
- Implementasikan state management yang tepat
- Optimalkan performa dengan useMemo dan useCallback
- Test di berbagai perangkat
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    category: "Mobile",
    readingTime: 10,
    publishedAt: new Date("2025-12-06T12:00:00"),
    author: users[1]
  },
  {
    id: "6",
    title: "Keamanan Siber untuk Developer Pemula",
    excerpt: "Prinsip-prinsip keamanan dasar yang wajib diketahui setiap developer.",
    content: `
# Keamanan Siber untuk Developer Pemula

Keamanan harus menjadi prioritas sejak awal pengembangan, bukan afterthought.

## Prinsip Dasar

1. Never trust user input - selalu validasi
2. Gunakan HTTPS untuk semua komunikasi
3. Hash password dengan algoritma yang aman
4. Implementasikan authentication dan authorization

## Common Vulnerabilities

- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Insecure Direct Object References

## Tools yang Berguna

- OWASP ZAP untuk security testing
- Snyk untuk vulnerability scanning
- SonarQube untuk code analysis

## Tips

- Keep dependencies updated
- Jangan hardcode secrets
- Gunakan environment variables
- Implement logging dan monitoring
    `,
    thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
    category: "Keamanan",
    readingTime: 9,
    publishedAt: new Date("2025-12-05T08:00:00"),
    author: users[2]
  }
];

