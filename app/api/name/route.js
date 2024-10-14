// api/name.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import JWTService from '@/lib/jwtService';

// Indicate this route is dynamic
export const dynamic = 'force-dynamic';

async function getUserName(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });
    return user ? user.name : 'Unknown User';
  } catch (error) {
    console.error('Error fetching user name:', error);
    return 'Unknown User';
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

      const userName = await getUserName(userId);

      return NextResponse.json({ userName });
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
