// app/api/images/[id]/route.js
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const image = await prisma.image.findUnique({
            where: { id: parseInt(id) },
            include: { project: { select: { title: true } } },
        });
        if (!image) {
            return NextResponse.json(
                {
                    success: false,
                    error: { message: "Image not found", code: "NOT_FOUND" },
                },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, data: image });
    } catch (error) {
        console.error("Error fetching image:", error);
        return NextResponse.json(
            {
                success: false,
                error: { message: "Fetch failed", code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    try {
        const { title, description, projectId, displayInGallery } =
            await request.json();
        const image = await prisma.image.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                projectId: projectId ? parseInt(projectId) : null,
                displayInGallery: displayInGallery ?? undefined, // Avoid overwriting with null unintentionally
            },
        });
        return NextResponse.json({ success: true, data: image });
    } catch (error) {
        console.error("Error updating image:", error);
        return NextResponse.json(
            {
                success: false,
                error: { message: "Update failed", code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        const image = await prisma.image.findUnique({
            where: { id: parseInt(id) },
        });
        if (!image) {
            return NextResponse.json(
                {
                    success: false,
                    error: { message: "Image not found", code: "NOT_FOUND" },
                },
                { status: 404 }
            );
        }

        if (image.cloudinaryId) {
            await cloudinary.uploader.destroy(image.cloudinaryId, {
                resource_type: "image",
            });
        }

        await prisma.image.delete({ where: { id: parseInt(id) } });
        return NextResponse.json({ success: true, message: "Image deleted" });
    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json(
            {
                success: false,
                error: { message: "Delete failed", code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}
