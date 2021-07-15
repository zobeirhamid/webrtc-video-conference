class Stream extends MediaStream {
  removeTracks = () => {
    this.getTracks().forEach((track) => {
      track.stop();
      this.removeTrack(track);
    });
  };

  addTracks = (tracks: MediaStreamTrack[]) => {
    tracks.forEach((track) => {
      this.addTrack(track);
    });
  };

  updateStream = (stream: MediaStream) => {
    this.removeTracks();
    this.addTracks(stream.getTracks());
  };

  stopStream = () => {
    this.getTracks().forEach((track) => {
      track.stop();
    });
  };
}

export default Stream;
