import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Signup from "./components/Signup";
import ChatLayout from "./components/ChatLayout";
import FriendChatBox from "./components/ChatLayoutChildren/FriendChatBox";
import Photo from "./components/ChatLayoutChildren/Photo";
import Profile from "./components/Profile";
import StatusViewer from "./components/StatusChatLayoutChildren/StatusViewer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/whatsappweb/signup" element={<Signup />} />
        <Route path="/whatsappweb/:adminId" element={<ChatLayout />}>
          <Route index element={<Photo />} />
          <Route path=":friendId" element={<FriendChatBox />} />
          <Route path="status/:statusId" element={<StatusViewer />} />
        </Route>
        <Route path="/whatsapp-web/profile/:adminId" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
