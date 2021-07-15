import "./DeviceDiscoveryPage.css";
import { ChangeEvent, useEffect, useRef } from "react";

import Button from "../../components/Button";
import Select from "../../components/Select";
import { Link, RouteComponentProps } from "@reach/router";
import { useUser } from "../../contexts/UserContext";
import { useWebRTCDeviceManager } from "../../contexts/WebRTCDeviceManagerContext";
import Video from "../../components/Video";

export interface DeviceDiscoveryPageProps extends RouteComponentProps {}

function DeviceDiscoveryPage(props: DeviceDiscoveryPageProps) {
  const {
    stream,
    videoDevices,
    audioDevices,
    selectedVideoDevice,
    selectedAudioDevice,
    selectVideoDeviceById,
    selectAudioDeviceById,
    requestPermission,
  } = useWebRTCDeviceManager();

  const { name, updateName } = useUser();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const handleInputChange = useRef((event: ChangeEvent<HTMLInputElement>) => {
    updateName(event.target.value);
  }).current;

  const handleVideoSelectChange = useRef(
    (event: ChangeEvent<HTMLSelectElement>) => {
      selectVideoDeviceById(event.target.value);
    }
  ).current;

  const handleAudioSelectChange = useRef(
    (event: ChangeEvent<HTMLSelectElement>) => {
      selectAudioDeviceById(event.target.value);
    }
  ).current;

  return (
    <div className="DeviceDiscoveryPage">
      <div className="DeviceDiscoveryPage-container">
        <div>
          <Video srcObject={stream} muted autoPlay playsInline />
        </div>
        <div>
          <input
            type={"text"}
            value={name}
            onChange={handleInputChange}
            placeholder={"Your Name"}
            className="DeviceDiscoveryPage-name"
          />
        </div>
        <div>
          <Select
            width={"100%"}
            value={selectedVideoDevice?.deviceId}
            onChange={handleVideoSelectChange}
          >
            {videoDevices.map((videoDevice) => (
              <option key={videoDevice.deviceId} value={videoDevice.deviceId}>
                {videoDevice.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Select
            width={"100%"}
            value={selectedAudioDevice?.deviceId}
            onChange={handleAudioSelectChange}
          >
            {audioDevices.map((audioDevice) => (
              <option key={audioDevice.deviceId} value={audioDevice.deviceId}>
                {audioDevice.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Link to="/conference">
            <Button disabled={name.length < 3}>Enter Room</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DeviceDiscoveryPage;
