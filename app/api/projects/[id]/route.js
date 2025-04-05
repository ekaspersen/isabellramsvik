// app/api/projects/[id]/route.js
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import pino from "pino";
import { cache } from "@/lib/cache";

const logger = pino({ level: "info" });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request, { params }) {
    const { id } = params;
    try {
        const project = await prisma.project.findUnique({
            where: { id: parseInt(id) },
            include: { images: true },
        });
        if (!project) {
            logger.warn(`Project not found: ${id}`);
            return NextResponse.json(
                {
                    success: false,
                    error: { message: "Project not found", code: "NOT_FOUND" },
                },
                { status: 404 }
            );
        }
        logger.info(`Fetched project: ${id}`);
        return NextResponse.json({ success: true, data: project });
    } catch (error) {
        logger.error(`Failed to fetch project ${id}: ${error.message}`);
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
        const { title, description, images } = await request.json();
        const updatedProject = await prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                images: images
                    ? {
                          update: images.map((img) => ({
                              where: { id: parseInt(img.id) },
                              data: {
                                  title: img.title,
                                  description: img.description,
                                  position: img.position,
                                  displayInGallery:
                                      img.displayInGallery ?? undefined,
                              },
                          })),
                      }
                    : undefined,
            },
            include: { images: true },
        });
        logger.info(`Updated project: ${id}`);
        Object.keys(cache).forEach((key) => delete cache[key]);
        return NextResponse.json({ success: true, data: updatedProject });
    } catch (error) {
        logger.error(`Failed to update project ${id}: ${error.message}`);
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
        const project = await prisma.project.findUnique({
            where: { id: parseInt(id) },
            include: { images: true },
        });
        if (!project) {
            logger.warn(`Project not found: ${id}`);
            return NextResponse.json(
                {
                    success: false,
                    error: { message: "Project not found", code: "NOT_FOUND" },
                },
                { status: 404 }
            );
        }

        // Delete all associated images from Cloudinary
        for (const image of project.images) {
            if (image.cloudinaryId) {
                await cloudinary.uploader.destroy(image.cloudinaryId, {
                    resource_type: "image",
                });
            }
        }

        await prisma.project.delete({ where: { id: parseInt(id) } });
        logger.info(`Deleted project: ${id}`);
        Object.keys(cache).forEach((key) => delete cache[key]);
        return NextResponse.json({ success: true, message: "Project deleted" });
    } catch (error) {
        logger.error(`Failed to delete project ${id}: ${error.message}`);
        return NextResponse.json(
            {
                success: false,
                error: { message: "Delete failed", code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}
