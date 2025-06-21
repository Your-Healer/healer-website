import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
    variant?: "default" | "fullscreen" | "inline" | "overlay" | "card";
    size?: "sm" | "md" | "lg" | "xl";
    message?: string;
    className?: string;
    showSpinner?: boolean;
    children?: React.ReactNode;
}

const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-16 w-16",
    xl: "h-32 w-32"
};

const Loading: React.FC<LoadingProps> = ({
    variant = "default",
    size = "lg",
    message = "Đang tải...",
    className,
    showSpinner = true,
    children
}) => {
    const spinnerSize = sizeClasses[size];

    const LoadingContent = () => (
        <div className="text-center">
            {showSpinner && (
                <div className="flex justify-center mb-4">
                    <Loader2 className={cn("animate-spin text-blue-600", spinnerSize)} />
                </div>
            )}
            {message && (
                <p className={cn(
                    "text-gray-600",
                    size === "sm" ? "text-xs" :
                        size === "md" ? "text-sm" :
                            size === "lg" ? "text-base" : "text-lg"
                )}>
                    {message}
                </p>
            )}
            {children}
        </div>
    );

    switch (variant) {
        case "fullscreen":
            return (
                <div className={cn(
                    "min-h-screen flex items-center justify-center bg-gray-50",
                    className
                )}>
                    <LoadingContent />
                </div>
            );

        case "overlay":
            return (
                <div className={cn(
                    "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
                    className
                )}>
                    <div className="bg-white rounded-lg p-8 shadow-xl">
                        <LoadingContent />
                    </div>
                </div>
            );

        case "card":
            return (
                <div className={cn(
                    "bg-white rounded-lg border shadow-sm p-8 flex items-center justify-center",
                    className
                )}>
                    <LoadingContent />
                </div>
            );

        case "inline":
            return (
                <div className={cn("flex items-center gap-2", className)}>
                    {showSpinner && (
                        <Loader2 className={cn("animate-spin text-blue-600", spinnerSize)} />
                    )}
                    {message && (
                        <span className={cn(
                            "text-gray-600",
                            size === "sm" ? "text-xs" :
                                size === "md" ? "text-sm" : "text-base"
                        )}>
                            {message}
                        </span>
                    )}
                    {children}
                </div>
            );

        default:
            return (
                <div className={cn(
                    "flex items-center justify-center py-8",
                    className
                )}>
                    <LoadingContent />
                </div>
            );
    }
};

// Specific loading components for common use cases
export const PageLoading = ({ message = "Đang tải trang..." }: { message?: string }) => (
    <Loading variant="fullscreen" size="xl" message={message} />
);

export const DashboardLoading = () => (
    <Loading
        variant="fullscreen"
        size="xl"
        message="Đang tải bảng điều khiển..."
        children={
            <p className="mt-2 text-sm text-gray-500">
                Đang xác định vai trò người dùng và quyền hạn
            </p>
        }
    />
);

export const AuthLoading = () => (
    <Loading
        variant="fullscreen"
        size="xl"
        message="Đang kiểm tra xác thực..."
    />
);

export const TableLoading = () => (
    <Loading
        variant="card"
        size="md"
        message="Đang tải dữ liệu..."
        className="min-h-[200px]"
    />
);

export const ButtonLoading = ({ message = "Đang xử lý..." }: { message?: string }) => (
    <Loading
        variant="inline"
        size="sm"
        message={message}
    />
);

export const ModalLoading = ({ message = "Đang tải..." }: { message?: string }) => (
    <Loading
        variant="overlay"
        size="lg"
        message={message}
    />
);

export const SectionLoading = ({ message = "Đang tải..." }: { message?: string }) => (
    <Loading
        variant="default"
        size="md"
        message={message}
        className="py-12"
    />
);

export default Loading;