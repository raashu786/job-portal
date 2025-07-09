import { X } from "lucide-react";
import { useChatStore } from "../Services/MessageService";
import { Badge } from "@mantine/core";
import { useEffect } from "react";
import { TypingIndicator } from "./skeletons/TypingIndicator";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, typingStatus, onlineUsers } = useChatStore();

  useEffect(() => {}, [onlineUsers, typingStatus]);

  if (!selectedUser) return null;

  const userId = selectedUser?.id;
  const isTyping = typingStatus?.[userId];
  const isOnline = onlineUsers?.includes(userId);

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                selectedUser.picture
                  ? `data:image/jpeg;base64,${selectedUser.picture}`
                  : "/avatar-9.png"
              }
              alt={selectedUser.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {selectedUser.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {isTyping ? (
                <TypingIndicator userId={userId} />
              ) : isOnline ? (
                <Badge color="green" radius="sm" variant="light">
                  Online
                </Badge>
              ) : (
                <Badge color="gray" radius="sm" variant="light">
                  Offline
                </Badge>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
