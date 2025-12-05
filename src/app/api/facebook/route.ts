import { NextResponse } from "next/server";
import { makeErrorResponse, makeSuccessResponse } from "@/lib/http";

async function handleError(error: any) {
  console.error("Facebook API proxy error:", error);
  const response = makeErrorResponse("Failed to download Facebook video");
  return NextResponse.json(response, { status: 500 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    const badRequestResponse = makeErrorResponse("Facebook video URL is required");
    return NextResponse.json(badRequestResponse, { status: 400 });
  }

  try {
    // Prepare the request body for the external API
    const requestBody = JSON.stringify({
      url: url,
      quality: "best"
    });

    // Make request to the external Facebook downloader API
    const response = await fetch('https://fb-daunloder-d3f5aed438ea.herokuapp.com/download', {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 15; V2312 Build/AP3A.240905.015.A2_MOD1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.7444.171 Mobile Safari/537.36',
        'Accept-Encoding': 'json',
        'sec-ch-ua-platform': '"Android"',
        'sec-ch-ua': '"Chromium";v="142", "Android WebView";v="142", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?1',
        'origin': 'https://facebook-video-downloader.fly.dev',
        'x-requested-with': 'mark.via.gp',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://facebook-video-downloader.fly.dev/',
        'accept-language': 'en-US,en;q=0.9',
        'priority': 'u=1, i',
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    if (!response.ok) {
      throw new Error(`External API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the response to match your existing format
    const timestamp = Date.now();
    const transformedData = {
      filename: `fb-downloader-${timestamp}.mp4`,
      width: "1280",
      height: "720", 
      videoUrl: data.download_url || data.available_formats?.[0]?.url || ''
    };
    
    const successResponse = makeSuccessResponse(transformedData);
    return NextResponse.json(successResponse, { status: 200 });

  } catch (error: any) {
    return handleError(error);
  }
}
