// app/api/messages/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { fullname, email, phone, wish } = await request.json();

        if (!fullname || !email || !wish) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const message = await prisma.message.create({
            data: {
                fullname,
                email,
                phone,
                wish,
            },
        });

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(messages);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
