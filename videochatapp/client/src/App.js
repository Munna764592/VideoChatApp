import './App.css';
import Chat from './components/chat';
import { Route, Routes } from 'react-router-dom';
import { SocketProvider } from './providers/socket';
import RoomPage from './components/room'
import { PeerProvider } from './providers/Peer'

function App() {
  return (
    <SocketProvider>
      <PeerProvider>
        <Routes>
          <Route path='/' element={<Chat />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
        </Routes>
      </PeerProvider>
    </SocketProvider>
  );
}

export default App;

