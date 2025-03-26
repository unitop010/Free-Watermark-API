import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mainImageUrl = searchParams.get('mainImageUrl');
    const markImageUrl = searchParams.get('markImageUrl');
    const markRatio = parseFloat(searchParams.get('markRatio') || '1');
    const position = searchParams.get('position') || 'center';

    if (!mainImageUrl || !markImageUrl) {
      return NextResponse.json(
        { error: 'mainImageUrl and markImageUrl are required' },
        { status: 400 }
      );
    }

    if (markRatio <= 0) {
      return NextResponse.json(
        { error: 'markRatio must be greater than 0' },
        { status: 400 }
      );
    }

    // Fetch both images
    const [mainImageResponse, markImageResponse] = await Promise.all([
      fetch(mainImageUrl),
      fetch(markImageUrl)
    ]);

    if (!mainImageResponse.ok || !markImageResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch one or both images' },
        { status: 400 }
      );
    }

    const mainImageArrayBuffer = await mainImageResponse.arrayBuffer();
    const markImageArrayBuffer = await markImageResponse.arrayBuffer();
    const mainImageBuffer = Buffer.from(mainImageArrayBuffer);
    const markImageBuffer = Buffer.from(markImageArrayBuffer);

    // Get main image metadata
    const mainImageMetadata = await sharp(mainImageBuffer).metadata();
    const { width: mainWidth, height: mainHeight } = mainImageMetadata;

    let finalMainImage = sharp(mainImageBuffer);
    let finalMarkImage = sharp(markImageBuffer);
    let finalWidth = mainWidth!;
    let finalHeight = mainHeight!;

    if (markRatio < 1) {
      // Scale up the main image when markRatio < 1
      finalWidth = Math.round(mainWidth! / markRatio);
      finalHeight = Math.round(mainHeight! / markRatio);
      
      finalMainImage = finalMainImage.resize(finalWidth, finalHeight);
    } else {
      // Scale down the watermark when markRatio > 1
      const markWidth = Math.round(mainWidth! / markRatio);
      const markHeight = Math.round(mainHeight! / markRatio);
      finalMarkImage = finalMarkImage.resize(markWidth, markHeight);
    }

    // Calculate position
    let left = 0;
    let top = 0;

    switch (position) {
      case 'top-left':
        left = 0;
        top = 0;
        break;
      case 'top-right':
        left = finalWidth - (markRatio < 1 ? mainWidth! : Math.round(mainWidth! / markRatio));
        top = 0;
        break;
      case 'bottom-left':
        left = 0;
        top = finalHeight - (markRatio < 1 ? mainHeight! : Math.round(mainHeight! / markRatio));
        break;
      case 'bottom-right':
        left = finalWidth - (markRatio < 1 ? mainWidth! : Math.round(mainWidth! / markRatio));
        top = finalHeight - (markRatio < 1 ? mainHeight! : Math.round(mainHeight! / markRatio));
        break;
      case 'center':
      default:
        left = Math.round((finalWidth - (markRatio < 1 ? mainWidth! : Math.round(mainWidth! / markRatio))) / 2);
        top = Math.round((finalHeight - (markRatio < 1 ? mainHeight! : Math.round(mainHeight! / markRatio))) / 2);
    }

    // Composite the images
    const watermarkedImage = await finalMainImage
      .composite([
        {
          input: await finalMarkImage.toBuffer(),
          left,
          top,
        },
      ])
      .toBuffer();

    // Return the watermarked image
    return new NextResponse(watermarkedImage, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error processing image:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to process image: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 