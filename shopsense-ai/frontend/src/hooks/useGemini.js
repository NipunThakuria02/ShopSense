import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../lib/gemini';
import { sanitizeInput } from '../lib/utils';
import toast from 'react-hot-toast';

export function useGemini() {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const abortRef = useRef(false);

  const sendMessage = useCallback(async (text) => {
    const safe = sanitizeInput(text);
    if (!safe) return;

    // Add user message to history
    const userMsg = { role: 'user', parts: [{ text: safe }], timestamp: Date.now() };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setLoading(true);
    setStreamingText('');
    abortRef.current = false;

    // Build history without timestamps for Gemini API
    const apiHistory = chatHistory.map(({ role, parts }) => ({ role, parts }));

    try {
      const stream = await sendChatMessage(apiHistory, safe);
      let fullText = '';

      for await (const chunk of stream) {
        if (abortRef.current) break;
        const chunkText = chunk.text();
        fullText += chunkText;
        setStreamingText(fullText);
      }

      // Commit the full AI response to history
      const aiMsg = {
        role: 'model',
        parts: [{ text: fullText }],
        timestamp: Date.now(),
      };
      setChatHistory([...newHistory, aiMsg]);
      setStreamingText('');
    } catch (err) {
      console.error('Gemini error:', err);
      toast.error('AI is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }, [chatHistory]);

  const resetChat = useCallback(() => {
    abortRef.current = true;
    setChatHistory([]);
    setStreamingText('');
    setLoading(false);
  }, []);

  return { chatHistory, loading, streamingText, sendMessage, resetChat };
}
