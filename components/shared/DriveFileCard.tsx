"use client";

import { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { extractDriveFileId, driveThumbnailUrl } from "@/lib/googleDrive";

interface DriveFileCardProps {
  url: string;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Card com miniatura para links do Google Drive — sem API, sem backend.
 * Usa a URL pública de thumbnail do Drive; se a imagem não carregar
 * (arquivo privado, tipo sem preview, etc.), cai para um ícone genérico.
 */
export default function DriveFileCard({ url, onClick }: DriveFileCardProps) {
  const [thumbFalhou, setThumbFalhou] = useState(false);
  const fileId = extractDriveFileId(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-[12px] border border-[#E6EAF0] bg-white hover:bg-[#F3F5F9] transition-colors group"
    >
      {fileId && !thumbFalhou ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={driveThumbnailUrl(fileId)}
          alt=""
          onError={() => setThumbFalhou(true)}
          className="w-12 h-12 rounded-[8px] object-cover flex-shrink-0 border border-[#E6EAF0]"
        />
      ) : (
        <div className="w-12 h-12 rounded-[8px] bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-[#3730A3]" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#0B0F15] truncate">Arquivo do Google Drive</p>
        <p className="text-xs text-[#9AA0A6]">Abrir no Drive</p>
      </div>
      <ExternalLink className="w-4 h-4 text-[#9AA0A6] group-hover:text-[#1E63FF] flex-shrink-0" />
    </a>
  );
}
