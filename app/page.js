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
  ArrowLeft
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm dark:bg-gray-900/95 dark:border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Sakura Novel Reader
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Baca novel favoritmu dengan nyaman</p>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex gap-2">
              {chapterContent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToChapters}
                  className="gap-1 border-gray-300 bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Daftar
                </Button>
              )}
              
              {selectedNovel && !chapterContent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToSearch}
                  className="gap-1 border-gray-300 bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
                >
                  <HomeIcon className="h-4 w-4" />
                  Kembali ke Pencarian
                </Button>
              )}
            </div>
          </div>
          
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6 animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex justify-center items-center py-20 animate-fade-in">
            <div className="text-center">
              <Loader2 className="h-14 w-14 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">Memuat data...</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!loading && !selectedNovel && novels.length > 0 && (
          <div className="mb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <span>Hasil Pencarian</span>
                <Badge variant="secondary" className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {novels.length} novel ditemukan
                </Badge>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Menampilkan hasil untuk: <span className="font-semibold text-blue-600 dark:text-blue-400">{query}</span>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {novels.map((novel, index) => (
                <NovelCard
                  key={index}
                  novel={novel}
                  onClick={handleNovelSelect}
                  isSelected={selectedNovel?.url === novel.url}
                />
              ))}
            </div>
          </div>
        )}

        {/* Novel Detail View */}
        {!loading && novelDetail && !chapterContent && (
          <div className="animate-slide-up">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleBackToSearch}
                className="mb-4 gap-1 border-gray-300 bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-900 transition-all duration-300 hover:scale-105 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Hasil Pencarian
              </Button>
              
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{novelDetail.title}</h2>
                <Badge className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                  {novelDetail.type}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Novel Info */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow dark:border-gray-800 dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="relative aspect-novel-cover w-full max-w-xs mx-auto mb-6 rounded-lg overflow-hidden shadow-md">
                      <img
                        src={novelDetail.cover || '/placeholder-novel.jpg'}
                        alt={novelDetail.title}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/placeholder-novel.jpg';
                        }}
                      />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{novelDetail.title}</h2>
                    {novelDetail.alternativeTitle && (
                      <p className="text-gray-600 dark:text-gray-400 italic mb-4">{novelDetail.alternativeTitle}</p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                        <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                        <span className="font-medium dark:text-yellow-300">Rating: {novelDetail.rating}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="dark:text-blue-300">Status: {novelDetail.status}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                        <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="dark:text-green-300">Author: {novelDetail.author}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-900/30">
                        <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <span className="dark:text-purple-300">Country: {novelDetail.country}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                        <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="dark:text-red-300">Published: {novelDetail.published}</span>
                      </div>
                    </div>
                    
                    {/* Genres */}
                    {novelDetail.genres && novelDetail.genres.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold mb-2 flex items-center gap-2 dark:text-white">
                          <Tag className="h-4 w-4" />
                          Genres
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {novelDetail.genres.map((genre, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                            >
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Chapters List */}
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow dark:border-gray-800 dark:bg-gray-900">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg dark:text-white">Daftar Chapter</h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {novelDetail.chapters?.length || 0} Chapter
                      </Badge>
                    </div>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
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

              {/* Right Column - Synopsis */}
              <div className="lg:col-span-2">
                <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow h-full dark:border-gray-800 dark:bg-gray-900">
                  <CardContent className="p-8">
                    <div className="mb-8">
                      <h3 className="font-bold text-2xl mb-4 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Sinopsis</h3>
                      <div className="prose max-w-none dark:prose-invert">
                        {novelDetail.synopsis ? (
                          novelDetail.synopsis.split('\n').map((paragraph, index) => (
                            <p 
                              key={index} 
                              className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                            >
                              {paragraph}
                            </p>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 italic">Sinopsis tidak tersedia.</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 dark:border-blue-800/30 rounded-xl">
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">{novelDetail.bookmarks || 0}</div>
                        <div className="text-sm text-blue-700 dark:text-blue-400">Bookmark</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-100 dark:from-green-900/30 dark:to-green-800/30 dark:border-green-800/30 rounded-xl">
                        <div className="text-2xl font-bold text-green-900 dark:text-green-300">{novelDetail.chapters?.length || 0}</div>
                        <div className="text-sm text-green-700 dark:text-green-400">Chapter</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:border-yellow-800/30 rounded-xl">
                        <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-300">{novelDetail.rating || 'N/A'}</div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-400">Rating</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 dark:border-purple-800/30 rounded-xl">
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">{novelDetail.status}</div>
                        <div className="text-sm text-purple-700 dark:text-purple-400">Status</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Chapter Reading View */}
        {!loading && chapterContent && (
          <div className="animate-slide-up">
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleBackToChapters}
                  className="gap-1 border-gray-300 bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-900 transition-all duration-300 hover:scale-105 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Daftar Chapter
                </Button>
                
                
              </div>
              
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h2 className="font-bold text-2xl md:text-3xl text-blue-900 dark:text-blue-300 mb-2">
                      {chapterContent.chapterInfo}
                    </h2>
                    <p className="text-blue-700 dark:text-blue-400">
                      {selectedNovel?.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chapter Navigation */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleNavigate(chapterContent.navigation.previousChapter)}
                disabled={!chapterContent.navigation.previousChapter || !isValidUrl(chapterContent.navigation.previousChapter)}
                className={cn(
                  "gap-2 transition-all duration-300 hover:scale-105 active:scale-95",
                  "border-gray-300 bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-900",
                  "dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200",
                  chapterContent.navigation.previousChapter && isValidUrl(chapterContent.navigation.previousChapter)
                  ? "hover:border-blue-400 dark:hover:border-blue-600"
                  : "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="h-5 w-5" />
                Chapter Sebelumnya
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleNavigate(chapterContent.navigation.nextChapter)}
                disabled={!chapterContent.navigation.nextChapter || !isValidUrl(chapterContent.navigation.nextChapter)}
                className={cn(
                  "gap-2 transition-all duration-300 hover:scale-105 active:scale-95",
                  "border-gray-300 bg-white hover:bg-gray-50 text-gray-800 hover:text-gray-900",
                  "dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200",
                  chapterContent.navigation.nextChapter && isValidUrl(chapterContent.navigation.nextChapter)
                  ? "hover:border-blue-400 dark:hover:border-blue-600"
                  : "opacity-50 cursor-not-allowed"
                )}
              >
                Chapter Selanjutnya
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Chapter Content */}
            <Card className="mb-8 shadow-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <CardContent className="p-6 md:p-8">
                <div className="prose max-w-none dark:prose-invert">
                  {chapterContent.images && chapterContent.images.length > 0 ? (
                    <div className="space-y-6">
                      {chapterContent.images.map((img, index) => (
                        <div 
                          key={index} 
                          className="flex justify-center"
                        >
                          <div className="relative w-full max-w-3xl overflow-hidden rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                            <img
                              src={img}
                              alt={`Page ${index + 1}`}
                              className="w-full h-auto object-contain rounded-lg hover:scale-[1.02] transition-transform duration-500"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                              }}
                            />
                            <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                              Halaman {index + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {chapterContent.content ? (
                        chapterContent.content.split('\n\n').map((paragraph, index) => (
                          <p 
                            key={index} 
                            className="text-gray-800 dark:text-gray-300 leading-relaxed text-lg md:text-xl"
                          >
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

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800 rounded-xl">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleNavigate(chapterContent.navigation.previousChapter)}
                disabled={!chapterContent.navigation.previousChapter || !isValidUrl(chapterContent.navigation.previousChapter)}
                className={cn(
                  "gap-2 transition-all duration-300 hover:scale-105 active:scale-95",
                  "border-blue-300 bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-800",
                  "dark:border-blue-700 dark:bg-gray-800 dark:hover:bg-blue-900/30 dark:text-blue-400",
                  chapterContent.navigation.previousChapter && isValidUrl(chapterContent.navigation.previousChapter)
                  ? "hover:border-blue-400 dark:hover:border-blue-600"
                  : "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="h-5 w-5" />
                Sebelumnya
              </Button>
              
              <Button
                variant="default"
                size="lg"
                onClick={handleBackToChapters}
                className="gap-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 dark:border-blue-700"
              >
                <BookOpen className="h-5 w-5" />
                Daftar Chapter
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleNavigate(chapterContent.navigation.nextChapter)}
                disabled={!chapterContent.navigation.nextChapter || !isValidUrl(chapterContent.navigation.nextChapter)}
                className={cn(
                  "gap-2 transition-all duration-300 hover:scale-105 active:scale-95",
                  "border-blue-300 bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-800",
                  "dark:border-blue-700 dark:bg-gray-800 dark:hover:bg-blue-900/30 dark:text-blue-400",
                  chapterContent.navigation.nextChapter && isValidUrl(chapterContent.navigation.nextChapter)
                  ? "hover:border-blue-400 dark:hover:border-blue-600"
                  : "opacity-50 cursor-not-allowed"
                )}
              >
                Selanjutnya
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && novels.length === 0 && query === '' && !selectedNovel && (
          <div className="text-center py-20 animate-fade-in">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 blur-3xl opacity-20"></div>
              <BookOpen className="h-32 w-32 text-blue-400 mx-auto relative z-10" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Selamat datang di Sakura Novel Reader
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg mb-8">
              Temukan dan baca ribuan novel gratis dengan antarmuka yang nyaman
            </p>
            <div className="max-w-xl mx-auto bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 shadow-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Cara menggunakan:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">1</div>
                  <p className="text-gray-700 dark:text-gray-300">Cari novel di kolom pencarian</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">2</div>
                  <p className="text-gray-700 dark:text-gray-300">Pilih novel yang ingin dibaca</p>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">3</div>
                  <p className="text-gray-700 dark:text-gray-300">Baca chapter dengan nyaman</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && !error && novels.length === 0 && query !== '' && (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full mb-6">
              <AlertCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              Tidak ada novel yang cocok dengan pencarian: <span className="font-semibold text-blue-600 dark:text-blue-400">{query}</span>
            </p>
            <Button
              onClick={() => handleSearch(query)}
              className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 dark:border-blue-700"
            >
              Coba lagi
            </Button>
          </div>
        )}
      </main>

    
    </div>
  );
}