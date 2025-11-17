import React, { useState, useRef, useEffect } from "react";


const ChatBot = () => {
  const [healthId, setHealthId] = useState("");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!healthId || !message) return alert("Enter health ID and message");

    setChatHistory([...chatHistory, { type: "user", text: message }]);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ health_id: healthId, message })
      });

      const data = await response.json();
      if (data.reply) {
        setChatHistory(prev => [...prev, { type: "bot", text: data.reply }]);
      } else {
        setChatHistory(prev => [...prev, { type: "bot", text: data.error }]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { type: "bot", text: "Error connecting to server" }]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-4 font-sans">
      <h2 className="text-2xl font-bold mb-4 text-center">👵 ElderCare Chatbot</h2>

      <input
        type="text"
        placeholder="Enter Health ID (e.g. H002)"
        value={healthId}
        onChange={(e) => setHealthId(e.target.value)}
        className="w-full px-3 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="h-72 overflow-y-auto border rounded-lg p-3 mb-3 bg-gray-50">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                msg.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <b>{msg.type === "user" ? "You" : "Bot"}:</b> {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
