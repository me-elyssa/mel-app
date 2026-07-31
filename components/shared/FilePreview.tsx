"use client";

import { ExternalLink } from "lucide-react";
import { isGoogleDriveUrl } from "@/lib/googleDrive";
import DriveFileCard from "@/components/shared/DriveFileCard";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".avif"];

interface FilePreviewProps {
  url: string;
  title: string;
}

export default function FilePreview({ url, title }: FilePreviewProps) {
  const lower = url.toLowerCase().split("?")[0];
  const isPdf = lower.endsWith(".pdf");
  const isImage = IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
  const isDrive = isGoogleDriveUrl(url);

  if (isDrive) {
    return (
      <div className="m-5">
        <DriveFileCard url={url} />
      </div>
    );
  }

  if (isImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={title}
        className="w-full max-h-[420px] object-contain bg-[#F3F5F9] border-b border-[#EAECEF]"
      />
    );
  }

  if (isPdf) {
    return <iframe src={url} className="w-full h-[420px] border-b border-[#EAECEF]" title={title} />;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 m-5 p-4 rounded-[12px] bg-[#F3F5F9] text-[#1E63FF] font-medium text-sm hover:bg-[#EAECEF]"
    >
      <ExternalLink className="w-4 h-4" />
      Abrir arquivo / link
    </a>
  );
}
