import { useState, useRef, useEffect } from 'react';
import { useGemini } from '../hooks/useGemini';
import { useAuth } from '../hooks/useAuth';

const QUICK_CHIPS = [
  'Find gifts under ₹2000',
  'Show trending electronics',
  'Best budget laptops',
  'Affordable running shoes',
  'Top skincare under ₹500',
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 glass-card w-fit" aria-label="AI is typing">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

function ChatBubble({ message, isUser }) {
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a7a5ff] to-[#645efb] flex items-center justify-center shrink-0" aria-hidden="true">
          <span className="text-sm">🤖</span>
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-[#4F46E5] to-[#645efb] text-white rounded-br-sm'
            : 'glass-card text-[#dee5ff] rounded-bl-sm'
        }`}
      >
        {message.parts[0].text}
      </div>
    </div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const { chatHistory, loading, streamingText, sendMessage, resetChat } = useGemini();
  const { currentUser } = useAuth();
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, streamingText, loading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = () => {
    if (!inputText.trim() || loading) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI shopping assistant"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                     bg-gradient-to-br from-[#a7a5ff] to-[#4F46E5]
                     flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.6)]
                     hover:scale-110 active:scale-95 transition-all duration-200 animate-pulse-glow"
        >
          <span className="text-2xl" role="img" aria-hidden="true">✨</span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[360px] h-[560px] glass-card
                     flex flex-col border border-[#40485d]/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                     animate-slide-up"
          role="dialog"
          aria-label="ShopSense AI Chat Assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#40485d]/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a7a5ff] to-[#645efb] flex items-center justify-center">
                <span>🤖</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#dee5ff]">ShopSense AI</p>
                <p className="text-xs text-[#a3aac4]">Powered by Gemini</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetChat}
                aria-label="Reset conversation"
                className="text-[#a3aac4] hover:text-[#dee5ff] transition-colors p-1"
                title="New chat"
              >
                ↺
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-[#a3aac4] hover:text-[#dee5ff] transition-colors p-1"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {chatHistory.length === 0 && (
              <div className="text-center text-[#a3aac4] text-sm mt-4">
                <p className="text-2xl mb-2">👋</p>
                <p>Hi{currentUser ? `, ${currentUser.displayName?.split(' ')[0]}` : ''}! I'm ShopSense AI.</p>
                <p className="text-xs mt-1">Ask me anything about shopping in India.</p>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <ChatBubble key={i} message={msg} isUser={msg.role === 'user'} />
            ))}
            {loading && !streamingText && <TypingIndicator />}
            {streamingText && (
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a7a5ff] to-[#645efb] flex items-center justify-center shrink-0">
                  <span className="text-sm">🤖</span>
                </div>
                <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-sm max-w-[75%] text-sm text-[#dee5ff] leading-relaxed">
                  {streamingText}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick chips */}
          {chatHistory.length === 0 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="chip text-xs"
                  aria-label={`Quick prompt: ${chip}`}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-[#40485d]/20">
            <div className="flex gap-2 bg-[#091328] rounded-xl px-3 py-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about products, deals..."
                aria-label="Chat message input"
                className="flex-1 bg-transparent text-sm text-[#dee5ff] placeholder-[#a3aac4] focus:outline-none"
                maxLength={500}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || loading}
                aria-label="Send message"
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a7a5ff] to-[#645efb]
                           flex items-center justify-center text-black font-bold
                           disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWidget;
