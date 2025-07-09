// WebSocketService.tsx
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

let stompClient: Client | null = null;

export const connectWebSocket = (onMessageReceived: (msg: any) => void) => {
  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log(str),
    onConnect: () => {
      console.log("Connected to WebSocket");

      stompClient?.subscribe("/user/queue/messages", (message: IMessage) => {
        if (message.body) {
          onMessageReceived(JSON.parse(message.body));
        }
      });
    },
  });

  stompClient.activate();
};

export const sendWebSocketMessage = (message: any) => {
  if (stompClient?.connected) {
    stompClient.publish({
      destination: "/chat.send", 
      body: JSON.stringify(message),
    });
  } else {
    console.warn("WebSocket not connected.");
  }
};

export const disconnectWebSocket = () => {
  if (stompClient?.connected) {
    stompClient.deactivate();
    console.log("Disconnected from WebSocket");
  }
};
