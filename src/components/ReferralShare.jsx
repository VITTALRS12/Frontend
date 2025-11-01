import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  FaWhatsapp,
  FaFacebook,
  FaFacebookMessenger,
  FaEnvelope,
} from "react-icons/fa";
import "./ReferralShare.css";

const ReferralShare = ({ referralCode }) => {
  const [copied, setCopied] = useState(false);

  const baseURL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:5173";
  const referralLink = `${baseURL}/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="refer-page">
      <div className="refer-card">
        <div className="icon-section">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828859.png"
            alt="megaphone"
          />
        </div>

        <h2>Refer us to your friends!</h2>
        <p>
          Share the love and introduce us to your family, friends, and
          colleagues!
        </p>

        <div className="share-list">
          <a
            href={`sms:?body=Join%20PrizeArena!%20Use%20my%20referral%20link:%20${encodeURIComponent(
              referralLink
            )}`}
            className="share-item"
          >
            <FaWhatsapp className="icon whatsapp" />
            Share as Text message
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              referralLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-item"
          >
            <FaFacebook className="icon facebook" />
            Share on Facebook
          </a>

          {/* <a
            href={`https://www.messenger.com/t/?link=${encodeURIComponent(
              referralLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-item"
          >
            <FaFacebookMessenger className="icon messenger" />
            Share as Facebook Message
          </a> */}

          <a
            href={`mailto:?subject=Join%20PrizeArena&body=Use%20my%20referral%20link:%20${referralLink}`}
            className="share-item"
          >
            <FaEnvelope className="icon email" />
            Share as Email
          </a>
        </div>

        <div className="referral-copy">
          <input type="text" value={referralLink} readOnly />
          <button onClick={handleCopy} className="copy-btn">
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <div className="illustration">
        <img
          src="/kk.webp1.webp"
          alt="referral illustration"
        />
      </div>
    </div>
  );
};

export default ReferralShare;
