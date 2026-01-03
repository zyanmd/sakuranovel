'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Star, Bookmark, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NovelCard({ novel, onClick, isSelected }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Debug: cek data novel yang diterima
  console.log('NovelCard data:', {
    title: novel?.title,
    cover: novel?.cover,
    type: novel?.type,
    status: novel?.status,
    rating: novel?.rating
  });

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden border bg-white dark:bg-gray-900",
        "hover:-translate-y-1 active:translate-y-0 h-full",
        isSelected 
          ? "ring-2 ring-blue-500 border-blue-500 shadow-md" 
          : "border-gray-300 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-600"
      )}
      onClick={() => onClick(novel)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Cover Image Section - Lebih jelas */}
        <div className="relative w-full sm:w-32 h-48 sm:h-48 flex-shrink-0">
          {!imageError && novel?.cover ? (
            <div className="relative w-full h-full">
              <img
                src={novel.cover}
                alt={novel.title || 'Novel cover'}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500 bg-gray-100 dark:bg-gray-800"
                onError={handleImageError}
                loading="lazy"
                onLoad={() => console.log('Image loaded:', novel.cover)}
                onErrorCapture={() => console.log('Image error:', novel.cover)}
              />
              {/* Fallback jika gambar transparan */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-gray-100/30 dark:from-gray-900/30 dark:to-gray-800/30" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4">
              <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-3" />
              <span className="text-sm text-gray-500 dark:text-gray-400 text-center">No Cover</span>
            </div>
          )}
          
          {/* Type Badge */}
          <Badge className={cn(
            "absolute top-2 left-2 transition-all duration-300",
            isHovered ? "bg-blue-600" : "bg-gray-800",
            "text-white text-xs font-semibold px-2 py-1"
          )}>
            {novel?.type || 'Novel'}
          </Badge>
          
          {/* Status Badge */}
          {novel?.status && (
            <Badge className={cn(
              "absolute top-2 right-2 transition-all duration-300",
              novel.status.toLowerCase().includes('ongoing') 
                ? "bg-green-600" 
                : "bg-blue-600",
              "text-white text-xs font-semibold px-2 py-1"
            )}>
              {novel.status}
            </Badge>
          )}
        </div>
        
        {/* Content Section */}
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className={cn(
            "font-bold text-lg line-clamp-2 mb-3",
            "text-gray-900 dark:text-gray-100",
            isHovered && "text-blue-600 dark:text-blue-400"
          )}>
            {novel?.title || 'Unknown Title'}
          </h3>
          
          {/* Stats Section */}
          <div className="space-y-3 mb-4 flex-1">
            {/* Rating */}
            {novel?.rating && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rating: {novel.rating}
                </span>
              </div>
            )}
            
            {/* Status (jika ada di data) */}
            {novel?.status && (
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Status: {novel.status}
                </span>
              </div>
            )}
            
            {/* Placeholder untuk informasi tambahan */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                Klik untuk detail lebih lanjut...
              </p>
            </div>
          </div>
          
          {/* Footer dengan Button */}
          <CardFooter className="p-0 mt-auto">
            <Button 
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className={cn(
                "w-full sm:w-auto ml-auto transition-all duration-300",
                "hover:scale-105 active:scale-95",
                isSelected 
                  ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600" 
                  : "text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-800 dark:hover:border-blue-700"
              )}
            >
              <span className="flex items-center gap-2">
                {isSelected ? 'Sedang Dipilih' : 'Lihat Detail'}
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  isHovered && "translate-x-1"
                )} />
              </span>
            </Button>
          </CardFooter>
        </CardContent>
      </div>
      
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 animate-pulse" />
      )}
    </Card>
  );
}