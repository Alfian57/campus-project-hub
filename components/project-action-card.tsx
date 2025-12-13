"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PurchaseModal } from "@/components/purchase-modal";
import { useAuth } from "@/components/providers/AuthContext";
import { Github, Globe, Lock, Crown, Check } from "lucide-react";

interface ProjectActionCardProps {
  projectId: string;
  projectTitle: string;
  projectType: "free" | "paid";
  price: number;
  authorId: string;
  links: {
    github: string;
    demo: string;
  };
}

export function ProjectActionCard({
  projectId,
  projectTitle,
  projectType,
  price,
  authorId,
  links,
}: ProjectActionCardProps) {
  const { user, isAuthenticated } = useAuth();
  
  const isOwner = isAuthenticated && user?.id === authorId;
  const canAccessSourceCode = projectType === "free" || isOwner;

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6 space-y-3">
        <h3 className="font-semibold text-zinc-50 mb-4">
          Tautan Proyek
        </h3>
        
        {/* Demo Button - Always Available */}
        <a
          href={links.demo}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" variant="default">
            <Globe className="w-4 h-4 mr-2" />
            Lihat Demo
          </Button>
        </a>
        
        {/* Source Code Button - Conditional */}
        {canAccessSourceCode ? (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 mt-3" size="lg" variant="outline">
              <Github className="w-4 h-4 mr-2" />
              Lihat Kode Sumber
            </Button>
          </a>
        ) : (
          <div className="mt-3 space-y-3">
            {/* Locked Source Code Notice */}
            <div className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                <Lock className="w-4 h-4" />
                <span>Kode sumber terkunci</span>
              </div>
              <p className="text-xs text-zinc-500">
                Beli proyek ini untuk mendapatkan akses ke source code
              </p>
            </div>
            
            {/* Purchase Button */}
            <PurchaseModal
              projectId={projectId}
              projectTitle={projectTitle}
              price={price}
            >
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold" 
                size="lg"
              >
                <Crown className="w-4 h-4 mr-2" />
                Beli - Rp {price.toLocaleString("id-ID")}
              </Button>
            </PurchaseModal>
          </div>
        )}

        {/* Owner Notice */}
        {isOwner && projectType === "paid" && (
          <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-800">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Check className="w-4 h-4" />
              <span>Ini adalah proyek milik Anda</span>
            </div>
            <p className="text-xs text-green-500/80 mt-1">
              Anda memiliki akses penuh ke semua fitur proyek ini
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
