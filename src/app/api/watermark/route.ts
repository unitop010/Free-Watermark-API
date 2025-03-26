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

    // Calculate watermark dimensions based on markRatio
    const markWidth = Math.round(mainWidth! * markRatio);
    const markHeight = Math.round(mainHeight! * markRatio);

    // Resize watermark to the calculated size
    finalMarkImage = finalMarkImage.resize(markWidth, markHeight);

    // If watermark is larger than main image, crop it to main image size
    if (markWidth > mainWidth! || markHeight > mainHeight!) {
      finalMarkImage = finalMarkImage.extract({
        left: 0,
        top: 0,
        width: mainWidth!,
        height: mainHeight!
      });
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
        left = mainWidth! - mainWidth!;
        top = 0;
        break;
      case 'bottom-left':
        left = 0;
        top = mainHeight! - mainHeight!;
        break;
      case 'bottom-right':
        left = mainWidth! - mainWidth!;
        top = mainHeight! - mainHeight!;
        break;
      case 'center':
      default:
        left = Math.round((mainWidth! - mainWidth!) / 2);
        top = Math.round((mainHeight! - mainHeight!) / 2);
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