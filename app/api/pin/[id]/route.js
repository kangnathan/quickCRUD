import prisma from '@/lib/prisma';
import JWTService from '@/lib/jwtService';

export async function PATCH(req, { params }) {
  const cookieHeader = req.headers.get('cookie');
  const cookies = Object.fromEntries(cookieHeader?.split('; ').map(c => c.split('=')) ?? []);

  const token = cookies.mycrudapp;

  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    JWTService.verify(token);  // Verify the JWT token
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401 });
  }

  const { id } = params;  // 'params' is used in the app router to access the dynamic route

  try {
    const post = await prisma.post.findUnique({
      where: { id: String(id) },
    });

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
    }

    // Toggle the pin status
    const updatedPost = await prisma.post.update({
      where: { id: String(id) },
      data: { pinned: !post.pinned },
    });

    return new Response(JSON.stringify(updatedPost), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update post pin status' }), { status: 500 });
  }
}
