// src/components/ChatArea.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithAI } from '../services/api';
import './ChatArea.css';

export default function ChatArea({ isReady }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm DocuMind. Upload a PDF from the sidebar, and then ask me anything about it!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    
    // Create history payload (excluding the current prompt)
    const historyPayload = messages.map(m => ({
        role: m.role,
        content: m.content
    }));

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithAI(userMessage.content, historyPayload);
      
      let aiContent = response.answer || response.response || response.message;
      if (!aiContent && typeof response === "string") {
        aiContent = response;
      }
      if (!aiContent) {
          aiContent = JSON.stringify(response);
      }
      
      const newMsg = { 
          role: 'ai', 
          content: aiContent,
          citations: response.citations || []
      };
      
      setMessages(prev => [...prev, newMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to backend API. Please check if the FastAPI server is running." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="chat-area animate-fade-in">
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className="avatar glass">
              {msg.role === 'ai' ? <Bot size={20} color="var(--accent-color)" /> : <User size={20} />}
            </div>
            <div className="message-content-group">
                <div className={`message-bubble ${msg.role === 'ai' ? 'glass ai-bubble' : 'user-bubble'}`}>
                  {msg.role === 'ai' ? (
                      <ReactMarkdown className="markdown-body">{msg.content}</ReactMarkdown>
                  ) : (
                      msg.content
                  )}
                </div>
                {msg.citations && msg.citations.length > 0 && (
                    <div className="citations-container">
                        {msg.citations.map((cite, cIdx) => (
                            <span key={cIdx} className="citation-badge">
                                Source: {cite.source} (Chunk {cite.chunk})
                            </span>
                        ))}
                    </div>
                )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper ai">
            <div className="avatar glass">
              <Bot size={20} color="var(--accent-color)" />
            </div>
            <div className="message-content-group">
                <div className="message-bubble glass ai-bubble animate-pulse">
                  Thinking...
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container glass">
        <form onSubmit={handleSend} className="input-form">
          <input 
            type="text" 
            className="chat-input"
            placeholder={isReady ? "Ask a question about your document..." : "Upload a document first..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="send-btn" disabled={!input.trim() || isLoading}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </main>
  );
}
