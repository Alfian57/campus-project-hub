import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Proyek",
  description:
    "Jelajahi ratusan proyek inovatif dari mahasiswa seluruh Indonesia. Temukan inspirasi, berikan feedback, dan dukung karya mereka.",
  openGraph: {
    title: "Daftar Proyek Mahasiswa - Campus Project Hub",
    description:
      "Jelajahi ratusan proyek inovatif dari mahasiswa seluruh Indonesia.",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
