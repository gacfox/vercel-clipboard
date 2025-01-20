import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(request) {
  const body = await request.json();
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { token } = JSON.parse(clientPayload);
        if (token) {
          const user = await kv.get(`token-${token}`);
          if (!user) {
            return NextResponse.json({
              code: "403",
              message: "Login required",
              data: null,
            });
          }
        }
        return {};
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({
      code: "500",
      message: `Internal server error: ${error.name} - ${error.message}`,
      data: null,
    });
  }
}
