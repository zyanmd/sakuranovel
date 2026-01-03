'use client';

import { Button } from '@/components/ui/button';
import { FileText, Calendar, ArrowRight, Clock, ExternalLink, Bookmark } from 'lucide-react';
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

  // Determine if chapter is new (within 3 days)
  const isNewChapter = chapter.releaseDate && (() => {
    const releaseDate = new Date(chapter.releaseDate);
    const now = new Date();
    const diffDays = Math.floor((now - releaseDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  })();

  return (
    <div className="relative group">
      {/* Glass morphism effect dengan shadow depth */}
      <div className={cn(
        "absolute inset-0 rounded-xl transition-all duration-400",
        "bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-900/70 dark:to-gray-800/60",
        "border border-white/40 dark:border-gray-700/40",
        "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2)]",
        "backdrop-blur-[4px]",
        isHovered && !isReading && "shadow-[0_12px_48px_-12px_rgba(37,99,235,0.12)] dark:shadow-[0_12px_48px_-12px_rgba(37,99,235,0.25)]",
        isReading && "shadow-[0_8px_40px_-8px_rgba(37,99,235,0.25)]"
      )} />
      
      {/* Main button dengan glass morphism effect */}
      <Button
        variant={isReading ? "default" : "outline"}
        className={cn(
          "relative w-full justify-start text-left p-6 transition-all duration-400",
          "rounded-xl border-2 hover:shadow-lg",
          "transform transition-all duration-300",
          "bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-800/70",
          "backdrop-blur-[8px]",
          isClicked && "scale-[0.98]",
          isHovered && !isReading && "translate-x-1 -translate-y-0.5",
          isReading 
            ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white border-blue-500/40 shadow-lg" 
            : "border-white/60 hover:border-blue-300/80 dark:border-gray-700/60 dark:hover:border-blue-500/60"
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient progress indicator untuk chapter yang sedang dibaca */}
        {isReading && (
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-l-xl shadow-lg" />
        )}
        
        {/* Glass morphism glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-xl transition-all duration-500 pointer-events-none",
          isReading 
            ? "bg-gradient-to-r from-blue-400/10 via-blue-500/15 to-blue-600/10" 
            : "bg-gradient-to-r from-blue-400/0 via-blue-300/5 to-blue-400/0",
          isHovered && !isReading && "opacity-100 from-blue-300/10 via-blue-400/8 to-blue-300/10",
          !isHovered && "opacity-0"
        )} />

        {/* Content container dengan refined spacing */}
        <div className="relative flex items-start w-full z-10 space-x-5">
          {/* Icon container dengan glass morphism */}
          <div className={cn(
            "relative flex-shrink-0 p-3.5 rounded-xl transition-all duration-300 group-hover:scale-110",
            "bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-700/70",
            "border-2 border-white/50 dark:border-gray-600/40",
            "shadow-lg backdrop-blur-sm",
            "group-hover:shadow-xl",
            isReading 
              ? "bg-white/20 border-white/30" 
              : "text-blue-600 dark:text-blue-400"
          )}>
            <FileText className="h-6 w-6" />
            
            {/* Chapter number badge dengan 3D effect */}
            {chapter.title && chapter.title.match(/\d+/)?.[0] && (
              <div className={cn(
                "absolute -top-2.5 -right-2.5 h-7 w-7 rounded-full text-xs font-bold flex items-center justify-center",
                "bg-gradient-to-br shadow-lg",
                "border-2 border-white dark:border-gray-800",
                isReading 
                  ? "bg-gradient-to-br from-white to-gray-100 text-blue-600 shadow-blue-200/50" 
                  : "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/50 dark:from-blue-600 dark:to-blue-700"
              )}>
                {chapter.title.match(/\d+/)?.[0]}
              </div>
            )}
          </div>

          {/* Text content dengan improved typography */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title section dengan badge */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={cn(
                      "font-bold text-lg leading-snug truncate",
                      isReading ? "text-white" : "text-gray-900 dark:text-gray-100"
                    )}>
                      {formatChapterTitle(chapter.title)}
                    </h3>
                    
                    {/* New badge dengan animation */}
                    {isNewChapter && (
                      <span className={cn(
                        "px-3 py-1 text-xs font-semibold rounded-full animate-pulse",
                        "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
                        "shadow-lg shadow-green-400/20",
                        "transform transition-transform duration-300 group-hover:scale-110"
                      )}>
                        NEW
                      </span>
                    )}
                  </div>
                  
                  {/* Preview text dengan gradient mask */}
                  {chapter.preview && (
                    <div className="relative">
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                        {chapter.preview}
                      </p>
                      {/* Gradient fade effect */}
                      <div className="absolute bottom-0 right-0 w-8 h-full bg-gradient-to-l from-transparent to-current opacity-20 dark:opacity-10" />
                    </div>
                  )}
                </div>
                
                {/* Action arrow dengan smooth animation */}
                <div className="flex items-center space-x-3 pt-1">
                  <div className={cn(
                    "p-2.5 rounded-lg transition-all duration-300",
                    "bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-700/60",
                    "border border-white/50 dark:border-gray-600/40",
                    "shadow-md group-hover:shadow-lg",
                    isReading 
                      ? "bg-white/30 border-white/40" 
                      : "text-gray-400 dark:text-gray-500"
                  )}>
                    <ArrowRight className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isHovered && "translate-x-1.5"
                    )} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Metadata section dengan glass morphism cards */}
            <div className="flex items-center space-x-4">
              {/* Date card */}
              {chapter.releaseDate && (
                <div className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg",
                  "bg-gradient-to-br from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-700/40",
                  "border border-white/50 dark:border-gray-600/40",
                  "shadow-sm backdrop-blur-sm"
                )}>
                  <div className="flex items-center space-x-2">
                    <Calendar className={cn(
                      "h-4 w-4 flex-shrink-0",
                      isReading ? "text-white/90" : "text-blue-500 dark:text-blue-400"
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      isReading ? "text-white/90" : "text-gray-700 dark:text-gray-300"
                    )}>
                      {formatDate(chapter.releaseDate)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Time ago indicator dengan gradient */}
              {chapter.releaseDate && (() => {
                const releaseDate = new Date(chapter.releaseDate);
                const now = new Date();
                const diffDays = Math.floor((now - releaseDate) / (1000 * 60 * 60 * 24));
                
                if (!isNaN(diffDays)) {
                  let text = '';
                  let gradient = '';
                  
                  if (diffDays === 0) {
                    text = 'Hari ini';
                    gradient = 'from-green-400 to-emerald-500';
                  } else if (diffDays === 1) {
                    text = 'Kemarin';
                    gradient = 'from-blue-400 to-blue-500';
                  } else if (diffDays < 7) {
                    text = `${diffDays} hari lalu`;
                    gradient = 'from-blue-300 to-blue-400';
                  } else if (diffDays < 30) {
                    text = `${Math.floor(diffDays/7)} minggu lalu`;
                    gradient = 'from-purple-400 to-purple-500';
                  } else if (diffDays < 365) {
                    text = `${Math.floor(diffDays/30)} bulan lalu`;
                    gradient = 'from-gray-400 to-gray-500';
                  } else {
                    text = `${Math.floor(diffDays/365)} tahun lalu`;
                    gradient = 'from-gray-500 to-gray-600';
                  }
                  
                  return (
                    <span className={cn(
                      "px-3 py-2 text-sm font-medium rounded-lg",
                      "bg-gradient-to-br shadow-sm",
                      "text-white",
                      gradient
                    )}>
                      {text}
                    </span>
                  );
                }
                return null;
              })()}
              
              {/* Bookmark indicator untuk chapter penting */}
              {isReading && (
                <div className="ml-auto flex items-center space-x-2">
                  <Bookmark className="h-4 w-4 text-white/80 animate-bounce" />
                  <span className="text-sm font-medium text-white/90">Sedang dibaca</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Click animation dengan ripple effect */}
        {isClicked && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className={cn(
              "absolute inset-0 animate-ripple opacity-20",
              isReading ? "bg-white" : "bg-blue-500"
            )} />
          </div>
        )}
      </Button>
      
      {/* Outer glow effect */}
      <div className="absolute -inset-3 -z-10 rounded-xl bg-gradient-to-br from-transparent via-transparent to-transparent transition-all duration-500 group-hover:from-blue-50/30 group-hover:via-blue-100/10 group-hover:to-blue-50/30 dark:group-hover:from-blue-900/20 dark:group-hover:via-blue-800/10 dark:group-hover:to-blue-900/20" />
    </div>
  );
}
