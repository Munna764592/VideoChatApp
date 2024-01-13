import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../providers/socket";
import { usePeer } from "../providers/Peer";

const RoomPage = () => {
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream
  } = usePeer();
  const [myStream, setMyStream] = useState();
  const [remoteEmailId, setRemoteEmailId] = useState();

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmailId(emailId);
    },
    [createOffer, socket]
  );

  const handleIncommingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { emailId: from, ans });
      console.log("incomming call from", from, offer);
      setRemoteEmailId(from);
    },
    [createAnswer, socket]
  );
  
  const handleNegotiation = useCallback(() => {
    const localOffer = peer.localDescription;
    socket.emit("call-user", { emailId: remoteEmailId, offer: localOffer });
  }, []);

  const handleCallAceepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("Call Got Accepted", ans);
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });

    setMyStream(stream);
  }, []);
  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incomming-call", handleIncommingCall);
    socket.on("call-accepted", handleCallAceepted);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incomming-call", handleIncommingCall);
      socket.off("call-accepted", handleCallAceepted);
    };
  }, [handleIncommingCall, socket, handleCallAceepted, handleNewUserJoined]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <>
      <div className="room-page-container">
        <h1>Room page</h1>
        <h4>you are connected to {remoteEmailId}</h4>
        <button onClick={(e) => sendStream(myStream)}>Send My Video</button>
        <ReactPlayer url={myStream} playing></ReactPlayer>
        <ReactPlayer url={remoteStream} playing></ReactPlayer>
      </div>
    </>
  );
};

export default RoomPage;
