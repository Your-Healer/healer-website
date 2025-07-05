import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQueryChat } from "@/hooks/use-chat-bot";
import { useChatSession } from "@/hooks/use-chat-session";
import { ChatMessage } from "@/models/rag-models";
import { parseLLMResponse } from "@/utils/safe-parser";
import {
    Send,
    MessageSquare,
    X,
    Trash2,
    AlertCircle,
    Loader2,
    Bot,
    RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import DiseaseQuestions from "./DiseaseQuestions";
import ScrollToBottom from "./ScrollToBottom";
import TypingIndicator from "./TypingIndicator";
import SimpleText from "./SimpleText";

// Error boundary component
class ErrorBoundary extends React.Component<{
    children: React.ReactNode;
    fallback: React.ReactNode;
}> {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log the error to the console
        console.error("Chatbot error caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Return fallback UI
            return this.props.fallback;
        }

        return this.props.children;
    }
}

// Main chatbot component
const FixedChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const [hasError, setHasError] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const isUserScrolling = useRef(false);
    const lastMessageCount = useRef(0);
    const shouldAutoScrollRef = useRef(true);

    const queryChat = useQueryChat();
    const {
        currentSession,
        isLoading: sessionLoading,
        addMessage,
        updateMessage,
        clearCurrentSession,
        createNewSession,
    } = useChatSession();

    const quickSuggestions = [
        "Tôi bị sốt phải làm sao?",
        "Làm thế nào để có chế độ ăn lành mạnh?",
        "Làm cách nào để giảm stress?",
        "Thuốc nên uống trước hay sau khi ăn?",
        "Nên tập thể dục bao nhiêu mỗi ngày?",
        "Làm thế nào để ngủ ngon hơn?",
    ];

    // Scroll to bottom of chat
    const scrollToBottom = useCallback((animated: boolean = true) => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTo({
                    top: chatContainerRef.current.scrollHeight,
                    behavior: animated ? 'smooth' : 'auto',
                });
            }
        }, 100);
    }, []);

    const handleAnimationComplete = useCallback(() => {
        setAnimatingMessageId(null);
        if (shouldAutoScroll && !isUserScrolling.current) {
            setTimeout(() => {
                scrollToBottom(true);
            }, 200);
        }
    }, [shouldAutoScroll, scrollToBottom]);

    const handleAnimationProgress = useCallback(() => {
        if (shouldAutoScrollRef.current && !isUserScrolling.current) {
            setTimeout(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTo({
                        top: chatContainerRef.current.scrollHeight,
                        behavior: 'smooth',
                    });
                }
            }, 50);
        }
    }, []);

    const handleSuggestionPress = (suggestion: string) => {
        if (!isProcessing && !queryChat.isPending) {
            sendMessage(suggestion);
        }
    };

    const clearChat = () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này?')) {
            clearCurrentSession();
            toast.success("Đã xóa cuộc trò chuyện");
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

        if (isAtBottom) {
            setShowScrollToBottom(false);
            setUnreadMessages(0);
            setShouldAutoScroll(true);
            shouldAutoScrollRef.current = true;
        } else {
            setShowScrollToBottom(true);
            setShouldAutoScroll(false);
            shouldAutoScrollRef.current = false;
        }
    };

    const handleScrollBeginDrag = () => {
        isUserScrolling.current = true;
        setShouldAutoScroll(false);
        shouldAutoScrollRef.current = false;
    };

    const handleScrollEndDrag = () => {
        setTimeout(() => {
            isUserScrolling.current = false;
        }, 100);
    };

    const handleScrollToBottomPress = () => {
        scrollToBottom(true);
        setUnreadMessages(0);
        setShouldAutoScroll(true);
        shouldAutoScrollRef.current = true;
    };

    const getCurrentTimestamp = () => {
        return new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || queryChat.isPending || isProcessing) return;

        const trimmedMessage = messageText.trim();
        let loadingMessageId = '';

        try {
            setIsProcessing(true);
            console.log("Sending message:", trimmedMessage);

            const userMessageId = await addMessage(trimmedMessage, false);
            setMessage('');

            // Auto-scroll to bottom for user messages
            if (!isUserScrolling.current) {
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
            }

            loadingMessageId = await addMessage("Đang tìm câu trả lời...", true, true);

            if (!isUserScrolling.current) {
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
            }

            const response = await queryChat.mutateAsync({
                question: trimmedMessage,
                language: "vietnamese",
                enhance_retrieval: true,
            });

            console.log('RAG Response:', response);

            // Safely parse sources with error handling
            let sources: any[] = [];
            try {
                if (response.sources && Array.isArray(response.sources)) {
                    sources = parseLLMResponse(response.sources);
                    console.log('Parsed sources:', sources);
                } else {
                    console.log('No sources available or sources is not an array');
                }
            } catch (parseError) {
                console.error('Error parsing sources:', parseError);
                sources = []; // Fallback to empty array
            }

            const answer = response.answer || "Xin lỗi, tôi không thể trả lời câu hỏi này vào lúc này.";

            if (loadingMessageId) {
                await updateMessage(loadingMessageId, {
                    text: answer,
                    isLoading: false,
                    sources: sources.length > 0 ? sources : undefined
                });

                // Start "animation" (but we're using SimpleText now)
                setTimeout(() => {
                    setAnimatingMessageId(loadingMessageId);
                    console.log("Bot response updated successfully for", loadingMessageId);
                }, 100);
            } else {
                console.warn("No loading message ID, adding new response message");
                const newMessageId = await addMessage(answer, true, false, sources.length > 0 ? sources : undefined);
                setTimeout(() => {
                    setAnimatingMessageId(newMessageId);
                    console.log("Animation started for newly added message:", newMessageId);
                }, 100);
            }

            // Auto-scroll to bottom for bot responses if user isn't scrolling
            if (!isUserScrolling.current) {
                setTimeout(() => {
                    scrollToBottom();
                }, 200);
            } else {
                // User is scrolled up, increment unread count
                setUnreadMessages(prev => prev + 1);
            }

        } catch (error: any) {
            console.error('Chat error:', error);
            let errorMessage = "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn.";

            // Better error type checking
            const errorString = error?.message || error?.toString() || '';

            if (errorString.includes('network') || errorString.includes('Network')) {
                errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối của bạn.";
            } else if (errorString.includes('timeout') || errorString.includes('Timeout')) {
                errorMessage = "Yêu cầu hết thời gian chờ. Vui lòng thử lại sau.";
            } else if (errorString.includes('unavailable') || errorString.includes('404')) {
                errorMessage = "Dịch vụ hiện không khả dụng. Vui lòng thử lại sau.";
            }

            toast.error(errorMessage);

            // Handle error message
            if (loadingMessageId) {
                try {
                    await updateMessage(loadingMessageId, {
                        text: errorMessage,
                        isLoading: false,
                    });
                    setAnimatingMessageId(loadingMessageId);
                } catch (updateError) {
                    console.error("Failed to update loading message with error, adding new error message");
                    const errorMessageId = await addMessage(errorMessage, true);
                    setAnimatingMessageId(errorMessageId);
                }
            } else {
                const errorMessageId = await addMessage(errorMessage, true);
                setAnimatingMessageId(errorMessageId);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    // Safely render a message
    const renderMessage = useCallback((msg: ChatMessage) => {
        try {
            const isCurrentlyAnimating = animatingMessageId === msg.id;

            // Debug logging
            console.log(`Rendering message: ${msg.id}`, {
                isBot: msg.isBot,
                isAnimating: isCurrentlyAnimating,
                textLength: msg.text?.length
            });

            return (
                <div
                    key={msg.id}
                    className={cn(
                        "flex w-full mb-4",
                        msg.isBot ? "justify-start" : "justify-end"
                    )}
                >
                    {msg.isBot && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-2 flex-shrink-0">
                            <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                    )}

                    <div
                        className={cn(
                            "max-w-[85%] p-4 rounded-xl",
                            msg.isBot
                                ? "bg-gray-100 rounded-bl-none"
                                : "bg-blue-600 text-white rounded-br-none"
                        )}
                    >
                        {msg.isLoading ? (
                            <div className="flex items-center py-2">
                                <TypingIndicator />
                            </div>
                        ) : (
                            <div className="message-content">
                                {/* Always use SimpleText now for safety */}
                                <SimpleText
                                    text={msg.text || ''}
                                    isBot={msg.isBot}
                                />

                                {msg.sources && msg.sources.length > 0 && !isCurrentlyAnimating && (
                                    <DiseaseQuestions
                                        diseases={msg.sources}
                                        onQuestionPress={(q) => sendMessage(q)}
                                    />
                                )}

                                <div className={cn(
                                    "text-xs mt-1",
                                    msg.isBot ? "text-gray-500 text-left" : "text-gray-200 text-right"
                                )}>
                                    {msg.timestamp}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        } catch (error) {
            console.error("Error rendering message:", error);
            return (
                <div key={msg.id || 'error'} className="flex w-full mb-4 justify-start">
                    <div className="max-w-[85%] p-4 rounded-xl bg-red-50 rounded-bl-none">
                        <p className="text-sm text-red-600">Error displaying message</p>
                    </div>
                </div>
            );
        }
    }, [animatingMessageId, sendMessage]);

    useEffect(() => {
        const currentMessageCount = currentSession?.messages?.length || 0;

        // Auto-scroll on first load or when messages are added and user should auto-scroll
        if (currentMessageCount > 0 && currentMessageCount !== lastMessageCount.current) {
            if (shouldAutoScrollRef.current && !isUserScrolling.current) {
                // Delay scroll to allow UI to render
                setTimeout(() => {
                    scrollToBottom(true);
                }, 300);
            } else if (currentMessageCount > lastMessageCount.current) {
                // New message arrived while user is scrolled up
                const newMessagesCount = currentMessageCount - lastMessageCount.current;
                setUnreadMessages(prev => prev + newMessagesCount);
            }
            lastMessageCount.current = currentMessageCount;
        }
    }, [currentSession?.messages?.length, scrollToBottom]);

    // Initialize chat session when component mounts
    useEffect(() => {
        if (!sessionLoading && !currentSession) {
            createNewSession();
        }
    }, [sessionLoading, currentSession, createNewSession]);

    // Toggle chat window
    const toggleChat = () => {
        try {
            setIsOpen(prevIsOpen => {
                const newIsOpen = !prevIsOpen;
                console.log("Toggle chat window:", { prevIsOpen, newIsOpen });
                return newIsOpen;
            });

            // If opening the chat and we have a session, scroll to bottom
            if (!isOpen && currentSession) {
                setTimeout(() => {
                    scrollToBottom();
                    console.log("Scrolled to bottom after opening");
                }, 300);
            }
        } catch (error) {
            console.error("Error toggling chat:", error);
            setHasError(true);
        }
    };

    // Simple error fallback component
    const ErrorFallback = () => (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-red-300">
            <div className="flex items-center text-red-600 mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Something went wrong</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">The chatbot encountered an error. Please try reloading the page.</p>
            <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="w-full"
            >
                <RefreshCw className="h-4 w-4 mr-2" /> Reload Page
            </Button>
        </div>
    );

    // If there's an error, show the fallback UI
    if (hasError) {
        return <ErrorFallback />;
    }

    return (
        <ErrorBoundary fallback={<ErrorFallback />}>
            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
                {/* Chat bubble button */}
                <button
                    onClick={toggleChat}
                    className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 ease-in-out",
                        isOpen ? "bg-gray-600 rotate-360" : "bg-blue-600 hover:bg-blue-700",
                        "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                    )}
                >
                    {isOpen ? (
                        <X className="h-6 w-6 text-white" />
                    ) : (
                        <>
                            <MessageSquare className="h-6 w-6 text-white" />
                            {unreadMessages > 0 && (
                                <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                                    {unreadMessages}
                                </div>
                            )}
                        </>
                    )}
                </button>

                {/* Chat window */}
                {isOpen && (
                    <Card className="w-[350px] sm:w-[400px] h-[500px] mt-4 shadow-xl flex flex-col">
                        {/* Chat header */}
                        <div className="flex items-center justify-between p-3 border-b bg-blue-600 text-white rounded-t-lg">
                            <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src='./src/assets/images/logo.png' alt="Your Healer Logo" />
                                    <AvatarFallback>HA</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-medium text-sm">Trợ lý Healer</h3>
                                    <p className="text-xs text-blue-100">
                                        Hỗ trợ y tế • {currentSession?.messages?.length || 0} tin nhắn
                                    </p>
                                </div>
                            </div>
                            <div className="flex">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={clearChat}
                                                className="h-8 w-8 text-white hover:bg-blue-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Xóa cuộc trò chuyện</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={toggleChat}
                                                className="h-8 w-8 text-white hover:bg-blue-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Đóng</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>

                        {/* Chat messages */}
                        <div className="relative flex-grow overflow-hidden">
                            <ScrollArea
                                ref={chatContainerRef}
                                className="h-full p-4"
                                onScroll={handleScroll}
                                onMouseDown={handleScrollBeginDrag}
                                onMouseUp={handleScrollEndDrag}
                            >
                                {sessionLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                        <p className="ml-2 text-gray-500">Đang tải...</p>
                                    </div>
                                ) : (
                                    <>
                                        {currentSession?.messages && currentSession.messages.length > 0 ? (
                                            currentSession.messages.map((msg) => renderMessage(msg))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <Bot className="h-12 w-12 text-gray-300 mb-2" />
                                                <p className="text-gray-500">Chưa có tin nhắn</p>
                                            </div>
                                        )}

                                        {quickSuggestions.length > 0 && (currentSession?.messages?.length || 0) <= 1 && !isProcessing && (
                                            <div className="mt-4 mb-2">
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">Câu hỏi gợi ý</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {quickSuggestions.map((suggestion, index) => (
                                                        <button
                                                            key={index}
                                                            className={cn(
                                                                "text-sm py-1.5 px-3 rounded-full border transition-colors",
                                                                (isProcessing || queryChat.isPending)
                                                                    ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
                                                                    : "border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                                            )}
                                                            onClick={() => handleSuggestionPress(suggestion)}
                                                            disabled={isProcessing || queryChat.isPending}
                                                        >
                                                            {suggestion}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </ScrollArea>

                            <ScrollToBottom
                                visible={showScrollToBottom}
                                onPress={handleScrollToBottomPress}
                                unreadCount={unreadMessages}
                            />
                        </div>

                        {/* Input area */}
                        <div className="p-3 border-t">
                            <div className="flex items-end gap-2">
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={isProcessing ? "Đang tìm câu trả lời..." : "Nhập câu hỏi của bạn..."}
                                    disabled={isProcessing || queryChat.isPending}
                                    className={cn(
                                        "min-h-[44px] max-h-[120px] resize-none py-2",
                                        (isProcessing || queryChat.isPending) && "bg-gray-100 text-gray-500"
                                    )}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage(message);
                                        }
                                    }}
                                />
                                <Button
                                    size="icon"
                                    disabled={!message.trim() || isProcessing || queryChat.isPending}
                                    className={cn(
                                        "rounded-full h-10 w-10 flex-shrink-0",
                                        (!message.trim() || isProcessing || queryChat.isPending) && "opacity-50"
                                    )}
                                    onClick={() => sendMessage(message)}
                                >
                                    {(isProcessing || queryChat.isPending) ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 text-right">
                                {message.length}/1000 ký tự
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default FixedChatbot;