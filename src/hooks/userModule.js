import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function getUser() {
  try {
    const cookieStore = cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(`${API_URL}/api/v1/users/user`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data ?? null;
  } catch (err) {
    console.error("getServerUser error:", err);
    return null;
  }
}