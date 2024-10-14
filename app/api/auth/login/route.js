import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import JWTService from '@/lib/jwtService'; // Import the JWTService

export async function POST(req) {
  const failObject = {
    success: false,
    message: "Invalid email/username or password."
  };

  try {
    const formData = await req.json();

    const ourUser = {
      emailOrUsername: formData.emailOrUsername || '',  // Accept email or username
      password: formData.password || ''
    };

    if (typeof ourUser.emailOrUsername !== 'string' || typeof ourUser.password !== 'string' || ourUser.emailOrUsername.trim() === '' || ourUser.password.trim() === '') {
      return NextResponse.json(failObject, { status: 400 });
    }

    ourUser.emailOrUsername = ourUser.emailOrUsername.trim();
    ourUser.password = ourUser.password.trim();

    // Find user by either email or username without changing schema
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: ourUser.emailOrUsername },
          { name: ourUser.emailOrUsername }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(failObject, { status: 401 });
    }

    const passwordMatch = bcrypt.compareSync(ourUser.password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(failObject, { status: 401 });
    }

    // Use JWTService to sign the token
    const token = JWTService.sign({ userId: user.id }); // Call the sign method

    cookies().set('mycrudapp', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === 'production'
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful.'
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error.'
    }, { status: 500 });
  }
}
