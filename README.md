# Image Watermark Generator API

A powerful and easy-to-use API for adding professional watermarks to images. Built with Next.js and Sharp, this API allows you to customize watermark size, position, and more.

## 🌟 Features

- **Easy to Use**: Simple API endpoint with straightforward parameters
- **Customizable**: Control watermark size, position, and more
- **Fast**: Optimized image processing with Sharp
- **Responsive**: Works with images of any size
- **Modern UI**: Beautiful, responsive interface with dark mode support
- **Developer Friendly**: Well-documented API with example usage

## 🚀 Live Demo

Visit [https://free-watermark.vercel.app](https://free-watermark.vercel.app) to try the watermark generator.

## 📝 API Usage

### Endpoint

```
GET /api/watermark
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| mainImageUrl | string | Yes | URL of the main image to watermark |
| markImageUrl | string | Yes | URL of the watermark image |
| markRatio | number | No | Size ratio of the watermark (0.5 = half size, 1 = original size, 2 = double size) |
| position | string | No | Position of the watermark (center, top-left, top-right, bottom-left, bottom-right) |

### Example Request

```javascript
const params = new URLSearchParams({
  mainImageUrl: 'https://example.com/image.jpg',
  markImageUrl: 'https://example.com/watermark.png',
  markRatio: '1',
  position: 'center'
});

const response = await fetch(`https://free-watermark.vercel.app/api/watermark?${params}`);
const imageBlob = await response.blob();
```

### Response

The API returns the watermarked image directly with the following headers:
- `Content-Type: image/jpeg`
- `Cache-Control: public, max-age=31536000`

## 🛠️ Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/watermark-api.git
   cd watermark-api
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Built With

- [Next.js](https://nextjs.org/) - React framework for production
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety for JavaScript

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/unitop010/Free-Watermark-API/issues).

## 👤 Author

**Unitop010**
