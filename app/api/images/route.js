// app/api/images/route.js
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const description = formData.get("description");
    const projectId = formData.get("projectId") || null;
    const displayInGallery = formData.get("displayInGallery") === "true";

    if (!file) {
        return NextResponse.json(
            {
                success: false,
                error: { message: "No file uploaded", code: "BAD_REQUEST" },
            },
            { status: 400 }
        );
    }

    try {
        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary with optimization
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: "image",
                        transformation: [
                            { width: 600, height: 600, crop: "limit" },
                        ],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                )
                .end(buffer);
        });

        const newImage = await prisma.image.create({
            data: {
                url: uploadResult.secure_url,
                cloudinaryId: uploadResult.public_id,
                title,
                description,
                projectId: projectId ? parseInt(projectId) : null,
                displayInGallery: displayInGallery ?? true, // Default to true if not provided
            },
        });

        return NextResponse.json({ success: true, data: newImage });
    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
            {
                success: false,
                error: { message: "Upload failed", code: "UPLOAD_ERROR" },
            },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    try {
        const [images, total] = await Promise.all([
            prisma.image.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { project: { select: { title: true } } },
            }),
            prisma.image.count(),
        ]);
        return NextResponse.json({
            success: true,
            data: images,
            meta: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("Error fetching images:", error);
        return NextResponse.json(
            {
                success: false,
                error: { message: "Fetch failed", code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}
