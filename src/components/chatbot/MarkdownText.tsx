import React from 'react';
import { cn } from '../../lib/utils';

interface MarkdownTextProps {
    text: string;
    isBot?: boolean;
    className?: string;
}

/**
 * A component that displays text with basic markdown formatting
 */
const MarkdownText: React.FC<MarkdownTextProps> = ({
    text = '',
    isBot = false,
    className
}) => {
    if (!text) {
        return <p className={cn("text-gray-500", className)}>No content</p>;
    }

    // Process markdown formatting
    const processMarkdown = (line: string) => {
        // Process bold: **text** to <strong>text</strong>
        let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Process italic: *text* to <em>text</em>
        processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Process links: [text](url) to <a href="url">text</a>
        processed = processed.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline text-blue-600">$1</a>'
        );

        return processed;
    };

    return (
        <div className={cn("prose prose-sm max-w-none", className)}>
            {text.split('\n').map((line, i) => (
                <p
                    key={i}
                    className={isBot ? "text-gray-800" : "text-white"}
                    dangerouslySetInnerHTML={{ __html: line ? processMarkdown(line) : " " }}
                />
            ))}
        </div>
    );
};

export default MarkdownText;