"use client";

import { useState, useEffect } from "react";
import { configurationService, Configuration } from "@/lib/services/configuration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Loader2, 
  Save, 
  Settings, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";

// All configuration keys with their metadata
const CONTACT_CONFIGS = [
  { key: "site.email", label: "Email", icon: <Mail className="w-5 h-5" />, placeholder: "hello@example.com" },
  { key: "site.phone", label: "Telepon", icon: <Phone className="w-5 h-5" />, placeholder: "+62 812-345-6789" },
  { key: "site.address", label: "Alamat", icon: <MapPin className="w-5 h-5" />, placeholder: "Jl. Contoh No. 123, Kota" },
];

const SOCIAL_CONFIGS = [
  { key: "site.instagram", label: "Instagram", icon: <Instagram className="w-5 h-5" />, placeholder: "https://instagram.com/username" },
  { key: "site.twitter", label: "Twitter / X", icon: <Twitter className="w-5 h-5" />, placeholder: "https://twitter.com/username" },
  { key: "site.linkedin", label: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, placeholder: "https://linkedin.com/company/name" },
  { key: "site.github", label: "GitHub", icon: <Github className="w-5 h-5" />, placeholder: "https://github.com/username" },
];

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    setIsLoading(true);
    try {
      const data = await configurationService.getAllConfigurations();
      
      // Initialize form data from configurations
      const initialData: Record<string, string> = {};
      if (Array.isArray(data)) {
        data.forEach((config: Configuration) => {
          initialData[config.key] = config.value;
        });
      }
      setFormData(initialData);
    } catch (error) {
      console.error("Error fetching configurations:", error);
      toast.error("Gagal memuat konfigurasi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await configurationService.updateConfigurations(formData);
      toast.success("Konfigurasi berhasil disimpan");
    } catch (error) {
      console.error("Error saving configurations:", error);
      toast.error("Gagal menyimpan konfigurasi");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Settings className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Pengaturan Website</h1>
          <p className="text-zinc-400">Kelola konfigurasi dan informasi website</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-6">Informasi Kontak</h2>
          <div className="grid gap-6">
            {CONTACT_CONFIGS.map((config) => (
              <div key={config.key} className="grid md:grid-cols-[200px,1fr] gap-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    {config.icon}
                  </div>
                  <Label className="text-zinc-100">{config.label}</Label>
                </div>
                <Input
                  value={formData[config.key] || ""}
                  onChange={(e) => handleChange(config.key, e.target.value)}
                  placeholder={config.placeholder}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-6">Media Sosial</h2>
          <div className="grid gap-6">
            {SOCIAL_CONFIGS.map((config) => (
              <div key={config.key} className="grid md:grid-cols-[200px,1fr] gap-4 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                    {config.icon}
                  </div>
                  <Label className="text-zinc-100">{config.label}</Label>
                </div>
                <Input
                  type="url"
                  value={formData[config.key] || ""}
                  onChange={(e) => handleChange(config.key, e.target.value)}
                  placeholder={config.placeholder}
                  className="bg-zinc-800/50 border-zinc-700"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
