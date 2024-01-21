import { headers } from "next/headers";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { del } from "@vercel/blob";

export const GET = async () => {
  try {
    // Read user from middleware
    const header = headers();
    const user = JSON.parse(header.get("X-Middleware-Data"));

    // Query messages
    const { rows } =
      await sql`select * from t_messages where user_id = ${user.user_id} order by update_time desc`;
    return NextResponse.json({
      code: "200",
      message: "Success",
      data: rows,
    });
  } catch (error) {
    return NextResponse.json({
      code: "500",
      message: `Internal server error: ${error.name} - ${error.message}`,
      data: null,
    });
  }
};

export const POST = async (request) => {
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

    // Add message record to database
    await sql`insert into t_messages (type, content, filename, url, user_id) values (${type}, ${content}, ${filename}, ${url}, ${user.user_id})`;
    const { rows } = await sql`select count(*) from t_messages where user_id = ${user.user_id}`;
    if (rows[0].count > 25) {
      const { rows: toDeleteRows } =
        await sql`select * from t_messages where user_id = ${user.user_id} and message_id not in (select message_id from t_messages where user_id = ${user.user_id} order by update_time desc limit 25)`;
      if (toDeleteRows && toDeleteRows.length > 0) {
        for (const toDeleteRow of toDeleteRows) {
          if (toDeleteRow.type === "file") {
            await del(toDeleteRow.url);
          }
        }
      }
      await sql`delete from t_messages where user_id = ${user.user_id} and message_id not in (select message_id from t_messages where user_id = ${user.user_id} order by update_time desc limit 25)`;
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
