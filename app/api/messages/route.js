// app/api/messages/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import pino from "pino";
import { cache } from "@/lib/cache";

const logger = pino({ level: "info" });

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const read =
        searchParams.get("read") === "true"
            ? true
            : searchParams.get("read") === "false"
            ? false
            : undefined;
    const skip = (page - 1) * limit;
    const cacheKey = `messages_page_${page}_limit_${limit}_read_${read}`;

    if (cache[cacheKey]) {
        logger.info(`Serving messages from cache: ${cacheKey}`);
        return NextResponse.json(cache[cacheKey].data);
    }

    try {
        const where = read !== undefined ? { read } : {};
        const messages = await prisma.message.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });
        logger.info(
            `Fetched messages: page=${page}, limit=${limit}, read=${read}`
        );
        cache[cacheKey] = { data: messages };
        return NextResponse.json(messages);
    } catch (error) {
        logger.error(`Failed to fetch messages: ${error.message}`);
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
        const data = await request.json();
        const newMessage = await prisma.message.create({ data });
        logger.info(`Message created: ${newMessage.id}`);
        Object.keys(cache).forEach((key) => delete cache[key]);
        return NextResponse.json({ success: true, data: newMessage });
    } catch (error) {
        logger.error(`Message creation failed: ${error.message}`);
        return NextResponse.json(
            {
                success: false,
                error: { message: error.message, code: "SERVER_ERROR" },
            },
            { status: 500 }
        );
    }
}
