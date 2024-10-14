import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import JWTService from '@/lib/jwtService';

export async function POST(req) {
  const failObject = {
    success: false,
    message: "Invalid email/username or password.",
  };

  try {
    const formData = await req.json();

    const ourUser = {
      emailOrUsername: formData.emailOrUsername || '',
      password: formData.password || '',
    };

    // Validate input
    if (
      typeof ourUser.emailOrUsername !== 'string' ||
      typeof ourUser.password !== 'string' ||
      ourUser.emailOrUsername.trim() === '' ||
      ourUser.password.trim() === ''
    ) {
      return NextResponse.json(failObject, { status: 400 });
    }

    ourUser.emailOrUsername = ourUser.emailOrUsername.trim();
    ourUser.password = ourUser.password.trim();

    // Find user by either email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: ourUser.emailOrUsername },
          { name: ourUser.emailOrUsername },
        ],
      },
    });

    if (!user) {
      console.error('User not found');
      return NextResponse.json(failObject, { status: 401 });
    }

    // Compare passwords securely
    const passwordMatch = await bcrypt.compare(ourUser.password, user.password);

    if (!passwordMatch) {
      console.error('Password does not match');
      return NextResponse.json(failObject, { status: 401 });
    }

    // Generate the JWT token
    const token = JWTService.sign({ userId: user.id });

    // Set the cookie
    cookies().set('mycrudapp', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === 'production',
      path: '/', // Set the path to ensure the cookie is accessible
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful.',
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error.',
      },
      { status: 500 }
    );
  }
}
