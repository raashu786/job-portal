import { Badge } from "@mantine/core";
import { useChatStore } from "../../Services/MessageService";

export const TypingIndicator = ({ userId }: { userId: number }) => {
  const { typingStatus } = useChatStore();
  if (!typingStatus[userId]) return null;

  return (
    <Badge 
      color="dark-green" 
      variant="filled"
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg shadow-sm"
      style={{
        backgroundColor: '#1a2e22',
        color: '#d1fae5',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <span className="flex items-center gap-1">
        <span>typing</span>
        <span className="flex items-center gap-0.5">
          <span className="inline-block w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" 
                style={{ animationDelay: '0ms' }} />
          <span className="inline-block w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" 
                style={{ animationDelay: '200ms' }} />
          <span className="inline-block w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" 
                style={{ animationDelay: '400ms' }} />
        </span>
      </span>
    </Badge>
  );
};