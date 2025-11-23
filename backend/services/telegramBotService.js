import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const TelegramBot = require('node-telegram-bot-api');

import Booking from '../models/Booking.js';
import 'dotenv/config';

let bot = null;

export const initTelegramBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    console.log('⚠️ TELEGRAM_BOT_TOKEN not found. Telegram Bot skipped.');
    return;
  }

  try {
    // Create a bot that uses 'polling' to fetch new updates
    bot = new TelegramBot(token, { polling: true });
    
    // Handle polling errors to prevent crash
    bot.on('polling_error', (error) => {
      // Ignore "ETELEGRAM: 409 Conflict" errors which happen during restarts
      if (error.code === 'ETELEGRAM' && error.message.includes('409 Conflict')) {
        return;
      }
      console.error('⚠️ Telegram Polling Error:', error.message);
    });

    console.log('🤖 Telegram Bot initialized successfully!');

    // Handle /start command (with optional booking ID parameter)
    bot.onText(/\/start (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const param = match[1]; // The parameter passed after /start

      if (param && param.startsWith('booking_')) {
        const bookingId = param.replace('booking_', '');
        await handleBookingInquiry(chatId, bookingId);
      } else {
        bot.sendMessage(chatId, "Welcome to LYAN Restaurant Bot! 🍽️\n\nI can help you check your booking details. Please use the link provided in your booking confirmation.");
      }
    });

    // Handle general /start without parameter
    bot.onText(/\/start$/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, "Welcome to LYAN Restaurant Bot! 🍽️\n\nI can help you check your booking details. Please use the link provided in your booking confirmation.");
    });

    // Handle callback queries from inline buttons
    bot.on('callback_query', async (callbackQuery) => {
      const message = callbackQuery.message;
      const data = callbackQuery.data;
      const chatId = message.chat.id;

      if (data.startsWith('details_')) {
        const bookingId = data.replace('details_', '');
        await handleBookingInquiry(chatId, bookingId);
      } else if (data === 'contact_agent') {
        bot.sendMessage(chatId, "📞 *Contact Support*\n\nYou can reach our concierge directly at:\nPhone: +971 56 356 1803\nEmail: info@lyanrestaurant.com", { parse_mode: 'Markdown' });
      } else if (data.startsWith('cancel_')) {
        bot.sendMessage(chatId, "To cancel your booking, please contact our support team directly or visit your dashboard.");
      }

      // Answer the callback query to remove the loading state
      bot.answerCallbackQuery(callbackQuery.id);
    });

    console.log('✅ Telegram Bot listeners attached');
  } catch (error) {
    console.error('❌ Failed to initialize Telegram Bot:', error.message);
  }
};

const handleBookingInquiry = async (chatId, bookingId) => {
  try {
    const booking = await Booking.findById(bookingId).populate('packageId');

    if (!booking) {
      bot.sendMessage(chatId, "❌ Sorry, I couldn't find a booking with that ID.");
      return;
    }

    const eventDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    let message = `🎉 *BOOKING CONFIRMED* 🎉\n\n`;
    message += `👤 *Guest:* ${booking.customerName}\n`;
    message += `📅 *Date:* ${eventDate}\n`;
    message += `🕐 *Time:* ${booking.eventTime}\n`;
    message += `📍 *Location:* ${booking.locationType}\n`;
    message += `👥 *Guests:* ${booking.numberOfGuests || 'TBD'}\n\n`;

    if (booking.packageId) {
      message += `📦 *Package:* ${booking.packageId.name}\n`;
      message += `💵 *Price:* ${booking.packageId.discountedPrice || booking.packageId.price} ETB\n`;
      message += `📝 *Description:* ${booking.packageId.description.substring(0, 100)}...\n\n`;
    }

    message += `💰 *Total Status:* ${booking.totalAmount > 0 ? booking.totalAmount + ' ETB' : 'To be discussed'}\n`;
    message += `⚡ *Status:* ${booking.status.toUpperCase()}\n`;

    const opts = {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📜 Full Details', callback_data: `details_${booking._id}` },
            { text: '📞 Contact Agent', callback_data: 'contact_agent' }
          ],
          [
            { text: '🌐 View on Website', url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-bookings` }
          ]
        ]
      }
    };

    bot.sendMessage(chatId, message, opts);

  } catch (error) {
    console.error('Error fetching booking for bot:', error);
    bot.sendMessage(chatId, "⚠️ An error occurred while fetching your booking details.");
  }
};
