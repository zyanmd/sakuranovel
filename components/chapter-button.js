'use client';

import { Button } from '@/components/ui/button';
import { FileText, Calendar, ArrowRight, Clock, ExternalLink } from 'lucide-react';
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

  return (
    <div className="relative group">
      {/* Next.js style container dengan spacing dan shadow */}
      <div className={cn(
        "absolute inset-0 rounded-lg transition-all duration-300",
        "bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-900/30 dark:to-gray-800/30",
        "border border-gray-200/50 dark:border-gray-700/50",
        "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
        isHovered && !isReading && "shadow-[0_4px_12px_0_rgba(0,0,0,0.08)]",
        isReading && "shadow-[0_2px_8px_0_rgba(37,99,235,0.15)]"
      )} />
      
      {/* Main button dengan spacing */}
      <Button
        variant={isReading ? "default" : "outline"}
        className={cn(
          "relative w-full justify-start text-left p-5 transition-all duration-300",
          "rounded-lg border hover:shadow-sm",
          "transform transition-transform duration-300",
          isClicked && "scale-[0.98]",
          isHovered && !isReading && "translate-x-0.5",
          isReading 
            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm" 
            : "bg-white/80 hover:bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-900/80 dark:border-gray-700 dark:hover:border-blue-600 dark:hover:bg-gray-800"
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Progress indicator untuk chapter yang sedang dibaca - Next.js style */}
        {isReading && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-400 rounded-l-lg" />
        )}
        
        {/* Next.js style subtle glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none",
          isReading 
            ? "bg-gradient-to-r from-blue-500/5 via-blue-600/5 to-blue-500/5" 
            : "bg-gradient-to-r from-blue-500/0 via-blue-400/3 to-blue-500/0",
          isHovered && !isReading && "opacity-100",
          !isHovered && "opacity-0"
        )} />

        {/* Content container dengan spacing ala Next.js */}
        <div className="relative flex items-start w-full z-10 space-x-4">
          {/* Icon container dengan Next.js style card */}
          <div className={cn(
            "relative flex-shrink-0 p-2.5 rounded-md transition-all duration-300",
            "group-hover:scale-105 shadow-sm",
            "border border-gray-100 dark:border-gray-800",
            isReading 
              ? "bg-white/20 backdrop-blur-sm" 
              : "bg-gradient-to-br from-blue-50 to-gray-50 text-blue-600 dark:from-blue-900/30 dark:to-gray-900/30 dark:text-blue-400"
          )}>
            <FileText className="h-5 w-5" />
            
            {/* Chapter number indicator - Next.js badge style */}
            {chapter.title && chapter.title.match(/\d+/)?.[0] && (
              <div className={cn(
                "absolute -top-2 -right-2 h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center",
                "border border-white dark:border-gray-900",
                "shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]",
                isReading 
                  ? "bg-white text-blue-600" 
                  : "bg-blue-600 text-white dark:bg-blue-500"
              )}>
                {chapter.title.match(/\d+/)?.[0]}
              </div>
            )}
          </div>

          {/* Text content dengan spacing yang pas */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title section */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-semibold text-sm leading-tight truncate",
                    isReading ? "text-white" : "text-gray-900 dark:text-gray-100"
                  )}>
                    {formatChapterTitle(chapter.title)}
                  </h3>
                </div>
                
                {/* Action arrow dengan spacing */}
                <div className="flex items-center space-x-2">
                  {/* New badge untuk chapter terbaru - Next.js style */}
                  {chapter.releaseDate && (() => {
                    const releaseDate = new Date(chapter.releaseDate);
                    const now = new Date();
                    const diffDays = Math.floor((now - releaseDate) / (1000 * 60 * 60 * 24));
                    
                    if (diffDays <= 7) {
                      return (
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full",
                          "border border-green-200 dark:border-green-800",
                          "shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
                          isReading 
                            ? "bg-white/30 text-white border-white/40" 
                            : "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        )}>
                          NEW
                        </span>
                      );
                    }
                    return null;
                  })()}
                  
                  <ArrowRight className={cn(
                    "h-4 w-4 transition-transform duration-300 flex-shrink-0",
                    isReading ? "text-white/80" : "text-gray-400 dark:text-gray-500",
                    isHovered && "translate-x-1"
                  )} />
                </div>
              </div>
            </div>
            
            {/* Metadata section */}
            {chapter.releaseDate && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <Calendar className={cn(
                    "h-3.5 w-3.5 flex-shrink-0",
                    isReading ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                  )} />
                  <span className={cn(
                    "text-xs",
                    isReading ? "text-white/90" : "text-gray-600 dark:text-gray-400"
                  )}>
                    {formatDate(chapter.releaseDate)}
                  </span>
                </div>
                
                {/* Separator */}
                <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                
                {/* Days ago indicator - Next.js pill style */}
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
                        "px-2 py-0.5 text-xs font-medium rounded-full",
                        "border",
                        isReading 
                          ? "bg-white/10 text-white/90 border-white/20" 
                          : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                      )}>
                        {text}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
            
            {/* Preview text dengan line clamp - Next.js typography */}
            {chapter.preview && (
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {chapter.preview}
              </p>
            )}
          </div>
        </div>
        
        {/* Click animation overlay - Next.js subtle effect */}
        {isClicked && (
          <div className={cn(
            "absolute inset-0 rounded-lg animate-ping opacity-10",
            isReading ? "bg-white" : "bg-blue-500"
          )} />
        )}
      </Button>
      
      {/* Next.js style outer spacing */}
      <div className="absolute -inset-2 -z-10 rounded-lg bg-gradient-to-br from-transparent via-transparent to-transparent transition-all duration-300 group-hover:from-gray-50/20 group-hover:via-gray-100/10 group-hover:to-gray-50/20 dark:group-hover:from-gray-800/20 dark:group-hover:via-gray-700/10 dark:group-hover:to-gray-800/20" />
    </div>
  );
}
