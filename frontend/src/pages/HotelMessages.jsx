import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Send, Search, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

let stompClient = null;

const HotelMessages = () => {
  const { user } = useAuth();
  const [allMessages, setAllMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    fetchAllMessages();
    connectWebSocket();
    return () => disconnectWebSocket();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedThread, allMessages]);

  useEffect(() => {
    filterThreads(searchTerm);
  }, [searchTerm, allMessages]);

  const fetchAllMessages = async () => {
    try {
      const res = await api.get('/messages/all', { params: { userId: user.id } });
      setAllMessages(res.data);
      setFilteredMessages(res.data);
    } catch {
      toast.error('Failed to load messages');
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 2000,
      onConnect: () => {
        stompClient.subscribe(`/topic/messages/${user.id}`, (msg) => {
          if (msg.body) {
            const received = JSON.parse(msg.body);
            setAllMessages((prev) => [...prev, received]);
          }
        });
      },
    });
    stompClient.activate();
  };

  const disconnectWebSocket = () => stompClient?.deactivate();

  const filterThreads = (term) => {
    if (!term) return setFilteredMessages(allMessages);
    const lower = term.toLowerCase();
    setFilteredMessages(
      allMessages.filter(
        (m) =>
          m.content.toLowerCase().includes(lower) ||
          m.senderId.toLowerCase().includes(lower) ||
          m.receiverId.toLowerCase().includes(lower)
      )
    );
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedThread) return;

    const msgObj = {
      senderId: user.id,
      receiverId: selectedThread,
      content: newMessage.trim(),
    };

    try {
      await api.post('/messages', msgObj);
      if (stompClient?.connected)
        stompClient.publish({ destination: '/app/chat.sendMessage', body: JSON.stringify(msgObj) });
      setAllMessages((p) => [...p, { ...msgObj, timestamp: new Date().toISOString() }]);
      setNewMessage('');
      scrollToBottom();
    } catch {
      toast.error('Message send failed');
    }
  };

  const threads = filteredMessages.reduce((acc, msg) => {
    const other = msg.senderId === user.id ? msg.receiverId : msg.senderId;
    (acc[other] ||= []).push(msg);
    return acc;
  }, {});

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Sidebar */}
      <aside className="w-1/4 border-r backdrop-blur-xl bg-white/70 p-5 shadow-md overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-5 flex items-center gap-2">
          <MessageSquare className="text-blue-600" size={22} />
          Messages
        </h2>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {Object.keys(threads).length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-10">No chats yet</p>
        ) : (
          Object.entries(threads).map(([id, msgs]) => {
            const last = msgs[msgs.length - 1];
            return (
              <div
                key={id}
                onClick={() => setSelectedThread(id)}
                className={`p-3 mb-2 rounded-xl cursor-pointer transition-all ${
                  selectedThread === id
                    ? 'bg-blue-100 ring-1 ring-blue-400'
                    : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold text-gray-800">{id}</p>
                <p className="text-sm text-gray-500 truncate">{last.content}</p>
              </div>
            );
          })
        )}
      </aside>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col p-6">
        {selectedThread ? (
          <>
            <div className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-inner p-6">
              <AnimatePresence>
                {threads[selectedThread]?.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex mb-4 ${
                      msg.senderId === user.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`px-4 py-3 max-w-xs md:max-w-sm rounded-2xl shadow-md ${
                        msg.senderId === user.id
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span className="text-[10px] opacity-70 block mt-1 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="mt-4 flex items-center bg-white/80 rounded-full border border-gray-200 px-4 py-2 shadow-sm backdrop-blur-md">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-3 py-2 text-sm bg-transparent outline-none"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-300"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare size={50} className="mb-4 text-blue-400" />
            <p className="text-lg font-medium">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelMessages;
