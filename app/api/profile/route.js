import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';
import JWTService from '@/lib/jwtService'; // Import JWTService

const prisma = new PrismaClient();

export async function PUT(req) {
    const cookie = cookies().get("mycrudapp");
    const token = cookie ? cookie.value : null; 

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    try {
        const decoded = JWTService.verify(token);
        const userId = decoded.userId;

        const { name, originalPassword, newPassword } = await req.json();
        const errors = {};

        if (!name && !newPassword) {
            return NextResponse.json({ message: 'Name or password is required' }, { status: 400 });
        }

        // fetch the current user
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // validate and change the password
        if (newPassword) {
            if (!originalPassword) {
                return NextResponse.json({ message: 'Original password is required to change the password' }, { status: 400 });
            }

            // verify the original password
            const isPasswordCorrect = await bcrypt.compare(originalPassword, user.password);
            if (!isPasswordCorrect) {
                return NextResponse.json({ message: 'Incorrect original password' }, { status: 400 });
            }

            // enforce password rules
            if (newPassword.length < 12) {
                errors.password = 'Password must be at least 12 characters.';
            } else if (newPassword.length > 50) {
                errors.password = 'Password cannot exceed 50 characters.';
            }

            if (Object.keys(errors).length > 0) {
                return NextResponse.json({ errors, success: false }, { status: 400 });
            }

            // hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // update the password
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword },
            });
        }

        // update the name if provided
        if (name) {
            await prisma.user.update({
                where: { id: userId },
                data: { name },
            });
        }

        return NextResponse.json({ message: 'User updated successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating user', error: error.message }, { status: 500 });
    }
}
