import { Send, X } from "lucide-react";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { whatsappNumber } from "../../config/site";

export function WhatsAppWidget() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState(
    "Hello Wintex, I would like to discuss a weighing system requirement.",
  );

  const sendChat = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(chatMessage)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={chatOpen ? "whatsapp-widget widget-open" : "whatsapp-widget"}>
      {chatOpen && (
        <div className="chat-panel">
          <div>
            <strong>Chat with Wintex</strong>
            <button
              type="button"
              aria-label="Close WhatsApp chat"
              onClick={() => setChatOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          <textarea
            value={chatMessage}
            onChange={(event) => setChatMessage(event.target.value)}
            rows="4"
          />
          <button type="button" onClick={sendChat}>
            <Send size={17} />
            Send to WhatsApp
          </button>
        </div>
      )}
      <button
        className="chat-toggle"
        type="button"
        aria-label={chatOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        aria-expanded={chatOpen}
        onClick={() => setChatOpen((open) => !open)}
      >
        {chatOpen ? <X size={24} /> : <FaWhatsapp />}
      </button>
    </div>
  );
}

