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
    const skip = (page - 1) * limit;
    const cacheKey = `projects_page_${page}_limit_${limit}`;

    if (cache[cacheKey]) {
        logger.info(`Serving projects from cache: ${cacheKey}`);
        return NextResponse.json(cache[cacheKey].data);
    }

    try {
        const projects = await prisma.project.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                images: {
                    where: { displayInGallery: true }, // Only include gallery-visible images
                },
            },
        });
        logger.info(`Fetched projects: page=${page}, limit=${limit}`);
        cache[cacheKey] = { data: projects };
        return NextResponse.json(projects);
    } catch (error) {
        logger.error(`Failed to fetch projects: ${error.message}`);
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
        const title = formData.get("title");
        const description = formData.get("description");
        const imagesCount = parseInt(formData.get("imagesCount") || "0", 10);

        const uploadedImages = [];
        for (let i = 0; i < imagesCount; i++) {
            const file = formData.get(`file_${i}`);
            const imgTitle = formData.get(`title_${i}`);
            const imgDescription = formData.get(`description_${i}`);
            const displayInGallery =
                formData.get(`displayInGallery_${i}`) === "true";
            if (file) {
                const imageUrl = await uploadFile(file);
                uploadedImages.push({
                    url: imageUrl,
                    title: imgTitle,
                    description: imgDescription,
                    position: i + 1,
                    displayInGallery,
                });
            }
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                images: { create: uploadedImages },
            },
        });
        logger.info(`Project created: ${project.id}`);
        Object.keys(cache).forEach((key) => delete cache[key]); // Invalidate cache
        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        logger.error(`Project creation failed: ${error.message}`);
        return NextResponse.json(
            {
                success: false,
                error: { message: error.message, code: "UPLOAD_ERROR" },
            },
            { status: 400 }
        );
    }
}
