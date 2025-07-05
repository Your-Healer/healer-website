import React from 'react';
import { cn } from '../../lib/utils';
import MarkdownText from './MarkdownText';

interface SimpleTextProps {
    text: string;
    isBot?: boolean;
    className?: string;
}

/**
 * A simple component to display text with markdown formatting
 */
const SimpleText: React.FC<SimpleTextProps> = ({
    text = '',
    isBot = false,
    className
}) => {
    if (!text) {
        return <p className={cn("text-gray-500", className)}>No content</p>;
    }

    // Simply use the MarkdownText component for consistent formatting
    return <MarkdownText text={text} isBot={isBot} className={className} />;
};

export default SimpleText;