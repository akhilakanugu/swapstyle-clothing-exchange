// frontend/src/components/ChatDrawer.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function ChatDrawer({ isOpen, onClose, swapRequest, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Poll server for new messages every 3 seconds while drawer is open
  useEffect(() => {
    if (!isOpen || !swapRequest?.id) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/swaps/${swapRequest.id}/messages`);
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Error polling chat:', err);
      }
    };

    fetchMessages(); // Initial fetch
    const interval = setInterval(fetchMessages, 3000); // Poll every 3s

    return () => clearInterval(interval);
  }, [isOpen, swapRequest]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen || !swapRequest) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`http://localhost:5000/api/swaps/${swapRequest.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUserId,
          message: newMessage.trim()
        })
      });

      if (res.ok) {
        setNewMessage('');
        // Re-fetch instantly after sending
        const updated = await fetch(`http://localhost:5000/api/swaps/${swapRequest.id}/messages`);
        const data = await updated.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-pink-600 text-white flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">Swap Negotiation</h2>
              <p className="text-xs text-pink-100">Item: {swapRequest.requestedItemTitle || 'Clothing Item'}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-pink-100 hover:text-white text-xl font-bold p-1"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs">
                No messages yet. Start the conversation to negotiate the swap!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-gray-400 mb-1 px-1">
                      {isMe ? 'You' : msg.sender_name || 'Owner'}
                    </span>
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-xs font-medium shadow-sm ${
                        isMe 
                          ? 'bg-pink-600 text-white rounded-br-none' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.message}
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              placeholder="Type your message or counter-offer..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition disabled:opacity-50"
            >
              Send
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}