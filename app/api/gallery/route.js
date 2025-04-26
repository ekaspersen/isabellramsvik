import { NextResponse } from "next/server";
import galleryData from "./galleryData.json";

export async function GET(request) {
    const { searchParams, pathname } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Determine the endpoint based on pathname
    const endpoint = pathname.includes("/images") ? "images" : "projects";
    const id = pathname.match(/\/(\d+)$/)?.[1];

    try {
        if (id) {
            // Fetch specific item by ID
            const data = galleryData[endpoint].find(
                (item) => item.id === parseInt(id)
            );
            if (!data) {
                return NextResponse.json(
                    {
                        success: false,
                        error: {
                            message: `${endpoint.slice(0, -1)} not found`,
                        },
                    },
                    { status: 404 }
                );
            }
            // For projects, enrich with image data
            if (endpoint === "projects") {
                const images = data.imageIds
                    .map((imageId) =>
                        galleryData.images.find((img) => img.id === imageId)
                    )
                    .filter(Boolean);
                return NextResponse.json({
                    success: true,
                    data: { ...data, images },
                });
            }
            return NextResponse.json({ success: true, data });
        } else {
            // Fetch paginated list
            let items = galleryData[endpoint];
            if (endpoint === "projects") {
                // Enrich projects with image data
                items = items.map((project) => ({
                    ...project,
                    images: project.imageIds
                        .map((imageId) =>
                            galleryData.images.find((img) => img.id === imageId)
                        )
                        .filter(Boolean),
                }));
            }
            const paginatedItems = items.slice(skip, skip + limit);
            const total = items.length;
            return NextResponse.json({
                success: true,
                data: paginatedItems,
                meta: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            });
        }
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return NextResponse.json(
            { success: false, error: { message: "Fetch failed" } },
            { status: 500 }
        );
    }
}
