import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '../../lib/utils';
import MarkdownText from './MarkdownText';

interface TypewriterTextProps {
    text: string;
    speed?: number;
    isBot?: boolean;
    style?: string;
    onComplete?: () => void;
    onProgress?: () => void;
    startAnimation?: boolean;
    messageId: string;
}

/**
 * A component that displays text with a typewriter animation effect
 */
const TypewriterText: React.FC<TypewriterTextProps> = ({
    text = '',
    speed = 30,
    isBot = false,
    style,
    onComplete,
    onProgress,
    startAnimation = true,
    messageId
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isDone, setIsDone] = useState(false);

    // Store the full text and message ID to track changes
    const fullTextRef = useRef(text);
    const messageIdRef = useRef(messageId);

    // Use refs for callbacks to avoid dependency changes
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    const onProgressRef = useRef(onProgress);
    onProgressRef.current = onProgress;

    // Effect to handle animation
    useEffect(() => {
        // Reset state when the message changes
        if (messageId !== messageIdRef.current || text !== fullTextRef.current) {
            fullTextRef.current = text;
            messageIdRef.current = messageId;
            setDisplayedText('');
            setIsDone(false);

            // If animation is disabled, show the full text immediately
            if (!startAnimation) {
                setDisplayedText(text);
                setIsDone(true);
                if (onCompleteRef.current) onCompleteRef.current();
                return;
            }
        }

        // Skip animation if it's already done
        if (isDone) return;

        // Skip animation if it shouldn't start
        if (!startAnimation) {
            setDisplayedText(text);
            setIsDone(true);
            if (onCompleteRef.current) onCompleteRef.current();
            return;
        }

        // Start the animation
        if (startAnimation && !isAnimating && displayedText.length < text.length) {
            console.log(`Starting animation for message: ${messageId}`);
            setIsAnimating(true);

            let index = displayedText.length;
            const timer = setInterval(() => {
                if (index < text.length) {
                    setDisplayedText(text.substring(0, index + 1));
                    index++;

                    // Call the progress callback occasionally
                    if (index % 5 === 0 && onProgressRef.current) {
                        onProgressRef.current();
                    }
                } else {
                    clearInterval(timer);
                    setIsAnimating(false);
                    setIsDone(true);

                    // Animation complete
                    if (onCompleteRef.current) {
                        onCompleteRef.current();
                    }
                    console.log(`Animation complete for message: ${messageId}`);
                }
            }, speed);

            // Clean up the timer on unmount
            return () => clearInterval(timer);
        }
    }, [text, messageId, startAnimation, speed, displayedText.length, isAnimating, isDone]);

    return (
        <div className={style || ""}>
            <MarkdownText text={displayedText} isBot={isBot} />
            {isAnimating && (
                <span className="inline-block animate-pulse ml-1">▊</span>
            )}
        </div>
    );
};

export default React.memo(TypewriterText, (prevProps, nextProps) => {
    // Only re-render when specific props change
    return (
        prevProps.text === nextProps.text &&
        prevProps.messageId === nextProps.messageId &&
        prevProps.startAnimation === nextProps.startAnimation
    );
});
