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

    // Destructure and trim user credentials
    const { emailOrUsername = '', password = '' } = formData;
    const trimmedEmailOrUsername = emailOrUsername.trim();
    const trimmedPassword = password.trim();

    // Validate input
    if (!trimmedEmailOrUsername || !trimmedPassword) {
      console.error('Validation failed: missing email/username or password');
      return NextResponse.json(failObject, { status: 400 });
    }

    // Find user by either email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: trimmedEmailOrUsername },
          { name: trimmedEmailOrUsername },
        ],
      },
    });

    if (!user) {
      console.error('User not found for:', trimmedEmailOrUsername);
      return NextResponse.json(failObject, { status: 401 });
    }

    // Compare passwords securely
    const passwordMatch = await bcrypt.compare(trimmedPassword, user.password);

    if (!passwordMatch) {
      console.error('Password mismatch for user:', user.email);
      return NextResponse.json(failObject, { status: 401 });
    }

    // Generate the JWT token
    const token = JWTService.sign({ userId: user.id });
    console.log('JWT token generated successfully for user:', user.email);

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
    console.error('Error during login:', error); // Log the error
    const errorMessage = process.env.NODE_ENV !== 'production' ? error.message : 'Internal server error.';
    return NextResponse.json(
      {
          success: false,
          message: errorMessage, // Return error message
      },
      { status: 500 }
    );
  }
}
