'use client';

import { useState } from 'react';
import Image from 'next/image';
import Toast from '@/components/Toast';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Home() {
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [markImageUrl, setMarkImageUrl] = useState('');
  const [markRatio, setMarkRatio] = useState('1');
  const [position, setPosition] = useState('center');
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; show: boolean }>({
    message: '',
    show: false,
  });

  const showToast = (message: string) => {
    setToast({ message, show: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const generateWatermark = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        mainImageUrl,
        markImageUrl,
        markRatio,
        position,
      });

      const response = await fetch(`/api/watermark?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate watermark');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Fixed Theme Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Image Watermark Generator</span>
              <span className="block text-primary dark:text-primary-light mt-3">Protect Your Images</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-6xl">
              Add professional watermarks to your images with customizable size and position. Fast, easy, and secure.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Generate Watermark</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Main Image URL
                </label>
                <input
                  type="url"
                  value={mainImageUrl}
                  onChange={(e) => setMainImageUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Watermark Image URL
                </label>
                <input
                  type="url"
                  value={markImageUrl}
                  onChange={(e) => setMarkImageUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com/watermark.png"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Watermark Size Ratio
                  </label>
                  <input
                    type="number"
                    value={markRatio}
                    onChange={(e) => setMarkRatio(e.target.value)}
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    0.5 = half size, 1 = original size, 2 = double size
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Position
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="center">Center</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
              </div>

              <button
                onClick={generateWatermark}
                disabled={loading || !mainImageUrl || !markImageUrl}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                  loading || !mainImageUrl || !markImageUrl
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-primary hover:bg-secondary dark:bg-primary-dark dark:hover:bg-secondary-dark transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Watermark'
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              {/* Example API Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Example API Endpoint</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
                    https://free-watermark.vercel.app/api/watermark?mainImageUrl=https://example.com/image.jpg&markImageUrl=https://example.com/watermark.png&markRatio=1&position=center
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://free-watermark.vercel.app/api/watermark?mainImageUrl=https://example.com/image.jpg&markImageUrl=https://example.com/watermark.png&markRatio=1&position=center');
                      showToast('Example URL copied to clipboard!');
                    }}
                    className="mt-2 text-sm text-primary dark:text-primary-light hover:text-secondary dark:hover:text-secondary-light flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Example URL
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Parameters:
                  <br />
                  • mainImageUrl: URL of the main image to watermark
                  <br />
                  • markImageUrl: URL of the watermark image
                  <br />
                  • markRatio: Size ratio (0.5 = half size, 1 = original size, 2 = double size)
                  <br />
                  • position: Position of watermark (center, top-left, top-right, bottom-left, bottom-right)
                </p>
              </div>
            </div>
          </div>

          {/* Result Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Preview</h2>
            {resultUrl ? (
              <div className="flex-1 flex flex-col">
                <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700" style={{ aspectRatio: '1/1', minHeight: '300px' }}>
                  <Image
                    src={resultUrl}
                    alt="Watermarked image"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
                  <a
                    href={resultUrl}
                    download="watermarked-image.jpg"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-secondary dark:bg-primary-dark dark:hover:bg-secondary-dark transition-colors"
                  >
                    Download Image
                  </a>
                  <button
                    onClick={() => {
                      const apiUrl = `${window.location.origin}/api/watermark?${new URLSearchParams({
                        mainImageUrl,
                        markImageUrl,
                        markRatio,
                        position,
                      })}`;
                      navigator.clipboard.writeText(apiUrl);
                      showToast('API URL copied to clipboard!');
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Copy API URL
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600" style={{ minHeight: '300px' }}>
                <p className="text-gray-500 dark:text-gray-400 text-center px-4">Your watermarked image will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {toast.show && (
        <Toast
          message={toast.message}
          onClose={hideToast}
        />
      )}
    </div>
  );
} 