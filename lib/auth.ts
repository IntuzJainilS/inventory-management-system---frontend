"use server"
import { cookies } from "next/headers";

export async function createSession(token: string, usertype: string, full_name:string, email:string) {
  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true, // prevents XSS - more secure
    // secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  cookieStore.set("userRole", usertype, { httpOnly: true, secure: false, sameSite: "lax", path: "/" });

  cookieStore.set("full_name", full_name, { httpOnly: true, secure: false, sameSite: "lax", path: "/" })

  cookieStore.set("email", email, { httpOnly: true, secure: false, sameSite: "lax", path: "/" })
}

export async function getSessionData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const role = cookieStore.get("userRole")?.value;
  const full_name = cookieStore.get("full_name")?.value;
  const email = cookieStore.get("email")?.value;
  return { token, role, full_name, email };
}

export async function DeleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  cookieStore.delete('userRole');
  cookieStore.delete('full_name');
  cookieStore.delete('email');
  console.log("cookies deleted");
}
