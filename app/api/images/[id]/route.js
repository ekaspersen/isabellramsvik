// app/api/images/[id]/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const image = await prisma.image.findUnique({
            where: { id: parseInt(id) },
        });
        return NextResponse.json(image);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = await params;
    try {
        const data = await request.json();
        const updatedImage = await prisma.image.update({
            where: { id: parseInt(id) },
            data,
        });
        return NextResponse.json(updatedImage);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        await prisma.image.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ message: "Image deleted" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
