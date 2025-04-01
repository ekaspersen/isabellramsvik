// app/api/images/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const images = await prisma.image.findMany();
        return NextResponse.json(images);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const contentType = request.headers.get("content-type") || "";
        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            const file = formData.get("file");
            const title = formData.get("title");
            const description = formData.get("description");
            const projectId = formData.get("projectId") || null;

            // Sørg for at upload-mappen finnes
            const uploadDir = path.join(process.cwd(), "public/uploads");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            let imageUrl = "";
            if (file) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const fileName = `${Date.now()}-${file.name}`;
                const filePath = path.join(uploadDir, fileName);
                fs.writeFileSync(filePath, buffer);
                imageUrl = `/uploads/${fileName}`;
            }

            const newImage = await prisma.image.create({
                data: {
                    url: imageUrl,
                    title,
                    description,
                    projectId: projectId ? parseInt(projectId) : null,
                },
            });
            return NextResponse.json(newImage);
        } else {
            // Fallback: Parse JSON
            const data = await request.json();
            const newImage = await prisma.image.create({
                data,
            });
            return NextResponse.json(newImage);
        }
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
