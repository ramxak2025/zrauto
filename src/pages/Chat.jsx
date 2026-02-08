import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import { ChevronLeft, Send, Image as ImageIcon } from 'lucide-react';

export default function Chat() {
  const navigate = useNavigate();
  const { currentUser, messages, sendMessage, getUserById } = useApp();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      sendMessage('', ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (diff > 80) {
      navigate(-1);
    }
    setTouchStart(null);
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateSeparator = (ts) => {
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Сегодня';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Вчера';
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  let lastDate = '';

  return (
    <div
      className="fixed inset-0 bg-gray-50 z-[100] flex flex-col slide-in-right"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 py-3 flex items-center gap-3 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="btn-press p-1 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-gray-900">Общий чат</h1>
          <p className="text-xs text-gray-400">{messages.length} сообщений</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {messages.map((msg) => {
          const sender = getUserById(msg.userId);
          const isMe = msg.userId === currentUser.id;
          const msgDate = formatDateSeparator(msg.timestamp);
          let showDate = false;
          if (msgDate !== lastDate) {
            showDate = true;
            lastDate = msgDate;
          }

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex justify-center my-3">
                  <span className="bg-white text-gray-400 text-xs px-3 py-1 rounded-full shadow-sm">
                    {msgDate}
                  </span>
                </div>
              )}
              <div className={`flex gap-2 mb-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                {!isMe && (
                  <Avatar
                    src={sender?.avatar}
                    name={sender?.name}
                    size={32}
                    isBestMaster={sender?.isBestMaster}
                    className="mt-1 shrink-0"
                  />
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                    isMe
                      ? 'bg-brand text-white rounded-tr-sm'
                      : 'bg-white text-gray-900 shadow-sm rounded-tl-sm'
                  }`}
                >
                  {!isMe && (
                    <p className={`text-xs font-semibold mb-0.5 ${sender?.isBestMaster ? 'text-gold' : 'text-brand'}`}>
                      {sender?.name || 'Удален'}
                    </p>
                  )}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt=""
                      className="rounded-lg mb-1 max-w-full max-h-48 object-cover"
                    />
                  )}
                  {msg.text && <p className="text-sm leading-relaxed break-words">{msg.text}</p>}
                  <p className={`text-[10px] mt-0.5 ${isMe ? 'text-white/60' : 'text-gray-400'} text-right`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {currentUser.bannedInChat ? (
        <div className="bg-white border-t border-gray-200 px-4 py-3 text-center text-sm text-gray-400">
          Вы заблокированы в чате
        </div>
      ) : (
        <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-end gap-2 shrink-0">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-press p-2 text-gray-400 hover:text-gray-600 shrink-0"
          >
            <ImageIcon size={22} />
          </button>
          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
            <input
              type="text"
              placeholder="Сообщение..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="btn-press p-2 text-brand disabled:text-gray-300 shrink-0"
          >
            <Send size={22} />
          </button>
        </div>
      )}
      <div className="h-[env(safe-area-inset-bottom)] bg-white shrink-0" />
    </div>
  );
}
