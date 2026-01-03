'use client';

import { Button } from '@/components/ui/button';
import { FileText, Calendar, ArrowRight, Clock, ExternalLink, Sparkles, Lock, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ChapterButton({ chapter, onClick, isReading }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    onClick(chapter);
  };

  // Format chapter title untuk tampilan lebih baik
  const formatChapterTitle = (title) => {
    if (!title) return 'Chapter Unknown';
    
    // Remove "Chapter" atau "Bab" yang berulang
    let formatted = title.replace(/^(Chapter|Bab|Ch\.|Chap)\s*/i, '');
    
    // Extract chapter number jika ada
    const chapterMatch = title.match(/(\d+(\.\d+)?)/);
    const chapterNum = chapterMatch ? chapterMatch[1] : '';
    
    // Shorten jika terlalu panjang
    if (formatted.length > 50) {
      formatted = formatted.substring(0, 47) + '...';
    }
    
    return chapterNum ? `Chapter ${chapterNum}: ${formatted}` : formatted;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Cek apakah chapter baru (dibuat dalam 3 hari terakhir)
  const isNewChapter = () => {
    if (!chapter.releaseDate) return false;
    const releaseDate = new Date(chapter.releaseDate);
    const now = new Date();
    const diffDays = Math.floor((now - releaseDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  // Cek apakah chapter premium/locked
  const isLocked = () => {
    return chapter.isLocked || chapter.title?.toLowerCase().includes('premium') || chapter.title?.toLowerCase().includes('locked');
  };

  return (
    <div className="relative group">
      {/* Next.js glassmorphism effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl transition-all duration-500",
        "bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/60 dark:to-gray-800/40",
        "backdrop-blur-sm backdrop-saturate-150",
        "border border-white/40 dark:border-gray-700/40",
        "shadow-[0_1px_3px_0_rgba(0,0,0,0.03),0_1px_2px_-1px_rgba(0,0,0,0.03)]",
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full group-hover:before:translate-x-full before:transition-transform before:duration-1000",
        "after:absolute after:inset-0 after:rounded-xl after:border after:border-white/60 dark:after:border-gray-600/30",
        isHovered && !isReading && "shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)]",
        isReading && "shadow-[0_2px_12px_-1px_rgba(59,130,246,0.15)]"
      )} />
      
      {/* Gradient border effect */}
      <div className={cn(
        "absolute -inset-[1px] rounded-[13px] bg-gradient-to-br transition-all duration-500 opacity-0 group-hover:opacity-100",
        isReading 
          ? "from-blue-500/20 via-blue-600/20 to-blue-500/20" 
          : "from-gray-200/50 via-gray-300/30 to-gray-200/50 dark:from-gray-700/30 dark:via-gray-600/20 dark:to-gray-700/30"
      )} />

      {/* Main button */}
      <Button
        variant="ghost"
        className={cn(
          "relative w-full justify-start text-left p-6 transition-all duration-500",
          "rounded-xl border backdrop-blur-sm",
          "transform transition-transform duration-300",
          isClicked && "scale-[0.98]",
          isHovered && !isReading && "translate-y-[-2px]",
          isLocked() && "cursor-not-allowed opacity-80",
          isReading 
            ? "bg-gradient-to-br from-blue-600/10 via-blue-600/5 to-blue-600/10 hover:from-blue-600/15 hover:via-blue-600/10 hover:to-blue-600/15 border-blue-200/50 dark:border-blue-900/30" 
            : "bg-white/60 hover:bg-white/80 border-white/60 hover:border-gray-300/50 dark:bg-gray-900/40 dark:border-gray-800/40 dark:hover:bg-gray-900/60 dark:hover:border-gray-700/50"
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={isLocked()}
      >
        {/* Reading progress indicator */}
        {isReading && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-500 via-blue-400 to-blue-500 rounded-l-xl" />
        )}

        {/* New chapter glow */}
        {isNewChapter() && !isReading && (
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_2px_rgba(34,197,94,0.3)]" />
        )}

        {/* Content container */}
        <div className="relative flex items-start w-full z-10 space-x-5">
          {/* Icon container dengan glow effect */}
          <div className={cn(
            "relative flex-shrink-0 p-3 rounded-xl transition-all duration-500",
            "group-hover:scale-105 group-hover:shadow-lg",
            "border border-white/80 dark:border-gray-800/80",
            "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)]",
            isReading 
              ? "bg-gradient-to-br from-blue-100/40 to-blue-50/40 backdrop-blur-sm" 
              : "bg-gradient-to-br from-white to-gray-50 text-blue-600 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.04)] dark:from-gray-800 dark:to-gray-900 dark:text-blue-400"
          )}>
            {isLocked() ? (
              <Lock className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            
            {/* Chapter number badge */}
            {chapter.title && chapter.title.match(/\d+/)?.[0] && (
              <div className={cn(
                "absolute -top-2 -right-2 h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center",
                "border-2 border-white dark:border-gray-900",
                "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)]",
                "bg-gradient-to-br",
                isReading 
                  ? "from-white to-gray-100 text-blue-600" 
                  : isLocked()
                    ? "from-gray-200 to-gray-300 text-gray-600 dark:from-gray-700 dark:to-gray-800 dark:text-gray-400"
                    : "from-blue-600 to-blue-500 text-white"
              )}>
                {chapter.title.match(/\d+/)?.[0]}
              </div>
            )}
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title section */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={cn(
                      "font-semibold text-base leading-snug truncate",
                      isReading ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"
                    )}>
                      {formatChapterTitle(chapter.title)}
                    </h3>
                    
                    {/* Status badges */}
                    <div className="flex items-center gap-1.5">
                      {isNewChapter() && (
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-semibold rounded-full",
                          "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
                          "shadow-[0_1px_4px_-1px_rgba(34,197,94,0.4)]",
                          "animate-pulse-slow"
                        )}>
                          NEW
                        </span>
                      )}
                      
                      {isLocked() && (
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] font-semibold rounded-full",
                          "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100",
                          "shadow-[0_1px_4px_-1px_rgba(75,85,99,0.3)]"
                        )}>
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Preview text */}
                  {chapter.preview && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {chapter.preview}
                    </p>
                  )}
                </div>
                
                {/* Action arrow */}
                <ArrowRight className={cn(
                  "h-5 w-5 transition-all duration-300 flex-shrink-0 mt-1",
                  isReading ? "text-blue-500" : "text-gray-400 dark:text-gray-500",
                  isHovered && "translate-x-1 text-blue-500 dark:text-blue-400",
                  isLocked() && "text-gray-300 dark:text-gray-600"
                )} />
              </div>
            </div>
            
            {/* Metadata section */}
            {chapter.releaseDate && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    "p-1.5 rounded-lg",
                    "bg-white/80 dark:bg-gray-800/80",
                    "shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]"
                  )}>
                    <Calendar className={cn(
                      "h-3.5 w-3.5",
                      isReading ? "text-blue-500" : "text-gray-500 dark:text-gray-400"
                    )} />
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    isReading ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                  )}>
                    {formatDate(chapter.releaseDate)}
                  </span>
                </div>
                
                {/* Time ago indicator */}
                {(() => {
                  const releaseDate = new Date(chapter.releaseDate);
                  const now = new Date();
                  const diffDays = Math.floor((now - releaseDate) / (1000 * 60 * 60 * 24));
                  
                  if (!isNaN(diffDays)) {
                    let text = '';
                    if (diffDays === 0) text = 'Hari ini';
                    else if (diffDays === 1) text = 'Kemarin';
                    else if (diffDays < 7) text = `${diffDays} hari lalu`;
                    else if (diffDays < 30) text = `${Math.floor(diffDays/7)} minggu lalu`;
                    else if (diffDays < 365) text = `${Math.floor(diffDays/30)} bulan lalu`;
                    else text = `${Math.floor(diffDays/365)} tahun lalu`;
                    
                    return (
                      <span className={cn(
                        "px-3 py-1 text-xs font-medium rounded-full",
                        "bg-gradient-to-r from-gray-100/80 to-gray-200/60 dark:from-gray-800/60 dark:to-gray-700/60",
                        "border border-gray-200/50 dark:border-gray-700/50",
                        "shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]",
                        isReading && "from-blue-50/80 to-blue-100/60 dark:from-blue-900/40 dark:to-blue-800/40 border-blue-200/50"
                      )}>
                        {text}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>
        </div>
        
        {/* Hover glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 pointer-events-none",
          "bg-gradient-to-r from-transparent via-blue-500/5 to-transparent",
          isHovered && "opacity-100"
        )} />
        
        {/* Click ripple effect */}
        {isClicked && (
          <div className={cn(
            "absolute inset-0 rounded-xl animate-ripple opacity-20",
            isReading ? "bg-blue-500" : "bg-blue-400"
          )} />
        )}
      </Button>
      
      {/* Subtle background glow */}
      <div className="absolute -inset-3 -z-10 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:via-blue-50/10 group-hover:to-blue-100/5 dark:group-hover:via-blue-900/5 dark:group-hover:to-blue-900/10" />
    </div>
  );
}

// Tambahkan animasi ripple di CSS global atau di utils
// @keyframes ripple {
//   0% {
//     transform: scale(0);
//     opacity: 0.3;
//   }
//   100% {
//     transform: scale(4);
//     opacity: 0;
//   }
// }
// .animate-ripple {
//   animation: ripple 600ms linear;
// }
// 
// @keyframes pulse-slow {
//   0%, 100% {
//     opacity: 1;
//   }
//   50% {
//     opacity: 0.7;
//   }
// }
// .animate-pulse-slow {
//   animation: pulse-slow 2s ease-in-out infinite;
// }
