import React, { useEffect, useRef, useState } from "react";
import User from "../../library/User";
import VideoStream from "../../library/VideoStream";
import { useWebRTCDeviceManager } from "./WebRTCDeviceManagerContext";

export type UserState = {
  name: string;
  email: string;
  user: InstanceType<typeof User>;
  videoStream: VideoStream;
};

export type UserActionFunctions = {
  updateName: (name: string) => void;
  updateEmail: (email: string) => void;
};

const UserContext =
  React.createContext<(UserState & UserActionFunctions) | undefined>(undefined);

export const useUser = () => {
  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { stream } = useWebRTCDeviceManager();
  const UserInstance = useRef(new User()).current;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const videoStream = useRef(UserInstance.getStream()).current;

  useEffect(() => {
    UserInstance.addEventListener("onNameChange", setName);
    UserInstance.addEventListener("onEmailChange", setEmail);
    UserInstance.setStream(stream);

    return () => {
      UserInstance.removeEventListener("onNameChange", setName);
      UserInstance.removeEventListener("onEmailChange", setEmail);
    };
  }, [UserInstance, stream]);

  const userContext = React.useMemo(() => {
    return {
      name,
      email,
      user: UserInstance,
      videoStream,
      updateName: UserInstance.setName,
      updateEmail: UserInstance.setEmail,
    };
  }, [name, email, videoStream, UserInstance]);

  return (
    <UserContext.Provider value={userContext}>{children}</UserContext.Provider>
  );
};
