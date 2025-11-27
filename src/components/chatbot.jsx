import React, { useState, useRef, useEffect } from "react";

const ChatBot = () => {
  const [elderId, setElderId] = useState("");  // Changed from healthId
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!elderId.trim() || !message.trim()) {
      return alert("Please enter Elder ID and message");
    }

    setChatHistory((prev) => [...prev, { type: "user", text: message }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elder_id: elderId, message }), // send elder_id
      });

      const data = await response.json();
      const botReply = data.reply || data.error || "No response from server";
      setChatHistory((prev) => [...prev, { type: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", text: "Error connecting to server" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 p-4 font-sans">
      <h2 className="text-2xl font-bold mb-4 text-center">👵 ElderCare Chatbot</h2>

      <input
        type="text"
        placeholder="Enter Elder ID (e.g. E046)"
        value={elderId}
        onChange={(e) => setElderId(e.target.value)}
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
        {loading && <div className="text-gray-500 italic">Bot is typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className={`px-4 py-2 font-semibold rounded-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
