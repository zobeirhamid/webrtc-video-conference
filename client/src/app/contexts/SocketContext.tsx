import React, { useContext, useRef } from "react";
import socketIOClient, { Socket } from "socket.io-client";

const SocketContext = React.createContext<Socket | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};

export const SocketProvider = ({
  endpoint = "http://localhost:5000/",
  children,
}: {
  endpoint: string;
  children: React.ReactNode;
}) => {
  const socket = useRef(
    socketIOClient(endpoint, { autoConnect: false })
  ).current;

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
