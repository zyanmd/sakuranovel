'use client';

import { useState } from 'react';
import SearchBar from '@/components/search-bar';
import NovelCard from '@/components/novel-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Star, 
  Calendar, 
  User, 
  Globe, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  AlertCircle,
  Home as HomeIcon,
  ArrowLeft,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ChapterButton from '@/components/chapter-button';

// Utility function untuk validasi URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export default function NovelReaderPage() {
  const [query, setQuery] = useState('');
  const [novels, setNovels] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [novelDetail, setNovelDetail] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSynopsis, setShowSynopsis] = useState(false);

  const handleSearch = async (searchQuery) => {
    setError('');
    setLoading(true);
    setSelectedNovel(null);
    setNovelDetail(null);
    setChapterContent(null);
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setNovels(data);
      setQuery(searchQuery);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNovelSelect = async (novel) => {
    setError('');
    setLoading(true);
    setSelectedNovel(novel);
    setChapterContent(null);
    
    try {
      const res = await fetch(`/api/detail?url=${encodeURIComponent(novel.url)}`);
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setNovelDetail(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterSelect = async (chapter) => {
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`/api/chapter?url=${encodeURIComponent(chapter.url)}`);
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setChapterContent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (url) => {
    if (url && isValidUrl(url) && chapterContent) {
      try {
        handleChapterSelect({ url });
      } catch (err) {
        setError('Gagal navigasi ke chapter: ' + err.message);
      }
    }
  };

  const handleBackToSearch = () => {
    setSelectedNovel(null);
    setNovelDetail(null);
    setChapterContent(null);
    setShowMobileMenu(false);
  };

  const handleBackToChapters = () => {
    setChapterContent(null);
    setShowMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Mobile-Friendly */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-black backdrop-blur-md border-b border-gray-800">
        <div className="px-4 py-3">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg">
                <BookOpen className="h-5 w-5 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">SakuraNovel</h1>
                <p className="text-xs text-gray-300">Reader</p>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2">
              {(selectedNovel || chapterContent) && (
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                >
                  {showMobileMenu ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mb-2">
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>
          
          {/* Mobile Navigation Menu */}
          {showMobileMenu && (
            <div className="animate-in slide-in-from-top-2 duration-200 mb-3">
              <div className="flex flex-col gap-2 p-3 rounded-lg bg-gray-900 border border-gray-800">
                {chapterContent ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={handleBackToChapters}
                      className="w-full justify-start text-sm"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Kembali ke Daftar Chapter
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleBackToSearch}
                      className="w-full justify-start text-sm"
                    >
                      <HomeIcon className="h-4 w-4 mr-2" />
                      Kembali ke Pencarian
                    </Button>
                  </>
                ) : selectedNovel ? (
                  <Button
                    variant="ghost"
                    onClick={handleBackToSearch}
                    className="w-full justify-start text-sm"
                  >
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Kembali ke Pencarian
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Error Message */}
        {error && (
          <div className="mb-4">
            <Alert variant="destructive" className="border-red-900 bg-red-950/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="h-14 w-14 rounded-full border-4 border-gray-800" />
              <div className="absolute inset-0 h-14 w-14 rounded-full border-4 border-transparent border-t-white animate-spin" />
            </div>
            <p className="mt-4 text-gray-400">Memuat...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && !selectedNovel && novels.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Hasil Pencarian</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Untuk: "{query}"
                </p>
              </div>
              <Badge variant="outline" className="text-gray-400 border-gray-700">
                {novels.length} ditemukan
              </Badge>
            </div>
            
            <div className="grid gap-3">
              {novels.map((novel, index) => (
                <div key={index} className="active:scale-[0.98] transition-transform">
                  <NovelCard
                    novel={novel}
                    onClick={handleNovelSelect}
                    isSelected={selectedNovel?.url === novel.url}
                    compact={true}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Novel Detail View - Mobile Optimized */}
        {!loading && novelDetail && !chapterContent && (
          <div className="space-y-6">
            {/* Novel Header */}
            <div className="space-y-4">
              {/* Cover Image with Back Button */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToSearch}
                  className="absolute top-2 left-2 z-10 h-8 w-8 bg-black/50 backdrop-blur-sm hover:bg-black/70"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="aspect-[3/4] w-full max-w-[200px] mx-auto rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={novelDetail.cover || '/placeholder-novel.jpg'}
                    alt={novelDetail.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = '/placeholder-novel.jpg';
                    }}
                  />
                </div>
              </div>

              {/* Title and Info */}
              <div className="text-center space-y-2">
                <h1 className="text-xl font-bold leading-tight px-2">
                  {novelDetail.title}
                </h1>
                {novelDetail.alternativeTitle && (
                  <p className="text-sm text-gray-400 px-2">
                    {novelDetail.alternativeTitle}
                  </p>
                )}
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge className="bg-gray-800">
                    {novelDetail.type}
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    {novelDetail.rating}
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    {novelDetail.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Info Grid */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="h-4 w-4" />
                      <span>Author</span>
                    </div>
                    <p className="font-medium">{novelDetail.author}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Status</span>
                    </div>
                    <p className="font-medium">{novelDetail.status}</p>
                  </div>
                </div>

                {/* Genres */}
                {novelDetail.genres && novelDetail.genres.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {novelDetail.genres.slice(0, 4).map((genre, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className="text-xs bg-gray-800 text-gray-300 border-gray-700"
                        >
                          {genre}
                        </Badge>
                      ))}
                      {novelDetail.genres.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{novelDetail.genres.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Synopsis - Collapsible on Mobile */}
            <Card className="bg-gray-900 border-gray-800">
              <button
                onClick={() => setShowSynopsis(!showSynopsis)}
                className="w-full p-4 flex items-center justify-between"
              >
                <h2 className="text-lg font-semibold">Sinopsis</h2>
                {showSynopsis ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {showSynopsis && (
                <CardContent className="pt-0 px-4 pb-4 border-t border-gray-800">
                  {novelDetail.synopsis ? (
                    <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
                      {novelDetail.synopsis.split('\n').map((paragraph, index) => (
                        paragraph.trim() && (
                          <p key={index}>
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Sinopsis tidak tersedia.</p>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Chapters List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Daftar Chapter</h2>
                <Badge variant="outline" className="text-gray-400 border-gray-700">
                  {novelDetail.chapters?.length || 0} Chapter
                </Badge>
              </div>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {novelDetail.chapters?.map((chapter, index) => (
                  <ChapterButton
                    key={index}
                    chapter={chapter}
                    onClick={handleChapterSelect}
                    isReading={false}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chapter Reading View - Mobile Optimized */}
        {!loading && chapterContent && (
          <div className="space-y-6">
            {/* Chapter Header */}
            <div className="space-y-4">
              {/* Back Button and Title */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToChapters}
                  className="h-10 w-10 shrink-0 bg-gray-900 hover:bg-gray-800"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-semibold truncate">
                    {selectedNovel?.title}
                  </h1>
                  <p className="text-sm text-gray-400 truncate">
                    {chapterContent.chapterInfo}
                  </p>
                </div>
              </div>

              {/* Chapter Navigation - Sticky Bottom */}
              <div className="sticky bottom-4 z-40">
                <div className="flex items-center justify-center gap-3 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate(chapterContent.navigation.previousChapter)}
                    disabled={!chapterContent.navigation.previousChapter || !isValidUrl(chapterContent.navigation.previousChapter)}
                    className={cn(
                      "flex-1 max-w-[140px] border-gray-700 text-gray-300",
                      (!chapterContent.navigation.previousChapter || !isValidUrl(chapterContent.navigation.previousChapter)) && "opacity-50"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                  </Button>
                  
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleBackToChapters}
                    className="flex-1 max-w-[140px] bg-white text-black hover:bg-gray-200"
                  >
                    Daftar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNavigate(chapterContent.navigation.nextChapter)}
                    disabled={!chapterContent.navigation.nextChapter || !isValidUrl(chapterContent.navigation.nextChapter)}
                    className={cn(
                      "flex-1 max-w-[140px] border-gray-700 text-gray-300",
                      (!chapterContent.navigation.nextChapter || !isValidUrl(chapterContent.navigation.nextChapter)) && "opacity-50"
                    )}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Chapter Content */}
            <div className="space-y-6 pb-20">
              {chapterContent.images && chapterContent.images.length > 0 ? (
                <div className="space-y-4">
                  {chapterContent.images.map((img, index) => (
                    <div key={index} className="flex justify-center">
                      <div className="relative w-full">
                        <img
                          src={img}
                          alt={`Page ${index + 1}`}
                          className="w-full h-auto rounded-lg"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {chapterContent.content ? (
                    chapterContent.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-300 leading-relaxed text-base">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">Konten chapter tidak tersedia.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Navigation - Fixed */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent pb-4 pt-8 px-4">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleNavigate(chapterContent.navigation.tableOfContents)}
                  disabled={!novelDetail}
                  className="flex-1 bg-gray-800 border-gray-700 hover:bg-gray-700"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Daftar Isi
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => handleNavigate(chapterContent.navigation.nextChapter)}
                  disabled={!chapterContent.navigation.nextChapter || !isValidUrl(chapterContent.navigation.nextChapter)}
                  className={cn(
                    "flex-1 bg-white text-black hover:bg-gray-200",
                    (!chapterContent.navigation.nextChapter || !isValidUrl(chapterContent.navigation.nextChapter)) && "opacity-50"
                  )}
                >
                  Next Chapter
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State - Mobile Optimized */}
        {!loading && !error && novels.length === 0 && query === '' && !selectedNovel && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="relative mb-6">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-lg">
                <BookOpen className="h-12 w-12 text-gray-600" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-md">
                <Sparkles className="h-4 w-4 text-black" />
              </div>
            </div>
            
            <div className="max-w-sm mx-auto space-y-4 px-2">
              <h2 className="text-xl font-bold">
                Selamat datang di SakuraNovel
              </h2>
              <p className="text-gray-400 text-sm">
                Cari novel favoritmu dengan mengetikkan judul atau kata kunci di kolom pencarian di atas
              </p>
              
              <div className="grid gap-3 pt-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900 border border-gray-800">
                  <div className="h-7 w-7 rounded-full bg-gray-800 flex items-center justify-center text-sm font-medium shrink-0">
                    1
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Cari novel</p>
                    <p className="text-xs text-gray-400">Masukkan judul di kolom pencarian</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900 border border-gray-800">
                  <div className="h-7 w-7 rounded-full bg-gray-800 flex items-center justify-center text-sm font-medium shrink-0">
                    2
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Pilih novel</p>
                    <p className="text-xs text-gray-400">Klik card novel untuk melihat detail</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-900 border border-gray-800">
                  <div className="h-7 w-7 rounded-full bg-gray-800 flex items-center justify-center text-sm font-medium shrink-0">
                    3
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">Baca chapter</p>
                    <p className="text-xs text-gray-400">Pilih chapter dan mulai membaca</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results State - Mobile Optimized */}
        {!loading && !error && novels.length === 0 && query !== '' && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Tidak ada hasil ditemukan
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Tidak ada novel yang cocok dengan pencarian: "{query}"
            </p>
            <Button
              onClick={() => handleSearch(query)}
              className="w-full max-w-[200px] bg-white text-black hover:bg-gray-200"
            >
              Coba lagi
            </Button>
          </div>
        )}
      </main>

      {/* Footer - Mobile Optimized */}
      <footer className="mt-8 border-t border-gray-800 px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-white flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-black" />
            </div>
            <div>
              <p className="text-sm font-medium">SakuraNovel Reader</p>
              <p className="text-xs text-gray-400">Baca novel gratis</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} • Dibuat dengan Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
