import React, { useRef, useState, useMemo, useEffect, useContext } from "react";
import Chat, { ChatMessage } from "../../library/Chat";
import { useSocket } from "./SocketContext";

type ChatState = {
  messages: ChatMessage[];
  sendMessage: (message: string) => void;
};

const ChatContext = React.createContext<ChatState | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const ChatInstance = useRef(new Chat(socket)).current;

  useEffect(() => {
    ChatInstance.addEventListener("onReceive", setMessages);
    ChatInstance.addEventListener("onSend", setMessages);
    return () => {
      ChatInstance.removeEventListener("onReceive", setMessages);
      ChatInstance.removeEventListener("onSend", setMessages);
    };
  }, [ChatInstance]);

  const chatContext = useMemo(() => {
    return {
      messages,
      sendMessage: ChatInstance.send,
    };
  }, [messages, ChatInstance]);

  return (
    <ChatContext.Provider value={chatContext}>{children}</ChatContext.Provider>
  );
};
