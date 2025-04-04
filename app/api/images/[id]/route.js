import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import pino from "pino";
import { cache } from "@/lib/cache";

const logger = pino({ level: "info" });

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const image = await prisma.image.findUnique({
            where: { id: parseInt(id) },
        });
        if (!image) {
            logger.warn(`Image not found: ${id}`);
            return NextResponse.json(
                {
                    success: false,
                    error: { message: "Image not found", code: "NOT_FOUND" },
                },
                { status: 404 }
            );
        }
        logger.info(`Fetched image: ${id}`);
        return NextResponse.json({ success: true, data: image });
    } catch (error) {
        logger.error(`Failed to fetch image ${id}: ${error.message}`);
        return NextResponse.json(
            {
                success: false,
                error: { message: error.message, code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    const { id } = await params;
    try {
        const data = await request.json();
        const { title, description, projectId, displayInGallery } = data;
        const updatedImage = await prisma.image.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                projectId: projectId ? parseInt(projectId) : null,
                displayInGallery,
            },
        });
        logger.info(`Updated image: ${id}`);
        Object.keys(cache).forEach((key) => delete cache[key]);
        return NextResponse.json({ success: true, data: updatedImage });
    } catch (error) {
        logger.error(`Failed to update image ${id}: ${error.message}`);
        return NextResponse.json(
            {
                success: false,
                error: { message: error.message, code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        await prisma.image.delete({ where: { id: parseInt(id) } });
        logger.info(`Deleted image: ${id}`);
        Object.keys(cache).forEach((key) => delete cache[key]);
        return NextResponse.json({ success: true, message: "Image deleted" });
    } catch (error) {
        logger.error(`Failed to delete image ${id}: ${error.message}`);
        return NextResponse.json(
            {
                success: false,
                error: { message: error.message, code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}
