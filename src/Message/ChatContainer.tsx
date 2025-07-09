/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../Services/MessageService";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import { TypingIndicator } from "./skeletons/TypingIndicator";
import MessageMenu from "./MessageMenu";
import MessageMedia from "./skeletons/MessageMedia";



const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatMessageDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === date.toDateString();
  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return format(date, "dd MMM yyyy");
};

const MessageStatusIndicator = ({ status }: { status?: 'SENT' | 'DELIVERED' | 'READ' }) => {
  switch (status) {
    case 'READ':
      return <CheckCheck className="w-3 h-3 text-blue-500 ml-1" />;
    case 'DELIVERED':
      return <CheckCheck className="w-3 h-3 text-gray-400 ml-1" />;
    case 'SENT':
      return <Check className="w-3 h-3 text-gray-400 ml-1" />;
    default:
      return null;
  }
};

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    markAsRead,
    typingStatus,
    editMessage,
    deleteMessageForMe,
    deleteMessageForEveryone,
    setEditingMessage ,
  } = useChatStore();

  const authUser = useSelector((state: any) => state.user);
  const profile = useSelector((state:any)=>state.profile);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser?.id && authUser?.profileId) {
      getMessages(selectedUser.id);
    }
  }, [selectedUser?.id, authUser?.profileId, getMessages]);

  useEffect(() => {
    if (authUser?.profileId) {
      subscribeToMessages();
    }
    return () => {
      unsubscribeFromMessages();
    };
  }, [authUser?.profileId]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (selectedUser && document.visibilityState === 'visible') {
      const unreadMessages = messages.filter(
        msg => msg.senderId === selectedUser.id &&
          msg.status !== 'READ' &&
          msg.receiverId === authUser?.profileId
      );
      unreadMessages.forEach(msg => markAsRead(msg.id));
    }
  }, [messages, selectedUser, authUser?.profileId]);

  const handleEdit = async (message: any) => {
    setEditingMessage(message); 
  };

  const handleDeleteForMe = async (id: number) => {
    try {
      await deleteMessageForMe(id);
    } catch (err) {
      console.error("Failed to delete message for me", err);
    }
  };

  const handleDeleteForEveryone = async (id: number) => {
    try {
      await deleteMessageForEveryone(id);
    } catch (err) {
      console.error("Failed to delete for everyone", err);
    }
  };

  if (isMessagesLoading || !authUser) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  let lastDate = "";
  const isTyping = selectedUser?.id && typingStatus[selectedUser.id];

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-mine-shaft-950 text-mine-shaft-300 font-['poppins']"
      >
        {messages
  .filter((message) => {
    const isOwnMessage = Number(message.senderId) === Number(authUser.profileId);
    const isChatWithSelectedUser =
      (message.senderId === authUser.profileId && message.receiverId === selectedUser?.id) ||
      (message.receiverId === authUser.profileId && message.senderId === selectedUser?.id);

    const isNotDeleted = isOwnMessage ? !message.senderDeleted : !message.receiverDeleted;

    return isChatWithSelectedUser && isNotDeleted;
  })

          .map((message) => {
            const isOwnMessage = Number(message.senderId) === Number(authUser.profileId);
            const profileImage = isOwnMessage
              ? profile.picture
                ? `data:image/jpeg;base64,${profile.picture}`
                : "/avatar-7.png"
              : selectedUser.picture
                ? `data:image/jpeg;base64,${selectedUser.picture}`
                : "/avatar-9.png";

            const messageDate = formatMessageDate(message.createdAt);
            const showDateHeader = messageDate !== lastDate;
            lastDate = messageDate;

            return (
              <div key={message.id} className="space-y-1">
                {showDateHeader && (
                  <div className="text-center text-xs text-gray-500 py-2">
                    <div className="inline-block bg-gray-300 dark:bg-gray-600 text-black dark:text-white px-4 py-1 rounded-full">
                      {messageDate}
                    </div>
                  </div>
                )}

                <div className={`flex m-2 space-x-2 mb-1 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-500">
                    <img src={profileImage} alt="profile" className="object-cover w-full h-full" />
                  </div>

                  <div className={`max-w-xs m-2 relative ${isOwnMessage ? 'flex flex-col items-end' : ''}`}>
                    <div className={`p-2 rounded-lg text-sm whitespace-pre-wrap relative group ${isOwnMessage ? "text-bright-sun-400 bg-mine-shaft-900 rounded-tr-none" : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white rounded-tl-none"}`}>
                      {message.file && <MessageMedia fileUrl={message.file} />}

                      <div className="flex justify-between items-end gap-2">
                        <div className="flex-1">
                          {message.text === "🚫This message was deleted" ? (
                            <i className="text-gray-400">{message.text}</i>
                          ) : message.text}
                        </div>
                        <div className={`flex items-center mt-2 text-[10px] opacity-80 whitespace-nowrap ${isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                          {formatMessageTime(message.createdAt)}
                          {isOwnMessage && <MessageStatusIndicator status={message.status} />}
                        </div>
                      </div>
                      {isOwnMessage && (
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MessageMenu
                            messageId={message.id}
                            onEdit={() => handleEdit(message)}
                            onDeleteForMe={() => handleDeleteForMe(message.id)}
                            onDeleteForEveryone={() => handleDeleteForEveryone(message.id)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex m-2 space-x-2">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-500">
              <img
                src={selectedUser.picture ? `data:image/jpeg;base64,${selectedUser.picture}` : "/avatar-9.png"}
                alt="profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="max-w-xs m-2 relative text-[10px] opacity-80  p-2 rounded-lg text-sm whitespace-pre-wrap relative bg-gray-800">
              <TypingIndicator userId={selectedUser.id} />
            </div>
          </div>
        )}

        <div ref={messageEndRef}></div>
      </div>
      <MessageInput />
    </div>
  );
};
export default ChatContainer;