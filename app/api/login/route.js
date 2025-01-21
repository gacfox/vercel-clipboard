import crypto from "crypto";
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";

export const POST = async (request) => {
  const { username, password } = await request.json();
  if (
    username &&
    password &&
    username.length <= 20 &&
    password.length >= 6 &&
    password.length <= 20
  ) {
    try {
      const hash = crypto.createHash("sha256");
      hash.update(password);
      const passwordHash = hash.digest("hex");
      const { rows } =
        await sql`select * from t_users where username=${username} and password=${passwordHash}`;
      if (rows.length === 0) {
        // Login failed
        return NextResponse.json({
          code: "403",
          message: "Invalid username or password",
          data: null,
        });
      } else {
        // Login success
        const response = NextResponse.json({
          code: "200",
          message: "Success",
          data: null,
        });
        // Write a token to response
        const user = rows[0];
        const uuid = uuidv4();
        await kv.set(`token-${uuid}`, user, {
          ex: process.env.TOKEN_EXPIRES_SECONDS
            ? parseInt(process.env.TOKEN_EXPIRES_SECONDS)
            : 31536000,
        });
        response.headers.set("X-Session-ID", uuid);
        return response;
      }
    } catch (error) {
      return NextResponse.json({
        code: "500",
        message: `Internal server error: ${error.name} - ${error.message}`,
        data: null,
      });
    }
  } else {
    return NextResponse.json({
      code: "400",
      message: "Invalid request params",
      data: null,
    });
  }
};
