import { useState, useEffect, useCallback, useRef } from "react";
import { ChatMessage } from "@/models/rag-models";
import { RagParsedDiseaseData } from "@/utils/types";

interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: string;
    updatedAt: string;
}

// LocalStorage keys
const CHAT_SESSIONS_KEY = "healer_chat_sessions";
const CURRENT_SESSION_KEY = "healer_current_session_id";
const MAX_SESSIONS = 50;
const MAX_MESSAGES_PER_SESSION = 100;

export const useChatSession = () => {
    const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const initRef = useRef(false);

    // Generate unique message ID
    const generateMessageId = useCallback(() => {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Generate unique session ID
    const generateSessionId = useCallback(() => {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Get current timestamp
    const getCurrentTimestamp = useCallback(() => {
        return new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }, []);

    const createWelcomeMessage = useCallback((): ChatMessage => {
        const welcomeText =
            "Xin chào! Tôi là trợ lý sức khỏe của bạn. Tôi có thể giúp gì cho bạn hôm nay?";

        return {
            id: generateMessageId(),
            text: welcomeText,
            isBot: true,
            timestamp: getCurrentTimestamp(),
        };
    }, [generateMessageId, getCurrentTimestamp]);

    // Save sessions to localStorage
    const saveSessions = useCallback(async (newSessions: ChatSession[]) => {
        try {
            const limitedSessions = newSessions.slice(0, MAX_SESSIONS);
            localStorage.setItem(
                CHAT_SESSIONS_KEY,
                JSON.stringify(limitedSessions)
            );
            setSessions(limitedSessions);
        } catch (error) {
            console.error("Error saving chat sessions:", error);
        }
    }, []);

    const saveCurrentSession = useCallback(async (session: ChatSession) => {
        try {
            setCurrentSession(session);

            localStorage.setItem(CURRENT_SESSION_KEY, session.id);

            setSessions((prevSessions) => {
                const filteredSessions = prevSessions.filter(
                    (s) => s.id !== session.id
                );
                const updatedSessions = [session, ...filteredSessions];
                const limitedSessions = updatedSessions.slice(0, MAX_SESSIONS);

                // Save to localStorage asynchronously
                try {
                    localStorage.setItem(
                        CHAT_SESSIONS_KEY,
                        JSON.stringify(limitedSessions)
                    );
                } catch (err) {
                    console.error(err);
                }

                return limitedSessions;
            });
        } catch (error) {
            console.error("Error saving current session:", error);
        }
    }, []);

    // Create new session
    const createNewSession = useCallback(async (): Promise<ChatSession> => {
        const newSession: ChatSession = {
            id: generateSessionId(),
            title: "Cuộc trò chuyện mới",
            messages: [createWelcomeMessage()],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await saveCurrentSession(newSession);
        return newSession;
    }, [generateSessionId, createWelcomeMessage, saveCurrentSession]);

    // Load sessions from localStorage
    const loadSessions = useCallback(async () => {
        if (initRef.current) return;

        try {
            setIsLoading(true);
            initRef.current = true;

            const sessionsData = localStorage.getItem(CHAT_SESSIONS_KEY);
            const currentSessionId = localStorage.getItem(CURRENT_SESSION_KEY);

            if (sessionsData) {
                const parsedSessions = JSON.parse(sessionsData) as ChatSession[];
                setSessions(parsedSessions);

                if (currentSessionId) {
                    const current = parsedSessions.find((s) => s.id === currentSessionId);
                    if (current) {
                        setCurrentSession(current);
                    } else {
                        await createNewSession();
                    }
                } else {
                    await createNewSession();
                }
            } else {
                await createNewSession();
            }
        } catch (error) {
            console.error("Error loading chat sessions:", error);
            await createNewSession();
        } finally {
            setIsLoading(false);
        }
    }, [createNewSession]);

    const updateMessage = useCallback(
        async (messageId: string, updates: Partial<ChatMessage>) => {
            if (!currentSession) {
                console.warn("No current session to update message");
                return;
            }

            console.log("Updating message:", messageId, {
                text: updates.text?.substring(0, 50),
                isLoading: updates.isLoading,
            });

            // Use functional state update to ensure we get the latest state
            setCurrentSession((prevSession) => {
                if (!prevSession) {
                    console.error("No previous session found");
                    return prevSession;
                }

                const messageExists = prevSession.messages.find(
                    (msg) => msg.id === messageId
                );
                if (!messageExists) {
                    console.error(
                        "Message not found:",
                        messageId,
                        "Available messages:",
                        prevSession.messages?.map((m) => ({
                            id: m.id,
                            text: m.text.substring(0, 30),
                        }))
                    );
                    return prevSession;
                }

                const updatedMessages = prevSession.messages?.map((msg) =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                );

                const updatedSession: ChatSession = {
                    ...prevSession,
                    messages: updatedMessages,
                    updatedAt: new Date().toISOString(),
                };

                // Update sessions list synchronously
                setSessions((prevSessions) => {
                    const filteredSessions = prevSessions.filter(
                        (s) => s.id !== updatedSession.id
                    );
                    const newSessions = [updatedSession, ...filteredSessions].slice(
                        0,
                        MAX_SESSIONS
                    );

                    // Save to localStorage asynchronously
                    try {
                        localStorage.setItem(
                            CHAT_SESSIONS_KEY,
                            JSON.stringify(newSessions)
                        );
                        localStorage.setItem(CURRENT_SESSION_KEY, updatedSession.id);
                    } catch (err) {
                        console.error(err);
                    }

                    return newSessions;
                });

                return updatedSession;
            });
        },
        [currentSession]
    );

    // Add message to current session with better state management
    const addMessage = useCallback(
        async (
            text: string,
            isBot: boolean,
            isLoading: boolean = false,
            sources?: RagParsedDiseaseData[]
        ): Promise<string> => {
            return new Promise(async (resolve) => {
                try {
                    let sessionToUse = currentSession;

                    if (!sessionToUse) {
                        console.log("No current session, creating new one");
                        sessionToUse = await createNewSession();
                    }

                    const newMessage: ChatMessage = {
                        id: generateMessageId(),
                        text,
                        isBot,
                        timestamp: getCurrentTimestamp(),
                        isLoading,
                        sources,
                    };

                    console.log("Adding message:", {
                        messageId: newMessage.id,
                        text: text.substring(0, 50),
                        isBot,
                        isLoading,
                        currentSessionId: sessionToUse.id,
                    });

                    // Use functional state update for immediate UI update
                    setCurrentSession((prevSession) => {
                        const baseSession = prevSession || sessionToUse;

                        const updatedMessages = [...baseSession.messages, newMessage].slice(
                            -MAX_MESSAGES_PER_SESSION
                        );

                        const updatedSession: ChatSession = {
                            ...baseSession,
                            messages: updatedMessages,
                            updatedAt: new Date().toISOString(),
                            title:
                                baseSession.messages.length === 1 && !isBot
                                    ? text.slice(0, 30) + (text.length > 30 ? "..." : "")
                                    : baseSession.title,
                        };

                        // Update sessions list synchronously
                        setSessions((prevSessions) => {
                            const filteredSessions = prevSessions.filter(
                                (s) => s.id !== updatedSession.id
                            );
                            const newSessions = [updatedSession, ...filteredSessions].slice(
                                0,
                                MAX_SESSIONS
                            );

                            // Save to localStorage asynchronously
                            try {
                                localStorage.setItem(
                                    CHAT_SESSIONS_KEY,
                                    JSON.stringify(newSessions)
                                );
                                localStorage.setItem(
                                    CURRENT_SESSION_KEY,
                                    updatedSession.id
                                );
                            } catch (err) {
                                console.error(err);
                            }

                            return newSessions;
                        });

                        return updatedSession;
                    });

                    resolve(newMessage.id);
                } catch (error) {
                    console.error("Error adding message:", error);
                    resolve("");
                }
            });
        },
        [currentSession, generateMessageId, getCurrentTimestamp, createNewSession]
    );

    // Delete session
    const deleteSession = useCallback(
        async (sessionId: string) => {
            try {
                const newSessions = sessions.filter((s) => s.id !== sessionId);
                await saveSessions(newSessions);

                if (currentSession?.id === sessionId) {
                    if (newSessions.length > 0) {
                        await saveCurrentSession(newSessions[0]);
                    } else {
                        await createNewSession();
                    }
                }
            } catch (error) {
                console.error("Error deleting session:", error);
            }
        },
        [
            sessions,
            currentSession,
            saveSessions,
            saveCurrentSession,
            createNewSession,
        ]
    );

    // Switch to session
    const switchToSession = useCallback(
        async (sessionId: string) => {
            const session = sessions.find((s) => s.id === sessionId);
            if (session) {
                await saveCurrentSession(session);
            }
        },
        [sessions, saveCurrentSession]
    );

    // Clear current session
    const clearCurrentSession = useCallback(async () => {
        if (!currentSession) return;

        const clearedSession: ChatSession = {
            ...currentSession,
            messages: [createWelcomeMessage()],
            updatedAt: new Date().toISOString(),
            title: "New Chat",
        };

        await saveCurrentSession(clearedSession);
    }, [currentSession, createWelcomeMessage, saveCurrentSession]);

    // Export chat session
    const exportSession = useCallback(
        (sessionId: string): string | null => {
            const session = sessions.find((s) => s.id === sessionId);
            if (!session) return null;

            const exportData = {
                title: session.title,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
                messages: session.messages?.map((msg) => ({
                    text: msg.text,
                    isBot: msg.isBot,
                    timestamp: msg.timestamp,
                })),
            };

            return JSON.stringify(exportData, null, 2);
        },
        [sessions]
    );

    // Get session statistics
    const getSessionStats = useCallback(() => {
        if (!currentSession) return null;

        const totalMessages = currentSession.messages.length;
        const userMessages = currentSession.messages.filter(
            (msg) => !msg.isBot
        ).length;
        const botMessages = currentSession.messages.filter(
            (msg) => msg.isBot
        ).length;

        return {
            totalMessages,
            userMessages,
            botMessages,
            createdAt: currentSession.createdAt,
            updatedAt: currentSession.updatedAt,
        };
    }, [currentSession]);

    // Clear all sessions
    const clearAllSessions = useCallback(async () => {
        try {
            localStorage.removeItem(CHAT_SESSIONS_KEY);
            localStorage.removeItem(CURRENT_SESSION_KEY);
            setSessions([]);
            initRef.current = false;
            await createNewSession();
        } catch (error) {
            console.error("Error clearing all sessions:", error);
        }
    }, [createNewSession]);

    // Get all session titles for selection
    const getSessionTitles = useCallback(() => {
        return sessions?.map((session) => ({
            id: session.id,
            title: session.title,
            updatedAt: session.updatedAt,
            messageCount: session.messages.length,
        }));
    }, [sessions]);

    // Initialize on mount - no dependencies to prevent loops
    useEffect(() => {
        loadSessions();
    }, []);

    return {
        currentSession,
        sessions,
        isLoading,
        createNewSession,
        deleteSession,
        switchToSession,
        clearCurrentSession,
        clearAllSessions,
        addMessage,
        updateMessage,
        exportSession,
        getSessionStats,
        getSessionTitles,
    };
};
