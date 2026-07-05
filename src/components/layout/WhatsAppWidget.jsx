import { Send, X } from "lucide-react";
import { useState } from "react";
import { WhatsAppIcon } from "../common/BrandIcons";
import { whatsappNumber } from "../../config/site";
import { NETLIFY_FORMS, submitNetlifyForm } from "../../utils/netlifyForms";

export function WhatsAppWidget() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState(
    "Hello Wintex, I would like to discuss a weighing system requirement.",
  );
  const [chatStatus, setChatStatus] = useState("");

  const sendChat = async () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(chatMessage)}`;
    setChatStatus("Saving interest...");
    try {
      await submitNetlifyForm(NETLIFY_FORMS.whatsappInterest, {
        message: chatMessage,
        source: "floating-whatsapp-widget",
      });
      setChatStatus("Opening WhatsApp...");
    } catch {
      setChatStatus("Opening WhatsApp...");
    }
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setChatStatus(""), 2400);
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
          {chatStatus && <p className="chat-status">{chatStatus}</p>}
        </div>
      )}
      <button
        className="chat-toggle"
        type="button"
        aria-label={chatOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        aria-expanded={chatOpen}
        onClick={() => setChatOpen((open) => !open)}
      >
        {chatOpen ? <X size={24} /> : <WhatsAppIcon />}
      </button>
    </div>
  );
}
