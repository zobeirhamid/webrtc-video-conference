import DeviceDiscoveryPage from "./pages/DeviceDiscoveryPage/DeviceDiscoveryPage";
import HomePage from "./pages/HomePage/HomePage";
import { Router } from "@reach/router";
import ConferencePage from "./pages/ConferencePage/ConferencePage";
import { UserProvider } from "./contexts/UserContext";
import { WebRTCDeviceManagerProvider } from "./contexts/WebRTCDeviceManagerContext";
import { PeerManagerProvider } from "./contexts/PeerManagerContext";
import { SocketProvider } from "./contexts/SocketContext";
import { ChatProvider } from "./contexts/ChatContext";

function App() {
  return (
    <WebRTCDeviceManagerProvider>
      <UserProvider>
        <SocketProvider endpoint={"https://webrtc-video-conference-server.herokuapp.com/"}>
          <PeerManagerProvider>
            <ChatProvider>
              <Router>
                <HomePage path="/" default />
                <DeviceDiscoveryPage path="/deviceDiscovery" />
                <ConferencePage path="/conference" />
              </Router>
            </ChatProvider>
          </PeerManagerProvider>
        </SocketProvider>
      </UserProvider>
    </WebRTCDeviceManagerProvider>
  );
}

export default App;
