import { Socket } from "socket.io-client";
import EventHandler, { withEventHandler } from "./EventHandler";
import Peer from "./Peer";
import User from "./User";

type PeerManagerEvent = {
  onConnect: (peer: InstanceType<typeof Peer>[]) => void;
  onDisconnect: (peer: InstanceType<typeof Peer>[]) => void;
};

class PeerManager {
  socket: Socket;
  user: InstanceType<typeof User>;
  peers: { [key: string]: InstanceType<typeof Peer> };
  eventHandler: EventHandler<PeerManagerEvent>;
  configuration: {};

  constructor(
    socket: Socket,
    user: InstanceType<typeof User>,
    configuration: {}
  ) {
    this.peers = {};
    this.user = user;
    this.socket = socket;
    this.eventHandler = new EventHandler<PeerManagerEvent>();
    this.configuration = configuration;
  }

  connect = () => {
    this.socket.connect();
    this.socket.on("newCaller", this.newCaller);
    this.socket.on("receivedCall", this.receivedCall);
    this.socket.on("signal", this.signal);
    this.socket.on("removePeer", this.removePeer);
    this.socket.on("disconnect", this.disconnect);
  };

  addPeer = (socketId: string, isInitiator: boolean = false) => {
    this.peers[socketId] = new Peer(this.socket, socketId, {
      stream: this.user.getStream(),
      config: this.configuration,
      initiator: isInitiator,
    });
  };

  newCaller = (socketId: string) => {
    this.socket.emit("receivedCall", socketId);
    this.addPeer(socketId);
    this.eventHandler.fire(
      "onConnect",
      Object.keys(this.peers).map((key) => this.peers[key])
    );
  };

  receivedCall = (socketId: string) => {
    this.addPeer(socketId, true);
    this.eventHandler.fire(
      "onConnect",
      Object.keys(this.peers).map((key) => this.peers[key])
    );
  };

  signal = (data: { socketId: string; signal: any }) => {
    if (this.peers[data.socketId]) {
      this.peers[data.socketId].signal(data.signal);
    }
  };

  removePeer = (socketId: string) => {
    if (this.peers[socketId]) {
      this.peers[socketId].stopStream();
      if (this.peers[socketId]) this.peers[socketId].destroy();
      delete this.peers[socketId];
      this.eventHandler.fire(
        "onDisconnect",
        Object.keys(this.peers).map((key) => this.peers[key])
      );
    }
  };

  disconnect = () => {
    for (let socketId in this.peers) {
      this.removePeer(socketId);
    }
  };
}

export default withEventHandler<PeerManagerEvent, typeof PeerManager>(
  PeerManager
);
