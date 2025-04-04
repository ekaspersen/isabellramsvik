// app/components/icons/PlussAdd.jsx
import React from "react";

export default function PlussAdd() {
    return (
        <div className="w-24 h-24 bg-blue-600 text-white flex items-center justify-center rounded-full">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
            </svg>
        </div>
    );
}
