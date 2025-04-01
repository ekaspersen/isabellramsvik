// app/api/projects/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: { images: true },
        });
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get("title");
        const description = formData.get("description");
        const imagesCount = parseInt(formData.get("imagesCount"), 10);

        // Sørg for at upload-mappen finnes
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadedImages = [];
        for (let i = 0; i < imagesCount; i++) {
            const file = formData.get(`file_${i}`);
            const imgTitle = formData.get(`title_${i}`);
            const imgDescription = formData.get(`description_${i}`);
            if (file) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const fileName = `${Date.now()}-${file.name}`;
                const filePath = path.join(uploadDir, fileName);
                fs.writeFileSync(filePath, buffer);
                const imageUrl = `/uploads/${fileName}`;
                uploadedImages.push({
                    url: imageUrl,
                    title: imgTitle,
                    description: imgDescription,
                    position: i + 1, // Sett posisjon basert på rekkefølge ved opplasting
                });
            }
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                images: {
                    create: uploadedImages,
                },
            },
            include: { images: true },
        });

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
