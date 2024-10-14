import { PrismaClient } from '@prisma/client';
import { formatDateTime } from '@/utils/formatDateTime';
import { cookies } from 'next/headers';
import JWTService from '@/lib/jwtService'; // Assuming JWTService is in services folder

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const { id } = params;
    const cookie = cookies().get("mycrudapp");
    const token = cookie ? cookie.value : null;

    if (!token) {
        return new Response(JSON.stringify({ success: false, message: 'Unauthorized: No token provided' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const decoded = JWTService.verify(token);
        if (!decoded || !decoded.userId) {
            return new Response(JSON.stringify({ success: false, message: 'Unauthorized: Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const post = await prisma.post.findUnique({
            where: { id: id, deleted: false },
        });

        if (!post) {
            return new Response(JSON.stringify({ success: false, message: "Post not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        post.createdAt = formatDateTime(post.createdAt);
        post.updatedAt = formatDateTime(post.updatedAt);

        return new Response(JSON.stringify({ success: true, data: post }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { title, content } = await req.json();
    const cookie = cookies().get("mycrudapp");
    const token = cookie ? cookie.value : null;

    if (!token) {
        return new Response(JSON.stringify({ success: false, message: 'Unauthorized: No token provided' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const decoded = JWTService.verify(token);
        if (!decoded || !decoded.userId) {
            return new Response(JSON.stringify({ success: false, message: 'Unauthorized: Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Manually update the updatedAt field with the current date
        const updatedPost = await prisma.post.update({
            where: { id: id },
            data: { 
                title, 
                content,
                updatedAt: new Date() // Ensure this field is updated
            },
        });

        // Format dates before sending back the response
        updatedPost.createdAt = formatDateTime(updatedPost.createdAt);
        updatedPost.updatedAt = formatDateTime(updatedPost.updatedAt);

        return new Response(JSON.stringify({ success: true, data: updatedPost }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;
    const cookie = cookies().get("mycrudapp");
    const token = cookie ? cookie.value : null;

    if (!token) {
        return new Response(JSON.stringify({ success: false, message: 'Unauthorized: No token provided' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const decoded = JWTService.verify(token);
        if (!decoded || !decoded.userId) {
            return new Response(JSON.stringify({ success: false, message: 'Unauthorized: Invalid token' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const deletedPost = await prisma.post.update({
            where: { id: id },
            data: {
                deleted: true,
                deletedAt: new Date(),
            },
        });

        deletedPost.createdAt = formatDateTime(deletedPost.createdAt);
        deletedPost.updatedAt = formatDateTime(deletedPost.updatedAt);
        deletedPost.deletedAt = formatDateTime(deletedPost.deletedAt);

        return new Response(JSON.stringify({ success: true, data: deletedPost }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
