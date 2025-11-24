import React, { useState } from "react";
import ChatBot from "./ChatBot"; // your existing ChatBot component

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
        >
          💬
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-96 h-[500px] bg-white shadow-xl rounded-xl overflow-hidden flex flex-col">
          <div className="bg-blue-500 text-white p-4 font-bold flex justify-between items-center">
            Guardian Chat
            <button
              onClick={() => setOpen(false)}
              className="text-xl font-bold"
            >
              ×
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatBot />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
