import EventHandler, { withEventHandler } from "./EventHandler";
import { isEqual } from "lodash";

type WebRTCDeviceManagerEvent = {
  onStreamChange: (stream: MediaStream) => void;
  onVideoDeviceChange: (videoDevices: MediaDeviceInfo[]) => void;
  onAudioDeviceChange: (audioDevices: MediaDeviceInfo[]) => void;
  onSelectedVideoDeviceChange: (videoDevice?: MediaDeviceInfo) => void;
  onSelectedAudioDeviceChange: (audioDevice?: MediaDeviceInfo) => void;
};

class WebRTCDeviceManager {
  constraints: MediaStreamConstraints = {
    video: true,
    audio: true,
  };

  videoDevices: MediaDeviceInfo[] = [];
  audioDevices: MediaDeviceInfo[] = [];
  stream: MediaStream = new MediaStream();
  eventHandler = new EventHandler<WebRTCDeviceManagerEvent>();

  constructor() {
    navigator.mediaDevices.addEventListener(
      "devicechange",
      this.handleDeviceChange
    );
  }

  handleDeviceChange = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices
      .filter((device) => device.kind === "videoinput")
      .sort();

    if (!isEqual(videoDevices, this.videoDevices)) {
      this.videoDevices = videoDevices;
      this.eventHandler.fire("onVideoDeviceChange", this.videoDevices);
    }

    const audioDevices = devices
      .filter((device) => device.kind === "audioinput")
      .sort();

    if (!isEqual(audioDevices, this.audioDevices)) {
      this.audioDevices = audioDevices;
      this.eventHandler.fire("onAudioDeviceChange", this.audioDevices);
    }
  };

  updateConstraints = (constraints: MediaStreamConstraints) => {
    this.constraints = { ...this.constraints, ...constraints };
  };

  selectVideoDeviceById = (deviceId: string) => {
    this.updateConstraints({ video: { deviceId } });
    this.requestStream();
  };

  selectAudioDeviceById = (deviceId: string) => {
    this.updateConstraints({ audio: { deviceId } });
    this.requestStream();
  };

  requestStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
    await this.handleDeviceChange();
    this.stream.getTracks().forEach((track) => {
      track.stop();
      this.stream.removeTrack(track);
    });
    stream.getTracks().forEach((track) => {
      this.stream.addTrack(track);
    });
    //this.stream = stream;
    this.eventHandler.fire("onStreamChange", stream);
    this.eventHandler.fire(
      "onSelectedVideoDeviceChange",
      this.getSelectedVideoDevice()
    );

    this.eventHandler.fire(
      "onSelectedAudioDeviceChange",
      this.getSelectedAudioDevice()
    );
  };

  getStream = () => {
    return this.stream;
  };

  getSelectedDevice = (
    stream: MediaStream,
    devices: MediaDeviceInfo[],
    kind: "video" | "audio"
  ) => {
    if (stream) {
      return devices.find((device) => {
        return stream
          .getTracks()
          .filter((track) => track.kind === kind)
          .find((track) => track.label === device.label);
      });
    }
  };

  getSelectedVideoDevice = () => {
    return this.getSelectedDevice(this.stream, this.videoDevices, "video");
  };

  getSelectedAudioDevice = () => {
    return this.getSelectedDevice(this.stream, this.audioDevices, "audio");
  };
}

export default withEventHandler<
  WebRTCDeviceManagerEvent,
  typeof WebRTCDeviceManager
>(WebRTCDeviceManager);
