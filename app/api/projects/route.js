// app/api/projects/route.js
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
    const title = formData.get("title");
    const description = formData.get("description");
    const imagesCount = parseInt(formData.get("imagesCount") || "0", 10);

    if (!title || imagesCount === 0) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: "Title and at least one image required",
                    code: "BAD_REQUEST",
                },
            },
            { status: 400 }
        );
    }

    const uploadedImages = [];
    for (let i = 0; i < imagesCount; i++) {
        const file = formData.get(`file_${i}`);
        const imgTitle = formData.get(`title_${i}`);
        const imgDescription = formData.get(`description_${i}`);
        const displayInGallery =
            formData.get(`displayInGallery_${i}`) === "true";

        if (!file) continue; // Skip if no file provided

        try {
            // Convert File to Buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload to Cloudinary
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

            uploadedImages.push({
                url: uploadResult.secure_url,
                cloudinaryId: uploadResult.public_id,
                title: imgTitle,
                description: imgDescription,
                position: i + 1,
                displayInGallery: displayInGallery ?? true,
            });
        } catch (error) {
            console.error(`Error uploading image ${i}:`, error);
            // Optionally clean up already uploaded images on failure
            for (const img of uploadedImages) {
                if (img.cloudinaryId)
                    await cloudinary.uploader.destroy(img.cloudinaryId);
            }
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: "Image upload failed",
                        code: "UPLOAD_ERROR",
                    },
                },
                { status: 500 }
            );
        }
    }

    try {
        const project = await prisma.project.create({
            data: {
                title,
                description,
                images: { create: uploadedImages },
            },
            include: { images: true },
        });
        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        console.error("Error creating project:", error);
        // Clean up uploaded images if project creation fails
        for (const img of uploadedImages) {
            if (img.cloudinaryId)
                await cloudinary.uploader.destroy(img.cloudinaryId);
        }
        return NextResponse.json(
            {
                success: false,
                error: { message: "Creation failed", code: "DATABASE_ERROR" },
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
        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { images: { take: 1 } },
            }),
            prisma.project.count(),
        ]);
        return NextResponse.json({
            success: true,
            data: projects,
            meta: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            {
                success: false,
                error: { message: "Fetch failed", code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}
