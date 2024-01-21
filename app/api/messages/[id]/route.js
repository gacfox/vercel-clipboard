import { headers } from "next/headers";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

export const GET = async (request, { params }) => {
  try {
    // Read user from middleware
    const header = headers();
    const user = JSON.parse(header.get("X-Middleware-Data"));

    // Query messages
    const { rows } =
      await sql`select * from t_messages where user_id = ${user.user_id} and message_id = ${params.id}`;

    return NextResponse.json({
      code: "200",
      message: "Success",
      data: rows[0] ? rows[0] : null,
    });
  } catch (error) {
    return NextResponse.json({
      code: "500",
      message: `Internal server error: ${error.name} - ${error.message}`,
      data: null,
    });
  }
};

export const PUT = async (request, { params }) => {
  try {
    const { type, content, filename, url } = await request.json();

    const checkFailure = (code, message) => {
      return NextResponse.json({
        code,
        message,
        data: null,
      });
    };

    // Check request params
    if (type === "text") {
      if (!content) {
        return checkFailure("400", "Invalid request params");
      }
    } else if (type === "file") {
      if (!filename || !url || filename.length > 255 || url.length > 2000) {
        return checkFailure("400", "Invalid request params");
      }
    } else {
      return checkFailure("400", "Invalid request params");
    }

    // Read user from middleware
    const header = headers();
    const user = JSON.parse(header.get("X-Middleware-Data"));

    // Query messages
    const { rows } =
      await sql`select * from t_messages where user_id = ${user.user_id} and message_id = ${params.id}`;
    if (rows && rows.length > 0) {
      await sql`update t_messages set type = ${type}, content = ${content}, filename = ${filename}, url = ${url}, update_time = now() where user_id = ${user.user_id} and message_id = ${params.id}`;
    }

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
};

export const DELETE = async (request, { params }) => {
  try {
    // Read user from middleware
    const header = headers();
    const user = JSON.parse(header.get("X-Middleware-Data"));

    // Query messages
    const { rows } =
      await sql`select * from t_messages where user_id = ${user.user_id} and message_id = ${params.id}`;
    if (rows && rows.length > 0) {
      if (rows[0].type === "file") {
        await del(rows[0].url);
      }
      await sql`delete from t_messages where user_id = ${user.user_id} and message_id = ${params.id}`;
    }

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
};
