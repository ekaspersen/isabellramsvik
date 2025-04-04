import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import pino from "pino";
import fs from "fs";
import path from "path";
import { cache } from "@/lib/cache";

const logger = pino({ level: "info" });

async function uploadFile(file) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
        throw new Error(
            "Invalid file type. Only JPEG, PNG, and GIF are allowed."
        );
    }
    if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 5MB.");
    }
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${fileName}`;
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const projectId = searchParams.get("projectId");
    const skip = (page - 1) * limit;
    const cacheKey = `images_page_${page}_limit_${limit}_projectId_${
        projectId || "all"
    }`;

    if (cache[cacheKey]) {
        logger.info(`Serving images from cache: ${cacheKey}`);
        return NextResponse.json(cache[cacheKey].data);
    }

    try {
        const where = projectId
            ? { projectId: parseInt(projectId) } // Show all images for a specific project
            : { displayInGallery: true }; // Only gallery-visible images otherwise
        const images = await prisma.image.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });
        logger.info(
            `Fetched images: page=${page}, limit=${limit}, projectId=${
                projectId || "all"
            }`
        );
        cache[cacheKey] = { data: images };
        return NextResponse.json(images);
    } catch (error) {
        logger.error(`Failed to fetch images: ${error.message}`);
        return NextResponse.json(
            {
                success: false,
                error: { message: error.message, code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const contentType = request.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: "Invalid content type",
                        code: "BAD_REQUEST",
                    },
                },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file");
        const title = formData.get("title");
        const description = formData.get("description");
        const projectId = formData.get("projectId") || null;

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    error: { message: "No file uploaded", code: "BAD_REQUEST" },
                },
                { status: 400 }
            );
        }

        const imageUrl = await uploadFile(file);
        const newImage = await prisma.image.create({
            data: {
                url: imageUrl,
                title,
                description,
                projectId: projectId ? parseInt(projectId) : null,
                displayInGallery: true, // Default for standalone images
            },
        });
        logger.info(`Image uploaded: ${newImage.id}`);
        Object.keys(cache).forEach((key) => delete cache[key]); // Invalidate cache
        return NextResponse.json({ success: true, data: newImage });
    } catch (error) {
        logger.error(`Image upload failed: ${error.message}`);
        return NextResponse.json(
            {
                success: false,
                error: { message: error.message, code: "UPLOAD_ERROR" },
            },
            { status: 400 }
        );
    }
}
