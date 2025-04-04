import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import pino from "pino";
import { cache } from "@/lib/cache";

const logger = pino({ level: "info" });

export async function GET(request, { params }) {
    const { id } = await params;
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
        const { title, description, images } = data;

        await prisma.project.update({
            where: { id: parseInt(id) },
            data: { title, description },
        });

        if (images) {
            for (const img of images) {
                await prisma.image.update({
                    where: { id: parseInt(img.id) },
                    data: {
                        title: img.title,
                        description: img.description,
                        position: img.position,
                        projectId: parseInt(id), // Ensure projectId remains set
                    },
                });
            }
        }

        const updatedProject = await prisma.project.findUnique({
            where: { id: parseInt(id) },
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
                error: { message: error.message, code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        await prisma.project.delete({ where: { id: parseInt(id) } });
        logger.info(`Deleted project: ${id}`);
        Object.keys(cache).forEach((key) => delete cache[key]);
        return NextResponse.json({ success: true, message: "Project deleted" });
    } catch (error) {
        logger.error(`Failed to delete project ${id}: ${error.message}`);
        return NextResponse.json(
            {
                success: false,
                error: { message: error.message, code: "DATABASE_ERROR" },
            },
            { status: 500 }
        );
    }
}
