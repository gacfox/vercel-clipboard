import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export const GET = async () => {
  try {
    let allow = await get("allowRegister");
    if (allow !== true) {
      allow = false;
    }
    return NextResponse.json({
      code: "200",
      message: "Success",
      data: allow,
    });
  } catch (error) {
    return NextResponse.json({
      code: "500",
      message: `Internal server error: ${error.name} - ${error.message}`,
      data: null,
    });
  }
};
