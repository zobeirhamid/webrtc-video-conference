import "./ConferencePage.css";
import { RouteComponentProps } from "@reach/router";
import Video from "../../components/Video";
import { useWebRTCDeviceManager } from "../../contexts/WebRTCDeviceManagerContext";
import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "../../components/Button";
import { usePeerManager } from "../../contexts/PeerManagerContext";
import { Peer } from "../../../library/Peer";
import { useChat } from "../../contexts/ChatContext";
import { useSocket } from "../../contexts/SocketContext";
import { useUser } from "../../contexts/UserContext";

export interface ConferencePageProps extends RouteComponentProps {}

function ConferencePage(props: ConferencePageProps) {
  const { stream, requestPermission } = useWebRTCDeviceManager();
  const { user } = useUser();
  const socket = useSocket();

  const { connect, peers } = usePeerManager();

  const [message, setMessage] = useState("");
  const { messages, sendMessage } = useChat();

  useEffect(() => {
    requestPermission().then(() => {
      socket.auth = { username: user.name };
      connect();
    });
  }, [requestPermission, connect, socket, user]);

  const handleMessage = useRef((event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  }).current;

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      if (message !== "") {
        sendMessage(message);
        setMessage("");
      }
      event.preventDefault();
    },
    [message, sendMessage]
  );

  return (
    <>
      <div className="ConferencePage">
        <div className="ConferencePage-video-container">
          <Video srcObject={stream} muted autoPlay playsInline withControls />
          {peers.map((peer: InstanceType<typeof Peer>, index: number) => {
            return (
              <Video
                key={index.toString()}
                srcObject={peer.getUser().getStream()}
                autoPlay
                playsInline
                style={{ maxWidth: "50vw", maxHeight: "50vh" }}
              />
            );
          })}
        </div>
        <div className="ConferencePage-chat">
          <p className="ConferencePage-chat-messages">
            {messages.map((m, index: number) => (
              <div key={index.toString()}>
                <span>
                  {m.username}: {m.message}
                </span>
              </div>
            ))}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="ConferencePage-chat-field">
              <input
                type={"text"}
                value={message}
                onChange={handleMessage}
                placeholder={"Send a message"}
              />
              <Button type={"submit"}>Send</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ConferencePage;
