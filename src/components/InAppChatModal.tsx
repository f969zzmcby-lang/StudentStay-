import React, { useState } from 'react';
import { Property, Room, Conversation, ChatMessage } from '../types';
import {
  X,
  Send,
  MessageSquare,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface InAppChatModalProps {
  property: Property;
  room?: Room | null;
  conversation?: Conversation | null;
  onClose: () => void;
  onSendMessage: (
    propertyId: string,
    roomId: string | undefined,
    studentName: string,
    studentPhone: string,
    messageText: string
  ) => void;
  onDirectWhatsApp: () => void;
}

export const InAppChatModal: React.FC<InAppChatModalProps> = ({
  property,
  room,
  conversation,
  onClose,
  onSendMessage,
  onDirectWhatsApp,
}) => {
  const [studentName, setStudentName] = useState(conversation?.studentName || '');
  const [studentPhone, setStudentPhone] = useState(conversation?.studentPhone || '');
  const [inputText, setInputText] = useState('');
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(!!conversation);

  const messages = conversation?.messages || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (!studentName.trim() || !studentPhone.trim()) return;

    onSendMessage(
      property.id,
      room?.id,
      studentName.trim(),
      studentPhone.trim(),
      inputText.trim()
    );

    setInputText('');
    setHasSentFirstMessage(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[580px] max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              {property.landlord.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900">{property.landlord.name}</span>
                {property.landlord.isVerified && (
                  <span title="Verified Landlord">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                {property.name} {room ? `· ${room.roomNumber}` : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDirectWhatsApp}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Switch to direct WhatsApp"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Direct WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Identity collection (if not set yet) */}
        {!hasSentFirstMessage && messages.length === 0 && (
          <div className="bg-amber-50/80 p-3.5 border-b border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="font-semibold flex items-center gap-1.5">
              <span>Enter your student details to start this in-app conversation:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Your Name (e.g. Sibusiso)"
                className="bg-white border border-amber-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                type="tel"
                required
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="Phone/WhatsApp (e.g. 072 123 4567)"
                className="bg-white border border-amber-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs">
          {/* Welcome Info Box */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 text-center space-y-1 text-slate-600">
            <p className="font-medium text-slate-800">
              You are communicating directly with {property.landlord.name}.
            </p>
            <p className="text-[11px] text-slate-500">
              Inquiries regarding <strong>{property.name}</strong> {room ? `(${room.roomNumber})` : ''}.
              Replies will appear here, or you can switch to direct WhatsApp anytime.
            </p>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
              <p>No messages yet. Ask about room availability, viewing times, or NSFAS funding.</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {[
                  'Is this room available for next month?',
                  'Can I book a viewing this Saturday?',
                  'Do you take NSFAS accredited funding?',
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(preset)}
                    className="text-[11px] bg-white border border-slate-200 hover:border-amber-400 text-slate-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isStudent = msg.sender === 'student';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-0.5 px-1 font-medium">
                    {msg.senderName} · {msg.timestamp}
                  </div>
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                      isStudent
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs'
                        : 'bg-white text-slate-900 border border-slate-200 shadow-2xs rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message to the landlord..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
