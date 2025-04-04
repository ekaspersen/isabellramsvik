"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function NotFound() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotFoundContent />
        </Suspense>
    );
}

function NotFoundContent() {
    const searchParams = useSearchParams();
    const errorMsg = searchParams.get("error");
    return <div>Not found, error: {errorMsg || "Page not found"}</div>;
}
