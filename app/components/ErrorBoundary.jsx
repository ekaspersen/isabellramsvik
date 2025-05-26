// app/ErrorBoundary.jsx
import React from "react";

export class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("ErrorBoundary caught an error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-primary-light text-center p-4">
                    <p>
                        En feil oppstod:{" "}
                        {this.state.error?.message || "Ukjent feil"}
                    </p>
                    <p>Vennligst prøv igjen senere.</p>
                </div>
            );
        }
        return this.props.children;
    }
}
