import { cookies } from "next/headers";
import JWTService from "@/lib/jwtService"; // Import JWTService

export async function GET(request) {
  try {
    const cookie = cookies().get("mycrudapp");
    const theCookie = cookie ? cookie.value : null;

    if (theCookie) { 
      try {
        // Use JWTService to verify the token
        const decoded = JWTService.verify(theCookie);
        return new Response(JSON.stringify(decoded), { status: 200 });
      } catch (error) {
        return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
      }
    }

    return new Response(JSON.stringify({ error: "No token provided" }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error handling the request" }), { status: 500 });
  }
}
