'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [isClicking, setIsClicking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClick = (e) => {
    if (query.trim()) {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 300);
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <Input
            type="text"
            placeholder="Cari novel... (contoh: Classroom of the Elite, Solo Leveling)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 group-hover:border-purple-300 rounded-xl"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
          <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <Button 
          type="submit" 
          onClick={handleClick}
          disabled={isLoading || !query.trim()}
          className={cn(
            "py-6 px-8 text-lg transition-all duration-300 rounded-xl",
            "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
            "hover:shadow-xl hover:shadow-purple-200",
            isClicking && "scale-95",
            (isLoading || !query.trim()) && "opacity-50 cursor-not-allowed hover:scale-100"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Mencari...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Cari Novel
            </>
          )}
        </Button>
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Cari berdasarkan judul, penulis, atau genre novel
      </p>
    </form>
  );
}