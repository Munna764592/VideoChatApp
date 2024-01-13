import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../providers/socket";
import { useNavigate } from "react-router-dom";

const ChatApp = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [roomId, setroomId] = useState("");
  const handleJoinRoom = () => {
    socket.emit("join-room", { emailId: email, roomId });
  };

  const handleRoomJoined = useCallback(({ roomId }) => {
    navigate(`/room/${roomId}`);
  },[navigate]);

  useEffect(() => {
    socket.on("joined-room", handleRoomJoined);
    return () => {
      socket.off("joined-room", handleRoomJoined);
    };
  }, [socket, handleRoomJoined]);

  return (
    <>
      <div className="mn-x">
        <div className="input-x">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter email"
          />
          <input
            value={roomId}
            onChange={(e) => setroomId(e.target.value)}
            type="text"
            placeholder="Enter room ID"
          />
          <button onClick={handleJoinRoom} type="submit">
            Enter
          </button>
        </div>
      </div>
    </>
  );
};
export default ChatApp;
