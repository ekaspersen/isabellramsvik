// app/api/projects/[id]/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const project = await prisma.project.findUnique({
            where: { id: parseInt(id) },
            include: { images: true },
        });
        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = await params;
    try {
        const data = await request.json();
        const { title, description, images } = data;

        // Oppdater prosjektets tittel og beskrivelse
        await prisma.project.update({
            where: { id: parseInt(id) },
            data: { title, description },
        });

        // Oppdater hvert bilde med ny rekkefølge og eventuelle endringer
        for (const img of images) {
            await prisma.image.update({
                where: { id: parseInt(img.id) },
                data: {
                    title: img.title,
                    description: img.description,
                    position: img.position, // oppdatert posisjon
                },
            });
        }

        const updatedProject = await prisma.project.findUnique({
            where: { id: parseInt(id) },
            include: { images: true },
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        await prisma.project.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ message: "Project deleted" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
