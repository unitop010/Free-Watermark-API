'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [markImageUrl, setMarkImageUrl] = useState('');
  const [markRatio, setMarkRatio] = useState('1');
  const [position, setPosition] = useState('center');
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate watermark');
      }

      // Convert the response to a blob URL
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
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Watermark Generator
          </h1>
          <p className="text-lg text-gray-600">
            Add beautiful watermarks to your images with customizable size and position
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image URL
              </label>
              <input
                type="url"
                value={mainImageUrl}
                onChange={(e) => setMainImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Watermark Image URL
              </label>
              <input
                type="url"
                value={markImageUrl}
                onChange={(e) => setMarkImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="https://example.com/watermark.png"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Watermark Size Ratio
                </label>
                <input
                  type="number"
                  value={markRatio}
                  onChange={(e) => setMarkRatio(e.target.value)}
                  min="0.1"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                <p className="mt-1 text-sm text-gray-500">
                  0.5 = half size, 1 = original size, 2 = double size
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
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
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                loading || !mainImageUrl || !markImageUrl
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-secondary'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Watermark'}
            </button>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>
        </div>

        {resultUrl && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Result
            </h2>
            <div className="relative aspect-square w-full max-w-lg mx-auto mb-4">
              <Image
                src={resultUrl}
                alt="Watermarked image"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div className="flex justify-center space-x-4">
              <a
                href={resultUrl}
                download="watermarked-image.jpg"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary"
              >
                Download Image
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resultUrl);
                  alert('URL copied to clipboard!');
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Copy URL
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 