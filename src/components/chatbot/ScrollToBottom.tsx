import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface ScrollToBottomProps {
    onPress: () => void;
    visible: boolean;
    unreadCount?: number;
}

const ScrollToBottom: React.FC<ScrollToBottomProps> = ({
    onPress,
    visible,
    unreadCount = 0
}) => {
    // Animation for pulse effect when there are unread messages
    const [isPulsing, setIsPulsing] = useState(false);

    useEffect(() => {
        if (unreadCount > 0) {
            // Start pulse animation
            const intervalId = setInterval(() => {
                setIsPulsing(prev => !prev);
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [unreadCount]);

    if (!visible) return null;

    return (
        <button
            onClick={onPress}
            className={cn(
                "absolute bottom-4 right-4 bg-white shadow-md rounded-full p-2",
                "border border-gray-200 transition-all duration-200 flex items-center justify-center",
                "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400",
                "opacity-0 scale-90 animate-in fade-in zoom-in duration-300"
            )}
        >
            <ChevronDown className="h-5 w-5 text-blue-600" />
            {unreadCount > 0 && (
                <span
                    className={cn(
                        "absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full",
                        "min-w-[18px] h-[18px] flex items-center justify-center",
                        isPulsing ? "animate-pulse" : ""
                    )}
                >
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </button>
    );
};

export default ScrollToBottom;
