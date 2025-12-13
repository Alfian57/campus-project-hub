import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-50">Campus Hub</h1>
              </div>
            </Link>

            {/* Back Button */}
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-zinc-50 mb-8">Kebijakan Privasi</h1>
        <p className="text-zinc-400 mb-8">Terakhir diperbarui: 13 Desember 2024</p>

        <div className="prose prose-invert prose-zinc max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-zinc-300 leading-relaxed">
              Campus Project Hub berkomitmen untuk melindungi privasi Anda. Kebijakan privasi ini 
              menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi 
              informasi pribadi Anda saat menggunakan platform kami.
            </p>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">1. Informasi yang Dikumpulkan</h2>
            <p className="text-zinc-300 leading-relaxed">Kami mengumpulkan beberapa jenis informasi dari pengguna:</p>
            
            <h3 className="text-lg font-medium text-zinc-200 mt-4 mb-2">Informasi Akun</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Nama lengkap</li>
              <li>Alamat email</li>
              <li>Universitas dan jurusan</li>
              <li>Foto profil (opsional)</li>
              <li>Nomor telepon (opsional)</li>
            </ul>

            <h3 className="text-lg font-medium text-zinc-200 mt-4 mb-2">Informasi Proyek</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Judul dan deskripsi proyek</li>
              <li>Gambar dan screenshot</li>
              <li>Tautan kode sumber dan demo</li>
              <li>Teknologi yang digunakan</li>
            </ul>

            <h3 className="text-lg font-medium text-zinc-200 mt-4 mb-2">Informasi Penggunaan</h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>Log aktivitas dan interaksi</li>
              <li>Alamat IP dan informasi perangkat</li>
              <li>Cookie dan data pelacakan</li>
              <li>Preferensi pengguna</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">2. Penggunaan Informasi</h2>
            <p className="text-zinc-300 leading-relaxed">Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
              <li>Menyediakan dan memelihara layanan platform</li>
              <li>Memproses transaksi dan pembayaran</li>
              <li>Mengirim notifikasi penting terkait akun Anda</li>
              <li>Meningkatkan pengalaman pengguna dan fitur platform</li>
              <li>Menganalisis tren penggunaan untuk pengembangan layanan</li>
              <li>Mencegah aktivitas curang dan melindungi keamanan platform</li>
              <li>Mematuhi kewajiban hukum yang berlaku</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">3. Keamanan Data</h2>
            <p className="text-zinc-300 leading-relaxed">
              Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk 
              melindungi informasi pribadi Anda dari akses tidak sah, pengubahan, pengungkapan, 
              atau penghancuran.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-4">Langkah-langkah keamanan kami meliputi:</p>
            <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
              <li>Enkripsi data saat transit dan penyimpanan</li>
              <li>Autentikasi dua faktor (jika diaktifkan)</li>
              <li>Akses terbatas ke data pribadi</li>
              <li>Pemantauan keamanan secara berkala</li>
              <li>Pembaruan keamanan rutin</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">4. Cookie dan Teknologi Pelacakan</h2>
            <p className="text-zinc-300 leading-relaxed">
              Kami menggunakan cookie dan teknologi pelacakan serupa untuk meningkatkan pengalaman 
              Anda di platform kami. Cookie membantu kami mengingat preferensi Anda, memahami 
              bagaimana Anda menggunakan layanan kami, dan menyesuaikan konten.
            </p>
            <p className="text-zinc-300 leading-relaxed mt-4">Jenis cookie yang kami gunakan:</p>
            <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
              <li><strong className="text-zinc-200">Cookie Esensial:</strong> Diperlukan untuk fungsi dasar platform</li>
              <li><strong className="text-zinc-200">Cookie Analitik:</strong> Membantu kami memahami penggunaan platform</li>
              <li><strong className="text-zinc-200">Cookie Preferensi:</strong> Mengingat pilihan dan pengaturan Anda</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Anda dapat mengontrol penggunaan cookie melalui pengaturan browser Anda. Namun, 
              menonaktifkan cookie tertentu dapat memengaruhi fungsionalitas platform.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">5. Berbagi Informasi</h2>
            <p className="text-zinc-300 leading-relaxed">
              Kami tidak menjual informasi pribadi Anda kepada pihak ketiga. Namun, kami dapat 
              berbagi informasi dalam situasi berikut:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
              <li>Dengan penyedia layanan pihak ketiga yang membantu operasi platform</li>
              <li>Untuk memproses pembayaran melalui gateway pembayaran</li>
              <li>Jika diwajibkan oleh hukum atau proses hukum</li>
              <li>Untuk melindungi hak, properti, atau keselamatan kami dan pengguna</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">6. Hak Pengguna</h2>
            <p className="text-zinc-300 leading-relaxed">Sebagai pengguna, Anda memiliki hak untuk:</p>
            <ul className="list-disc list-inside text-zinc-300 mt-3 space-y-2">
              <li><strong className="text-zinc-200">Akses:</strong> Meminta salinan data pribadi yang kami simpan tentang Anda</li>
              <li><strong className="text-zinc-200">Koreksi:</strong> Memperbarui atau memperbaiki informasi yang tidak akurat</li>
              <li><strong className="text-zinc-200">Penghapusan:</strong> Meminta penghapusan data pribadi Anda</li>
              <li><strong className="text-zinc-200">Portabilitas:</strong> Menerima data Anda dalam format yang dapat dibaca mesin</li>
              <li><strong className="text-zinc-200">Keberatan:</strong> Menolak pemrosesan data untuk tujuan tertentu</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              Untuk menggunakan hak-hak ini, silakan hubungi kami melalui email yang tercantum di 
              bawah. Kami akan merespons permintaan Anda dalam waktu 30 hari kerja.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">7. Retensi Data</h2>
            <p className="text-zinc-300 leading-relaxed">
              Kami menyimpan informasi pribadi Anda selama akun Anda aktif atau selama diperlukan 
              untuk menyediakan layanan kepada Anda. Jika Anda menghapus akun, kami akan menghapus 
              atau menganonimkan data Anda dalam waktu 90 hari, kecuali jika kami diwajibkan secara 
              hukum untuk menyimpannya lebih lama.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">8. Perubahan Kebijakan</h2>
            <p className="text-zinc-300 leading-relaxed">
              Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan material 
              akan diumumkan melalui email atau notifikasi di platform. Kami mendorong Anda untuk 
              meninjau kebijakan ini secara berkala untuk tetap mendapat informasi tentang bagaimana 
              kami melindungi informasi Anda.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mt-12">
            <h2 className="text-xl font-semibold text-zinc-100 mb-3">Hubungi Kami</h2>
            <p className="text-zinc-300">
              Jika Anda memiliki pertanyaan atau kekhawatiran tentang kebijakan privasi ini atau 
              praktik privasi kami, silakan hubungi kami di:
            </p>
            <p className="text-blue-400 mt-2">privacy@campushub.com</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
