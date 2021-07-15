import React, { useState, useEffect, useMemo, useRef } from "react";
import WebRTCDeviceManager from "../../library/WebRTCDeviceManager";

export type WebRTCDeviceManagerState = {
  stream: MediaStream;
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
  selectedVideoDevice?: MediaDeviceInfo;
  selectedAudioDevice?: MediaDeviceInfo;
  selectVideoDeviceById: (deviceId: string) => void;
  selectAudioDeviceById: (deviceId: string) => void;
  requestPermission: () => Promise<void>;
};

const WebRTCDeviceManagerContext =
  React.createContext<WebRTCDeviceManagerState>({
    stream: new MediaStream(),
    videoDevices: [],
    audioDevices: [],
    selectVideoDeviceById: () => {},
    selectAudioDeviceById: () => {},
    requestPermission: async () => {},
  });

export const useWebRTCDeviceManager = () => {
  const context = React.useContext(WebRTCDeviceManagerContext);

  if (context === undefined) {
    throw new Error(
      "useDevice must be used within a WebRTCDeviceManagerProvider"
    );
  }
  return context;
};

export const WebRTCDeviceManagerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const WebRTCDeviceManagerInstance = useRef(new WebRTCDeviceManager()).current;

  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDevice, setSelectedVideoDevice] =
    useState<MediaDeviceInfo>();
  const [selectedAudioDevice, setSelectedAudioDevice] =
    useState<MediaDeviceInfo>();

  const [stream, setStream] = useState<MediaStream>(
    WebRTCDeviceManagerInstance.getStream()
  );

  useEffect(() => {
    WebRTCDeviceManagerInstance.addEventListener("onStreamChange", setStream);
    WebRTCDeviceManagerInstance.addEventListener(
      "onVideoDeviceChange",
      setVideoDevices
    );
    WebRTCDeviceManagerInstance.addEventListener(
      "onAudioDeviceChange",
      setAudioDevices
    );
    WebRTCDeviceManagerInstance.addEventListener(
      "onSelectedVideoDeviceChange",
      setSelectedVideoDevice
    );
    WebRTCDeviceManagerInstance.addEventListener(
      "onSelectedAudioDeviceChange",
      setSelectedAudioDevice
    );
    return () => {
      WebRTCDeviceManagerInstance.removeEventListener(
        "onStreamChange",
        setStream
      );
      WebRTCDeviceManagerInstance.removeEventListener(
        "onVideoDeviceChange",
        setVideoDevices
      );
      WebRTCDeviceManagerInstance.removeEventListener(
        "onAudioDeviceChange",
        setAudioDevices
      );
      WebRTCDeviceManagerInstance.removeEventListener(
        "onSelectedVideoDeviceChange",
        setSelectedVideoDevice
      );
      WebRTCDeviceManagerInstance.removeEventListener(
        "onSelectedAudioDeviceChange",
        setSelectedAudioDevice
      );
    };
  }, [WebRTCDeviceManagerInstance]);

  const webRTCDeviceManagerContext = useMemo(() => {
    return {
      stream,
      videoDevices,
      audioDevices,
      selectedVideoDevice,
      selectedAudioDevice,
      selectVideoDeviceById: WebRTCDeviceManagerInstance.selectVideoDeviceById,
      selectAudioDeviceById: WebRTCDeviceManagerInstance.selectAudioDeviceById,
      requestPermission: WebRTCDeviceManagerInstance.requestStream,
    };
  }, [
    stream,
    videoDevices,
    audioDevices,
    selectedVideoDevice,
    selectedAudioDevice,
    WebRTCDeviceManagerInstance,
  ]);

  return (
    <WebRTCDeviceManagerContext.Provider value={webRTCDeviceManagerContext}>
      {children}
    </WebRTCDeviceManagerContext.Provider>
  );
};
