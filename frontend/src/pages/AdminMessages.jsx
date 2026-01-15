import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Send, Search, MessageSquare, Users, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

let stompClient = null;

const AdminMessages = () => {
  const { user } = useAuth();
  const [allMessages, setAllMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [recipientSearch, setRecipientSearch] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    fetchAllMessages();
    fetchAllUsers();
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

  const fetchAllUsers = async () => {
    try {
      const res = await api.get('/admin/user-management/all');
      // Filter to only show Hotels and DMCs
      const filtered = res.data.filter(u => 
        u.role?.includes('HOTEL') || u.role?.includes('DMC')
      );
      setAllUsers(filtered);
    } catch {
      toast.error('Failed to load users');
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

  const handleSendToMultiple = async () => {
    if (!newMessage.trim() || selectedRecipients.length === 0) {
      toast.error('Please select recipients and enter a message');
      return;
    }

    try {
      const promises = selectedRecipients.map(async (recipientId) => {
        const msgObj = {
          senderId: user.id,
          receiverId: recipientId,
          content: newMessage.trim(),
        };
        
        await api.post('/messages', msgObj);
        if (stompClient?.connected) {
          stompClient.publish({ 
            destination: '/app/chat.sendMessage', 
            body: JSON.stringify(msgObj) 
          });
        }
        
        return { ...msgObj, timestamp: new Date().toISOString() };
      });

      const sentMessages = await Promise.all(promises);
      setAllMessages((p) => [...p, ...sentMessages]);
      setNewMessage('');
      setSelectedRecipients([]);
      setShowNewMessage(false);
      toast.success(`Message sent to ${selectedRecipients.length} recipient(s)`);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const toggleRecipient = (userId) => {
    setSelectedRecipients(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecipients.length === filteredUsers.length) {
      // Deselect all
      setSelectedRecipients([]);
    } else {
      // Select all filtered users
      setSelectedRecipients(filteredUsers.map(u => u.id));
    }
  };

  const threads = filteredMessages.reduce((acc, msg) => {
    const other = msg.senderId === user.id ? msg.receiverId : msg.senderId;
    (acc[other] ||= []).push(msg);
    return acc;
  }, {});

  const filteredUsers = allUsers.filter(u => 
    u.username?.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(recipientSearch.toLowerCase()) ||
    u.role?.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  // Create a map of userId to user object for quick lookup
  const userMap = allUsers.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {});

  // Helper function to get display name for a user
  const getDisplayName = (userId) => {
    const user = userMap[userId];
    return user ? user.username : userId;
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Sidebar */}
      <aside className="w-1/4 border-r backdrop-blur-xl bg-white/70 p-5 shadow-md overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <MessageSquare className="text-green-600" size={22} />
            Messages
          </h2>
          <button
            onClick={() => setShowNewMessage(!showNewMessage)}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="New Message"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-400 outline-none"
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
                onClick={() => {
                  setSelectedThread(id);
                  setShowNewMessage(false);
                }}
                className={`p-3 mb-2 rounded-xl cursor-pointer transition-all ${
                  selectedThread === id
                    ? 'bg-green-100 ring-1 ring-green-400'
                    : 'hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold text-gray-800">{getDisplayName(id)}</p>
                <p className="text-sm text-gray-500 truncate">{last.content}</p>
              </div>
            );
          })
        )}
      </aside>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col p-6">
        {showNewMessage ? (
          <div className="flex-1 flex flex-col">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Users className="text-green-600" size={24} />
                  Send Platform Offer
                </h3>
                <button
                  onClick={() => {
                    setShowNewMessage(false);
                    setSelectedRecipients([]);
                    setNewMessage('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Recipient Selection */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Recipients ({selectedRecipients.length} selected)
                  </label>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    {selectedRecipients.length === filteredUsers.length && filteredUsers.length > 0
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input
                    value={recipientSearch}
                    onChange={(e) => setRecipientSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 outline-none"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-white">
                  {filteredUsers.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No users found</p>
                  ) : (
                    filteredUsers.map((u) => (
                      <label
                        key={u.id}
                        className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRecipients.includes(u.id)}
                          onChange={() => toggleRecipient(u.id)}
                          className="mr-3 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{u.username}</p>
                          <p className="text-xs text-gray-500">
                            {u.email} • {u.role}
                          </p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Message Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your platform offer or announcement..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-400 outline-none resize-none"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendToMultiple}
                disabled={!newMessage.trim() || selectedRecipients.length === 0}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send to {selectedRecipients.length} Recipient{selectedRecipients.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        ) : selectedThread ? (
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
                          ? 'bg-green-600 text-white rounded-br-none'
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
                className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare size={50} className="mb-4 text-green-400" />
            <p className="text-lg font-medium">Select a chat or create a new message</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
