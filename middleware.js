import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { kv } from "@vercel/kv";
import { sql } from "@vercel/postgres";

export const middleware = async (request) => {
  // Create tables if not inited
  const inited = await kv.get("tables-inited");
  if (!inited) {
    await sql`create table if not exists t_messages (message_id serial primary key, type varchar(10) not null, content text, filename varchar(255), url varchar(2000), user_id int not null, create_time timestamp default now(), update_time timestamp default now())`;
    await sql`create table if not exists t_users (user_id serial primary key, username varchar(20) not null, password varchar(64) not null)`;
    await kv.set("tables-inited", true);
  }

  // Login check
  let user;
  let token = headers().get("X-Session-ID");
  if (token) {
    user = await kv.get(`token-${token}`);
    if (!user) {
      return NextResponse.json({
        code: "403",
        message: "Login required",
        data: null,
      });
    }
  } else {
    return NextResponse.json({
      code: "403",
      message: "Login required",
      data: null,
    });
  }

  // Pass login data to routes
  const header = new Headers(request.headers);
  header.set("X-Middleware-Data", JSON.stringify(user));
  const response = NextResponse.next({
    request: {
      headers: header,
    },
  });
  return response;
};

export const config = {
  matcher: ["/api/messages", "/api/messages/:path*"],
};
