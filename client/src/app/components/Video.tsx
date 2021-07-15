import {
  VideoHTMLAttributes,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import Button from "./Button";

type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream;
  withControls?: boolean;
};

export default function Video({
  srcObject,
  withControls = false,
  ...props
}: PropsType) {
  const refVideo = useRef<HTMLVideoElement>(null);
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [isAudioActive, setIsAudioActive] = useState(true);

  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = srcObject;
  }, [srcObject]);

  const toggleVideo = useCallback(() => {
    setIsVideoActive(!isVideoActive);
    srcObject.getVideoTracks().forEach((track) => {
      track.enabled = !isVideoActive;
    });
  }, [isVideoActive, srcObject]);

  const toggleAudio = useCallback(() => {
    setIsAudioActive(!isAudioActive);
    srcObject.getAudioTracks().forEach((track) => {
      track.enabled = !isAudioActive;
    });
  }, [isAudioActive, srcObject]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
      }}
    >
      <div style={{ position: "relative" }}>
        <video ref={refVideo} {...props} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: "3px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {withControls && (
            <>
              <div style={{ margin: "10px 5px" }}>
                <Button onClick={toggleVideo}>
                  {isVideoActive ? "Hide Video" : "Show Video"}
                </Button>
              </div>
              <div style={{ margin: "10px 5px" }}>
                <Button onClick={toggleAudio}>
                  {isAudioActive ? "Mute Audio" : "Unmute Audio"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
