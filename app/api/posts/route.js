// api/posts.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import JWTService from '@/lib/jwtService';

// Indicate this route is dynamic
export const dynamic = 'force-dynamic';

async function getPostsByUser({ userId, startDate, endDate, showDeleted, title }) {
  try {
    const filter = { authorId: userId };

    if (startDate) {
      filter.createdAt = { gte: new Date(startDate) };
    }

    if (endDate) {
      filter.createdAt = { lte: new Date(endDate) };
    }

    filter.deleted = showDeleted === 'show';

    if (title) {
      filter.title = { contains: title, mode: 'insensitive' };
    }

    const posts = await prisma.post.findMany({
      where: filter,
      include: {
        author: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map(post => ({
      ...post,
      authorName: post.author ? post.author.name : 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function GET(request) {
  try {
    const cookie = cookies().get('mycrudapp');
    const token = cookie ? cookie.value : null;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    try {
      const decoded = JWTService.verify(token);
      const userId = decoded.userId;

      const url = new URL(request.url);
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
      const showDeleted = url.searchParams.get('showDeleted');
      const title = url.searchParams.get('title');

      const posts = await getPostsByUser({ userId, startDate, endDate, showDeleted, title });

      return NextResponse.json({ posts });
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
