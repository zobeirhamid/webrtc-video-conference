import EventHandler, { withEventHandler } from "./EventHandler";
import VideoStream from "./VideoStream";

type UserEvent = {
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
};

class User {
  name: string;
  email?: string;
  stream: VideoStream;
  eventHandler: EventHandler<UserEvent>;

  constructor(name: string = "", email: string = "") {
    this.name = name;
    this.email = email;
    this.stream = new VideoStream();
    this.eventHandler = new EventHandler<UserEvent>();
  }

  getName = () => {
    return this.name;
  };

  setName = (name: string) => {
    this.name = name;
    this.eventHandler.fire("onNameChange", name);
  };

  getEmail = () => {
    return this.email;
  };

  setEmail = (email: string) => {
    this.email = email;
    this.eventHandler.fire("onEmailChange", email);
  };

  getStream = () => {
    return this.stream;
  };

  setStream = (stream: MediaStream) => {
    this.stream.updateStream(stream);
  };
}

export default withEventHandler<UserEvent, typeof User>(User);
