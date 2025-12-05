import { NextResponse } from "next/server";
import { makeErrorResponse, makeSuccessResponse } from "@/lib/http";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.url) {
      const badRequestResponse = makeErrorResponse("URL is required");
      return NextResponse.json(badRequestResponse, { status: 400 });
    }

    // Call the clipto.com API
    const response = await fetch('https://www.clipto.com/api/youtube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: body.url
      })
    });

    if (!response.ok) {
      const errorResponse = makeErrorResponse(`External API error: ${response.status}`);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    const data = await response.json();
    
    // Transform the response to desired format
    const timestamp = Date.now();
    const transformedData = {
      filename: `yt-downloader-${timestamp}.mp4`,
      width: "480",
      height: "854",
      videoUrl: data.medias?.find((media: any) => media.type === 'video' && media.quality === 'mp4 (360p)')?.url || ''
    };
    
    const successResponse = makeSuccessResponse(transformedData);
    return NextResponse.json(successResponse, { status: 200 });

  } catch (error: any) {
    console.error("YouTube API proxy error:", error);
    const errorResponse = makeErrorResponse("Internal server error");
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  
  if (!url) {
    const badRequestResponse = makeErrorResponse("URL parameter is required");
    return NextResponse.json(badRequestResponse, { status: 400 });
  }

  try {
    // Call the clipto.com API
    const response = await fetch('https://www.clipto.com/api/youtube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url
      })
    });

    if (!response.ok) {
      const errorResponse = makeErrorResponse(`External API error: ${response.status}`);
      return NextResponse.json(errorResponse, { status: response.status });
    }

    const data = await response.json();
    
    // Transform the response to desired format
    const timestamp = Date.now();
    const transformedData = {
      filename: `yt-downloader-${timestamp}.mp4`,
      width: "480",
      height: "854",
      videoUrl: data.medias?.find((media: any) => media.type === 'video' && media.quality === 'mp4 (360p)')?.url || ''
    };
    
    const successResponse = makeSuccessResponse(transformedData);
    return NextResponse.json(successResponse, { status: 200 });

  } catch (error: any) {
    console.error("YouTube API proxy error:", error);
    const errorResponse = makeErrorResponse("Internal server error");
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
