import { Socket } from "socket.io-client";
import EventHandler, { withEventHandler } from "./EventHandler";

export type ChatMessage = {
  message: string;
  username: string;
};

type ChatEvent = {
  onSend: (messages: ChatMessage[]) => void;
  onReceive: (messages: ChatMessage[]) => void;
};

class Chat {
  socket: Socket;
  messages: ChatMessage[];
  eventHandler: EventHandler<ChatEvent>;

  constructor(socket: Socket) {
    this.socket = socket;
    this.messages = [];

    this.socket.on("receiveMessage", this.receive);
    this.eventHandler = new EventHandler<ChatEvent>();
  }

  receive = (chatMessage: ChatMessage) => {
    this.messages.push(chatMessage);

    this.eventHandler.fire("onReceive", [...this.messages]);
  };

  send = (message: string) => {
    this.messages.push({ message, username: "Me" });
    this.eventHandler.fire("onSend", [...this.messages]);
    this.socket.emit("sendMessage", message);
  };

  getMessages = () => {
    return this.messages;
  };
}

export default withEventHandler<ChatEvent, typeof Chat>(Chat);
