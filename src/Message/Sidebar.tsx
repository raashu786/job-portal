import { useEffect, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, MoreVertical, Check, CheckCheck, Clock, Pencil } from "lucide-react";
import { useChatStore } from "../Services/MessageService";
import { Badge, Tooltip } from "@mantine/core";
import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";
import { TypingIndicator } from "./skeletons/TypingIndicator";

const formatTimeLabel = (timestamp: any) => {
  const date = new Date(timestamp);
  const now = new Date();

  if (differenceInMinutes(now, date) < 1) {
    return "Just now";
  } else if (isToday(date)) {
    return format(date, "h:mm a");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (date.getFullYear() === now.getFullYear()) {
    return format(date, "MMM d");
  } else {
    return format(date, "MM/dd/yyyy");
  }
};

const getStatusIcon = (status?: string, isOwnMessage?: boolean) => {
  if (!isOwnMessage) return null;

  switch (status?.toUpperCase()) {
    case "READ":
      return (
        <Tooltip label="Read" withArrow position="top" transitionProps={{ duration: 150 }}>
          <CheckCheck className="w-4 h-4 text-blue-500 ml-1" />
        </Tooltip>
      );
    case "DELIVERED":
      return (
        <Tooltip label="Delivered" withArrow position="top" transitionProps={{ duration: 150 }}>
          <CheckCheck className="w-4 h-4 text-gray-400 ml-1" />
        </Tooltip>
      );
    case "SENT":
      return (
        <Tooltip label="Sent" withArrow position="top" transitionProps={{ duration: 150 }}>
          <Check className="w-4 h-4 text-gray-400 ml-1" />
        </Tooltip>
      );
    case "PENDING":
      return (
        <Tooltip label="Sending" withArrow position="top" transitionProps={{ duration: 150 }}>
          <Clock className="w-4 h-4 text-gray-400 ml-1" />
        </Tooltip>
      );
    default:
      return null;
  }
};

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    onlineUsers,
    lastMessages,
    unreadCounts,
    typingStatus,
  } = useChatStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users
    .filter((user) => user.id !== currentUser?.profileId)
    .filter((user) => user.name && user.name.trim() !== '')
    .filter((user) => (showOnlineOnly ? onlineUsers.includes(user.id) : true))
    .filter((user) => {
      const userName = user.name?.toLowerCase() || '';
      const lastMessageText = lastMessages[user.id]?.text?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();

      return userName.includes(query) || lastMessageText.includes(query);
    })
    .sort((a, b) => {
      const timeA = lastMessages[a.id]?.createdAt || 0;
      const timeB = lastMessages[b.id]?.createdAt || 0;
      return new Date(timeB).getTime() - new Date(timeA).getTime();
    });

  const onlineUsersCount = onlineUsers.filter(
    (id) => id !== currentUser?.profileId
  ).length;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 transition-all duration-200">
      <div className="border-b border-gray-200 dark:border-gray-700 w-full p-4 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <Users className="size-5 text-gray-600 dark:text-gray-300" />
            </div>
            <span className="font-medium hidden lg:block text-gray-800 dark:text-white text-lg">
              Chats
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip label="New Chat" position="bottom" withArrow>
              <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <Pencil className="size-5 text-gray-600 dark:text-gray-300" />
              </button>
            </Tooltip>
            <Tooltip label="Menu" position="bottom" withArrow>
              <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <MoreVertical className="size-5 text-gray-600 dark:text-gray-300" />
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="mt-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="size-4 text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-3 hidden lg:flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Online only
            </span>
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {onlineUsersCount} online
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full flex-1">
        {filteredUsers.map((user) => {
          const lastMessage = lastMessages[user.id];
          const hasUnread = unreadCounts[user.id] > 0;
          const isOwnLastMessage = lastMessage?.senderId === currentUser?.profileId;
          const lastMessageTime = lastMessage?.createdAt
            ? formatTimeLabel(lastMessage.createdAt)
            : null;
          const isTyping = typingStatus[user.id];

          return (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-4 flex items-center gap-3 relative
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                ${selectedUser?.id === user.id ? "bg-gray-100 dark:bg-gray-700" : ""}
                border-b border-gray-100 dark:border-gray-700
              `}
            >
              <div className="relative">
                <img
                  src={
                    user.picture
                      ? `data:image/jpeg;base64,${user.picture}`
                      : "/avatar-9.png"
                  }
                  alt={user.name}
                  className="w-12 h-12 object-cover rounded-full shadow-sm"
                />
                {onlineUsers.includes(user.id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                )}
              </div>

              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="flex justify-between items-center">
                  <div className={`font-medium truncate ${hasUnread ? "text-black dark:text-white font-semibold" : "text-gray-800 dark:text-gray-200"}`}>
                    {user.name}
                  </div>
                  {lastMessageTime && (
                    <div className={`text-xs whitespace-nowrap ${hasUnread ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}>
                      {lastMessageTime}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-1">
                  <div className={`text-sm truncate flex items-center ${hasUnread ? "text-black dark:text-white font-medium" : "text-gray-500 dark:text-gray-400"}`}>
                    {isTyping ? (
                      <TypingIndicator userId={user.id} />
                    ) : (
                      <>
                        {isOwnLastMessage && lastMessage?.status && getStatusIcon(lastMessage.status, true)}
                        <span className="ml-1 truncate">
                          {isOwnLastMessage && "You: "}
                          {lastMessage?.text || "No messages yet"}
                        </span>
                      </>
                    )}
                  </div>
                  {hasUnread && !isTyping && (
                    <Badge size="md" color="blue" circle className="!bg-blue-500 dark:!bg-blue-600 !text-white">
                      {unreadCounts[user.id]}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="lg:hidden">
                {hasUnread && (
                  <Badge size="sm" color="blue" circle className="!bg-blue-500 dark:!bg-blue-600 !text-white">
                    {unreadCounts[user.id]}
                  </Badge>
                )}
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            {showOnlineOnly
              ? "No online users found"
              : searchQuery
                ? "No matching contacts found"
                : "No contacts available"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
