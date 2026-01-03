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
  Sparkles
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
  };

  const handleBackToChapters = () => {
    setChapterContent(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b dark:bg-gray-950/80 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  SakuraNovel
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Reader</p>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              {chapterContent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToChapters}
                  className="gap-1 h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Kembali</span>
                </Button>
              )}
              
              {selectedNovel && !chapterContent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToSearch}
                  className="gap-1 h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                >
                  <HomeIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Pencarian</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="pb-4">
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800 dark:text-red-300">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-gray-200 dark:border-gray-800" />
              <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-gray-900 dark:border-t-gray-100 animate-spin" />
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && !selectedNovel && novels.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Hasil Pencarian
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Untuk: "{query}"
                </p>
              </div>
              <Badge variant="outline" className="text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800">
                {novels.length} ditemukan
              </Badge>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {novels.map((novel, index) => (
                <div key={index} className="transform transition-transform duration-200 hover:-translate-y-1">
                  <NovelCard
                    novel={novel}
                    onClick={handleNovelSelect}
                    isSelected={selectedNovel?.url === novel.url}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Novel Detail View */}
        {!loading && novelDetail && !chapterContent && (
          <div className="space-y-8">
            {/* Back button and title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSearch}
                className="h-9 w-9 p-0 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white truncate">
                  {novelDetail.title}
                </h1>
                {novelDetail.alternativeTitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {novelDetail.alternativeTitle}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                {novelDetail.type}
              </Badge>
            </div>

            {/* Main content grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left column - Cover and basic info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Cover image */}
                <Card className="overflow-hidden border-gray-200 dark:border-gray-800">
                  <div className="aspect-[2/3] relative">
                    <img
                      src={novelDetail.cover || '/placeholder-novel.jpg'}
                      alt={novelDetail.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.src = '/placeholder-novel.jpg';
                      }}
                    />
                  </div>
                </Card>

                {/* Quick info */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Rating</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{novelDetail.rating}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Status</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{novelDetail.status}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Author</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{novelDetail.author}</span>
                      </div>
                    </div>
                    
                    {/* Genres */}
                    {novelDetail.genres && novelDetail.genres.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Tag className="h-3 w-3" />
                          Genres
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {novelDetail.genres.slice(0, 3).map((genre, index) => (
                            <Badge 
                              key={index} 
                              variant="outline"
                              className="text-xs bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                            >
                              {genre}
                            </Badge>
                          ))}
                          {novelDetail.genres.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{novelDetail.genres.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Synopsis and chapters */}
              <div className="lg:col-span-2 space-y-6">
                {/* Synopsis */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sinopsis</h2>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {novelDetail.synopsis ? (
                        <div className="text-gray-600 dark:text-gray-400 space-y-4">
                          {novelDetail.synopsis.split('\n').map((paragraph, index) => (
                            paragraph.trim() && (
                              <p key={index} className="leading-relaxed">
                                {paragraph}
                              </p>
                            )
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-500 italic">Sinopsis tidak tersedia.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Chapters list */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Daftar Chapter</h2>
                      <Badge variant="outline" className="text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800">
                        {novelDetail.chapters?.length || 0} Chapter
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                      {novelDetail.chapters?.map((chapter, index) => (
                        <ChapterButton
                          key={index}
                          chapter={chapter}
                          onClick={handleChapterSelect}
                          isReading={false}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Chapter Reading View */}
        {!loading && chapterContent && (
          <div className="space-y-8">
            {/* Chapter header */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToChapters}
                  className="h-9 w-9 p-0 rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white truncate">
                    {selectedNovel?.title}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {chapterContent.chapterInfo}
                  </p>
                </div>
              </div>
              
              {/* Chapter navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleNavigate(chapterContent.navigation.previousChapter)}
                  disabled={!chapterContent.navigation.previousChapter || !isValidUrl(chapterContent.navigation.previousChapter)}
                  className={cn(
                    "gap-2 border-gray-200 dark:border-gray-800",
                    chapterContent.navigation.previousChapter && isValidUrl(chapterContent.navigation.previousChapter)
                      ? "hover:border-gray-300 dark:hover:border-gray-700"
                      : "opacity-50"
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleNavigate(chapterContent.navigation.nextChapter)}
                  disabled={!chapterContent.navigation.nextChapter || !isValidUrl(chapterContent.navigation.nextChapter)}
                  className={cn(
                    "gap-2 border-gray-200 dark:border-gray-800",
                    chapterContent.navigation.nextChapter && isValidUrl(chapterContent.navigation.nextChapter)
                      ? "hover:border-gray-300 dark:hover:border-gray-700"
                      : "opacity-50"
                  )}
                >
                  Selanjutnya
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chapter content */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="prose prose-gray max-w-none dark:prose-invert">
                  {chapterContent.images && chapterContent.images.length > 0 ? (
                    <div className="space-y-6">
                      {chapterContent.images.map((img, index) => (
                        <div key={index} className="flex justify-center">
                          <div className="relative max-w-3xl">
                            <img
                              src={img}
                              alt={`Page ${index + 1}`}
                              className="rounded-lg shadow-lg"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                              }}
                            />
                            <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs">
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
                          <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">Konten chapter tidak tersedia.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Bottom navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => handleNavigate(chapterContent.navigation.previousChapter)}
                disabled={!chapterContent.navigation.previousChapter || !isValidUrl(chapterContent.navigation.previousChapter)}
                className={cn(
                  "gap-2 border-gray-200 dark:border-gray-800",
                  chapterContent.navigation.previousChapter && isValidUrl(chapterContent.navigation.previousChapter)
                    ? "hover:border-gray-300 dark:hover:border-gray-700"
                    : "opacity-50"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                Chapter Sebelumnya
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleBackToChapters}
                  className="border-gray-200 dark:border-gray-800"
                >
                  Daftar Chapter
                </Button>
                
                <Button
                  variant="default"
                  onClick={() => handleNavigate(chapterContent.navigation.tableOfContents)}
                  disabled={!novelDetail}
                  className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Daftar Isi
                </Button>
              </div>
              
              <Button
                variant="outline"
                onClick={() => handleNavigate(chapterContent.navigation.nextChapter)}
                disabled={!chapterContent.navigation.nextChapter || !isValidUrl(chapterContent.navigation.nextChapter)}
                className={cn(
                  "gap-2 border-gray-200 dark:border-gray-800",
                  chapterContent.navigation.nextChapter && isValidUrl(chapterContent.navigation.nextChapter)
                    ? "hover:border-gray-300 dark:hover:border-gray-700"
                    : "opacity-50"
                )}
              >
                Chapter Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && novels.length === 0 && query === '' && !selectedNovel && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 blur-3xl opacity-50" />
              <div className="relative">
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-black flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Selamat datang di SakuraNovel
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Cari novel favoritmu dengan mengetikkan judul atau kata kunci di kolom pencarian di atas
              </p>
              
              <div className="grid gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Cari novel</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Masukkan judul di kolom pencarian</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Pilih novel</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Klik card novel untuk melihat detail</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Baca chapter</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pilih chapter dan mulai membaca</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && novels.length === 0 && query !== '' && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-6">
              <AlertCircle className="h-10 w-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white mb-2">
              Tidak ada hasil ditemukan
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
              Tidak ada novel yang cocok dengan pencarian: "{query}"
            </p>
            <Button
              onClick={() => handleSearch(query)}
              className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Coba lagi
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-black flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">SakuraNovel Reader</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Baca novel gratis</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} • Dibuat dengan Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
