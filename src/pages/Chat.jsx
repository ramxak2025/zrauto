import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import { ChevronLeft, Send, Image as ImageIcon, Smile } from 'lucide-react';

export default function Chat() {
  const navigate = useNavigate();
  const { currentUser, messages, sendMessage, getUserById, users } = useApp();
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
    if (diff > 80) navigate(-1);
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

  const onlineCount = users.filter(u => u.status !== 'offline' && u.id !== currentUser.id).length;
  let lastDate = '';

  return (
    <div
      className="fixed inset-0 bg-[#0a0a0a] z-[100] flex flex-col slide-in-right"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="glass-nav px-3 py-3 flex items-center gap-3 shrink-0 border-b border-white/5">
        <button
          onClick={() => navigate(-1)}
          className="btn-press p-1.5 rounded-xl hover:bg-white/5"
        >
          <ChevronLeft size={24} className="text-white/70" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-semibold text-white">Общий чат</h1>
          <p className="text-xs text-white/30">
            {onlineCount > 0 ? `${onlineCount} онлайн` : 'Нет активных'}
            {' · '}{messages.length} сообщений
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
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
                <div className="flex justify-center my-4">
                  <span className="glass text-white/40 text-[11px] px-3 py-1 rounded-full font-medium">
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
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
                    isMe
                      ? 'bg-brand text-white rounded-tr-md'
                      : 'glass rounded-tl-md'
                  }`}
                >
                  {!isMe && (
                    <p className={`text-xs font-semibold mb-0.5 ${
                      sender?.isBestMaster ? 'text-gold' : 'text-brand'
                    }`}>
                      {sender?.isBestMaster && '★ '}{sender?.name || 'Удален'}
                    </p>
                  )}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt=""
                      className="rounded-xl mb-1.5 max-w-full max-h-52 object-cover"
                    />
                  )}
                  {msg.text && (
                    <p className={`text-sm leading-relaxed break-words ${!isMe ? 'text-white/90' : ''}`}>
                      {msg.text}
                    </p>
                  )}
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-white/50' : 'text-white/30'} text-right`}>
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
        <div className="glass-nav px-4 py-4 text-center text-sm text-white/30 border-t border-white/5">
          Вы заблокированы в чате
        </div>
      ) : (
        <div className="glass-nav px-3 py-3 flex items-end gap-2 shrink-0 border-t border-white/5">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-press p-2.5 text-white/30 hover:text-white/50 shrink-0 rounded-xl hover:bg-white/5"
          >
            <ImageIcon size={22} />
          </button>
          <div className="flex-1 glass-input rounded-2xl px-4 py-2.5 border-0">
            <input
              type="text"
              placeholder="Сообщение..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-white/25"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className={`btn-press p-2.5 shrink-0 rounded-xl transition-all ${
              text.trim()
                ? 'bg-brand text-white shadow-lg shadow-brand/20'
                : 'text-white/15'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      )}
      <div className="h-[env(safe-area-inset-bottom)] bg-[#0a0a0a] shrink-0" />
    </div>
  );
}
