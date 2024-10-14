import { PrismaClient } from '@prisma/client';
import JWTService from '@/lib/jwtService'; // Adjust path as needed

const prisma = new PrismaClient();

// Named export for the GET method
// Named export for the GET method
export async function GET(req, { params }) {
  const { id } = params; // Keep `id` as a string

  // Verify JWT token
  const token = req.cookies.mycrudapp;
  let decoded;

  try {
    decoded = JWTService.verify(token);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id }, // Use id directly as a string
      include: { author: true }, // Optional: Include author details
    });

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch post' }), { status: 500 });
  }
}


// Named export for the PUT method
// Named export for the PUT method
export async function PUT(req, { params }) {
  const { id } = params; // Keep `id` as a string
  const { color } = await req.json();

  if (!color) {
    return new Response(JSON.stringify({ error: 'Color is required' }), { status: 400 });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id }, // Use id directly as a string
      data: { color },
    });
    return new Response(JSON.stringify(updatedPost), { status: 200 });
  } catch (error) {
    console.error('Error updating post:', error); // Log the error
    return new Response(JSON.stringify({ error: 'Failed to update post' }), { status: 500 });
  }
}


// You can remove the 'else' block as the default export is no longer needed.
