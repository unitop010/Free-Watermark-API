# Watermark API

A Next.js API that generates watermarked images from image URLs.

## Features

- Add watermark to any image using URLs
- Customize watermark size using markRatio
- Position watermark in different locations
- Caching support for better performance

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## Usage

The API endpoint accepts the following query parameters:

- `mainImageUrl`: URL of the main image to watermark
- `markImageUrl`: URL of the watermark image
- `markRatio`: Scale factor for the watermark (default: 1)
- `position`: Position of the watermark (default: center)
  - Available positions: center, top-left, top-right, bottom-left, bottom-right

### Example URL

```
http://localhost:3000/api/watermark?mainImageUrl=https://example.com/image.jpg&markImageUrl=https://example.com/watermark.png&markRatio=1&position=center
```

## API Response

The API returns the watermarked image directly as a JPEG file with appropriate headers for caching.

## Error Handling

The API returns appropriate error messages in JSON format when:
- Required parameters are missing
- Failed to fetch images
- Processing errors occur 