import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import ChatLayout from './components/ChatLayout';
import FriendChatBox from './components/ChatLayoutChildren/FriendChatBox';
import Photo from './components/ChatLayoutChildren/Photo';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/whatsappweb/signup" element={<Signup />} />
        <Route path="/whatsappweb/:AdminId" element={<ChatLayout />}>
          <Route index element={<Photo />} />
          {/* <Route path=":friendId" element={<FriendChatBox />} /> */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
