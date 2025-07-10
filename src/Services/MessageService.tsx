import { create } from 'zustand';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';
import { axiosInstance } from './AuthService';
import { ErrorNotification } from './Notification';


const patchDeletedMessage = (msg: MessageDTO, currentUserId: number): MessageDTO => {
  const isSender = msg.senderId === currentUserId;
  const isDeleted = isSender ? msg.senderDeleted : msg.receiverDeleted;

  if (isDeleted) {
    return {
      ...msg,
      text: "This message was deleted",
      
    };
  }

  return msg;
};
export interface MessageDTO {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  file?: string;
  createdAt: string;
  updatedAt: string;
  receiverName?: string;
  senderDeleted: boolean;
  receiverDeleted: boolean;
  edited:boolean;
  status?: 'SENT' | 'DELIVERED' | 'READ';
}

interface ChatState {
  messages: MessageDTO[];
  users: any[];
  selectedUser: any | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  stompClient: Client | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  typingStatus: Record<number, boolean>;
  onlineUsers: number[];
  lastMessages: Record<number, MessageDTO>;
  unreadCounts: Record<number, number>;
  editingMessage: MessageDTO | null;



  editMessage: (messageId: number, newText: string) => Promise<void>;
  deleteMessageForMe: (messageId: number) => Promise<void>;
  deleteMessageForEveryone: (messageId: number) => Promise<void>;
  getUsers: () => Promise<void>;
  getMessages: (userId: number) => Promise<void>;
  sendMessage: (messageData: FormData) => Promise<void>;
  subscribeToMessages: () => Promise<void>;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (user: any) => void;
  sendTypingNotification: (receiverId: number, typing: boolean) => void;
  subscribeToOnlineUsers: () => void;
  setLastMessage: (userId: number, msg: MessageDTO) => void;
  incrementUnread: (userId: number) => void;
  resetUnread: (userId: number) => void;
  setTypingStatus: (userId: number, typing: boolean) => void;
  markAsRead: (messageId: number) => Promise<void>;
  setEditingMessage: (msg: MessageDTO | null) => void;
  
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  stompClient: null,
  connectionStatus: 'disconnected',
  typingStatus: {},
  onlineUsers: [],
  lastMessages: {},
  unreadCounts: {},
  editingMessage: null,

setEditingMessage: (msg) => set({ editingMessage: msg }),

  setLastMessage: (userId, msg) =>
    set((state) => ({
      lastMessages: { ...state.lastMessages, [userId]: msg },
    })),

   

setTypingStatus: (userId: number, typing: boolean) =>
  set((state) => ({
    typingStatus: {
      ...state.typingStatus,
      [userId]: typing,
    },
  })),

  incrementUnread: (userId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [userId]: (state.unreadCounts[userId] || 0) + 1,
      },
    })),

  resetUnread: (userId) =>
    set((state) => {
      const updated = { ...state.unreadCounts };
      delete updated[userId];
      return { unreadCounts: updated };
    }),

  markAsRead: async (messageId: number) => {
    try {
      await axiosInstance.patch(`/api/messages/${messageId}/read`);
      const { messages, lastMessages } = get();

      const updatedMessages = messages.map((msg) =>
        msg.id === messageId ? { ...msg, status: 'READ' as const } : msg
      );

      const updatedMsg = updatedMessages.find((msg) => msg.id === messageId);

      if (updatedMsg) {
        const isLast =
          lastMessages[updatedMsg.senderId]?.id === messageId ||
          lastMessages[updatedMsg.receiverId]?.id === messageId;

        if (isLast) {
          const currentUserId = JSON.parse(localStorage.getItem("user") || '{}')?.profileId;
          const otherUserId =
            updatedMsg.senderId === currentUserId
              ? updatedMsg.receiverId
              : updatedMsg.senderId;

          set((state) => ({
            lastMessages: {
              ...state.lastMessages,
              [otherUserId]: { ...updatedMsg, status: 'READ' as const },
            },
          }));
        }
      }

      set({ messages: updatedMessages });
    } catch (error) {
      console.error("❌ Failed to mark message as read", error);
    }
  },


  subscribeToOnlineUsers: () => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const userId = user?.profileId;
    if (!userId) return;

    //const socket = new SockJS(`http://localhost:8080/ws?userId=${userId}`);
    const socket = new SockJS(`https://job-portal-backend-smwt.onrender.com/ws?userId=${userId}`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("🧩 OnlineUsers Debug:", str),
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ Subscribed to online users");
        client.subscribe("/topic/online-users", (msg) => {
          try {
            const ids = JSON.parse(msg.body);
            console.log("🌐 Online users updated:", ids);
            set({ onlineUsers: ids });
          } catch (err) {
            console.error("❌ Failed to parse online users:", err);
          }
        });
      },

      onStompError: (frame) => {
        console.error("🔥 STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
  },
sendTypingNotification: (receiverId, typing) => {
  const { stompClient } = get();
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const senderId = user?.profileId;

  if (stompClient?.connected) {
    const payload = JSON.stringify({
      senderId,
      receiverId,
      typing,
      timestamp: new Date().toISOString()
    });

    stompClient.publish({
      destination: `/app/typing`,
      body: payload,
    });
  }
},
editMessage: async (messageId: number, newText: string) => {
  await axiosInstance.patch(`/api/messages/${messageId}/edit`, newText, {
    headers: { 'Content-Type': 'text/plain' },
  });
},

 deleteMessageForMe: async (messageId: number) => {
  const { messages } = get();
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const currentUserId = user?.profileId;

  try {
    await axiosInstance.delete(`/api/messages/${messageId}/me`);
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId
        ? patchDeletedMessage({ ...msg, 
            senderDeleted: msg.senderId === currentUserId ? true : msg.senderDeleted,
            receiverDeleted: msg.receiverId === currentUserId ? true : msg.receiverDeleted
          }, currentUserId)
        : msg
    );

    set({ messages: updatedMessages });
  } catch (error) {
    console.error("❌ Failed to delete message for me", error);
    toast.error("Failed to delete message.");
  }
},


deleteMessageForEveryone: async (messageId: number) => {
  await axiosInstance.delete(`/api/messages/${messageId}/everyone`);
},      


getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/profiles/getAll");
      set({ users: res.data });
    } catch (error) {
      toast.error("Failed to load users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

 getMessages: async (userId: number) => {
  set({ isMessagesLoading: true });
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const senderId = user?.profileId;

  try {
    const res = await axiosInstance.get(`/api/messages/${userId}?senderId=${senderId}`);
    const allMessages: MessageDTO[] = res.data;

    const patched = allMessages.map(msg => patchDeletedMessage(msg, senderId));
    set({ messages: patched });
  } catch (error) {
    toast.error("Failed to load messages.");
  } finally {
    set({ isMessagesLoading: false });
  }
},



  sendMessage: async (messageData: FormData) => {
    const { selectedUser } = get();
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const senderId = user?.profileId;

    if (!selectedUser) {
      toast.warn("Please select a user first.");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/api/messages/${selectedUser.id}`,
        messageData,
        {
          headers: {
            'X-User-Id': senderId,
          },
        }
      );

      const newMessage: MessageDTO = res.data;
      set((state) => ({
        lastMessages: { ...state.lastMessages, [selectedUser.id]: newMessage },
      }));

      if (get().onlineUsers.includes(selectedUser.id)) {
        await axiosInstance.patch(`/api/messages/${newMessage.id}/delivered`);
        set((state) => ({
          messages: state.messages.map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'DELIVERED' as const } : msg
          ),
          lastMessages: {
            ...state.lastMessages,
            [selectedUser.id]: { ...newMessage, status: 'DELIVERED' as const }
          },
        }));
      }
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      toast.error("Failed to send message.");
    }
  },

  subscribeToMessages: async () => {
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    const userId = user?.profileId;
    if (!userId) {
      ErrorNotification("error", "User ID not found");
      return;
    }

    const { stompClient, connectionStatus } = get();
    if (stompClient?.connected || connectionStatus === 'connecting') return;

    console.log("🚀 Subscribing to messages for user", userId);
    set({ connectionStatus: 'connecting' });

     //const socket = new SockJS(`http://localhost:8080/ws?userId=${userId}`);
     const socket = new SockJS(`https://job-portal-backend-smwt.onrender.com/ws?userId=${userId}`);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log("🧩 STOMP Debug:", str),

      onConnect: () => {
        console.log("✅ WebSocket CONNECTED for user", userId);
        set({ connectionStatus: 'connected', stompClient: client });

        const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
       client.subscribe(`/user/queue/typing`, (message) => {

      const { senderId, typing } = JSON.parse(message.body);
      console.log("🟢 Typing notification received:", { senderId, typing });

  get().setTypingStatus(senderId, typing);
});
console.log("My current user ID:", currentUser?.id);

client.subscribe(`/user/queue/messages`, async (msg: IMessage) => {
  try {
    const incoming: MessageDTO = JSON.parse(msg.body);
    const { messages, onlineUsers, selectedUser } = get();
    const currentUser = JSON.parse(localStorage.getItem("user") || '{}');
    const currentUserId = currentUser?.profileId;

    const isOwnMessage = incoming.senderId === currentUserId;
    const otherUserId = isOwnMessage ? incoming.receiverId : incoming.senderId;

    get().setLastMessage(otherUserId, incoming);

    const isActiveChat = selectedUser?.id === otherUserId;
    const patchedMessage = patchDeletedMessage(incoming, currentUserId);

    const updatedMessages = messages.some(msg => msg.id === patchedMessage.id)
      ? messages.map(msg => (msg.id === patchedMessage.id ? patchedMessage : msg))
      : [...messages, patchedMessage];

    set({ messages: updatedMessages });

    if (isActiveChat) {
      if (!isOwnMessage && incoming.status !== 'READ' && document.visibilityState === 'visible') {
        await get().markAsRead(incoming.id);
      }
    } else if (!isOwnMessage) {
      get().incrementUnread(incoming.senderId);
      ErrorNotification('info', `New message from ${incoming.receiverName || incoming.senderId}`);
    }

    if (isOwnMessage && incoming.status === 'SENT' && onlineUsers.includes(incoming.receiverId)) {
      try {
        await axiosInstance.patch(`/api/messages/${incoming.id}/delivered`);
        const delivered = { ...patchedMessage, status: 'DELIVERED' as const };

        set({
          lastMessages: {
            ...get().lastMessages,
            [incoming.receiverId]: delivered,
          },
          messages: updatedMessages.map(msg =>
            msg.id === delivered.id ? delivered : msg
          ),
        });
      } catch (err) {
        console.error("❌ Failed to mark as delivered:", err);
      }
    }
  } catch (err) {
    console.error("❌ Failed to parse message:", err);
  }
});

      },

      onStompError: (frame) => {
        console.error("🔥 STOMP error:", frame.headers["message"]);
        set({ connectionStatus: "error" });
      },

      onDisconnect: () => {
        console.warn("🛑 Disconnected");
        set({ connectionStatus: "disconnected", stompClient: null });
      },

      onWebSocketError: (err) => {
        console.error("❌ WebSocket error:", err);
        set({ connectionStatus: "error" });
        ErrorNotification("error", "WebSocket failed");
      }
    });

    client.activate();
  },

  unsubscribeFromMessages: () => {
    const { stompClient } = get();
    if (stompClient) {
      stompClient.deactivate()
        .then(() => console.log("✅ WebSocket disconnected"))
        .catch(err => console.error("❌ Error during disconnect:", err));
    }
    set({ stompClient: null, connectionStatus: 'disconnected' });
  },

  setSelectedUser: (user) => {
    get().resetUnread(user?.id);
    set({ selectedUser: user });
  },
}));
