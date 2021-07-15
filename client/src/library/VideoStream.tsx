import Stream from "./Stream";

class VideoStream extends Stream {
  isMuted = false;
  isHidden = false;

  toggleVideo = () => {
    this.isHidden = !this.isHidden;
    this.getVideoTracks().forEach((track) => {
      track.enabled = this.isHidden;
    });
  };

  toggleAudio = () => {
    this.isMuted = !this.isMuted;
    this.getAudioTracks().forEach((track) => {
      track.enabled = this.isMuted;
    });
  };

  hide = () => {
    this.isHidden = false;
    this.toggleVideo();
  };

  show = () => {
    this.isHidden = true;
    this.toggleVideo();
  };

  mute = () => {
    this.isMuted = false;
    this.toggleAudio();
  };

  unmute = () => {
    this.isMuted = true;
    this.toggleAudio();
  };
}

export default VideoStream;
