import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user] = useAuthState(auth);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (message.trim() === "" || !user) return;

    await addDoc(collection(db, "messages"), {
      text: message,
      userId: user.uid,
      timestamp: new Date(),
    });

    setMessage("");
  };

  return (
    <div>
      <div id="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.userId}:</strong> {msg.text}
          </div>
        ))}
      </div>
      {user ? (
        <>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
          />
          <button onClick={sendMessage}>Send</button>
        </>
      ) : (
        <p>Please log in to send messages.</p>
      )}
    </div>
  );
};

export default Messages;
