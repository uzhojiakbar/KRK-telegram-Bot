require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const connectDB = require("./src/config/database");
const registerRoutes = require("./src/routes");

// Botni boshlash
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Bazani ulash
connectDB();

bot.onText(
  /\/start loc_(\d+)_(\-?\d+\.\d+)_(\-?\d+\.\d+)/,
  async (msg, match) => {
    const chatId = match[1]; // Foydalanuvchi ID
    const latitude = match[2]; // Kenglik
    const longitude = match[3]; // Uzunlik

    // Foydalanuvchiga kordinatalarni ko‘rsatish
    bot.sendMessage(
      chatId,
      `Sizning geolokatsiyangiz qabul qilindi:\n\nLatitude: ${latitude}\nLongitude: ${longitude}`
    );

    // Kordinatalarni ma'lumotlar bazasiga saqlash yoki boshqa amallarni bajarish
    // await saveLocationToDB(chatId, latitude, longitude);
  }
);

// Komandalarni ro'yxatga olish
registerRoutes(bot);

console.log("Bot ishga tushirildi!");
