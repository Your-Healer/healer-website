import React from 'react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
    className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
    return (
        <div className={cn("flex items-center justify-center py-2", className)}>
            <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    );
};

export default TypingIndicator;
