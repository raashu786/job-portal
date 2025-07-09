// hooks/useTypingNotification.ts
import { useEffect, useRef } from "react";
import { useChatStore } from "../../Services/MessageService";


export const useTypingNotification = (receiverId: number) => {
  const { sendTypingNotification } = useChatStore();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const notifyTyping = (isTyping: boolean) => {
    sendTypingNotification(receiverId, isTyping);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingNotification(receiverId, false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      // Clear typing status when component unmounts
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        sendTypingNotification(receiverId, false);
      }
    };
  }, [receiverId, sendTypingNotification]);

  return { notifyTyping };
};