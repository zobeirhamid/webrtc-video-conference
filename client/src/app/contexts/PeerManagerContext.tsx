import React, { useContext, useMemo, useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import Peer from "../../library/Peer";
import PeerManager from "../../library/PeerManager";
import rtcConfiguration from "../config/rtcConfiguration";
import { useSocket } from "./SocketContext";
import { useUser } from "./UserContext";

type PeerManagerState = {
  connect: () => void;
  peers: InstanceType<typeof Peer>[];
};

const PeerManagerContext = React.createContext<PeerManagerState | undefined>(
  undefined
);

export const usePeerManager = () => {
  const context = useContext(PeerManagerContext);

  if (context === undefined) {
    throw new Error("usePeerManager must be used within a PeerManagerProvider");
  }

  return context;
};

export const PeerManagerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const socket = useSocket();
  const { user } = useUser();
  const [peers, setPeers] = useState<InstanceType<typeof Peer>[]>([]);

  const PeerManagerInstance = useRef(
    new PeerManager(socket, user, rtcConfiguration)
  ).current;

  useEffect(() => {
    PeerManagerInstance.addEventListener("onConnect", setPeers);
    PeerManagerInstance.addEventListener("onDisconnect", setPeers);
    return () => {
      PeerManagerInstance.removeEventListener("onConnect", setPeers);
      PeerManagerInstance.removeEventListener("onDisconnect", setPeers);
    };
  }, [PeerManagerInstance]);

  const peerManagerContext = useMemo(() => {
    return {
      connect: PeerManagerInstance.connect,
      peers,
    };
  }, [PeerManagerInstance, peers]);

  return (
    <PeerManagerContext.Provider value={peerManagerContext}>
      {children}
    </PeerManagerContext.Provider>
  );
};
