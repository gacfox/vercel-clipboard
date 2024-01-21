import crypto from "crypto";
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { get } from "@vercel/edge-config";

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
      let allow = await get("allowRegister");
      if (allow !== true) {
        return NextResponse.json({
          code: "400",
          message: "Signup disabled",
          data: null,
        });
      }

      const { rows } =
        await sql`select * from t_users where username=${username}`;
      if (rows.length > 0) {
        return NextResponse.json({
          code: "400",
          message: "Username already exists",
          data: null,
        });
      }

      const hash = crypto.createHash("sha256");
      hash.update(password);
      const passwordHash = hash.digest("hex");
      await sql`insert into t_users (username, password) values (${username}, ${passwordHash})`;
      return NextResponse.json({
        code: "200",
        message: "Success",
        data: null,
      });
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
