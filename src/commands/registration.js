const registrationService = require("../services/registrationService");
const mockData = require("../helpers/mockData");
const User = require("../models/User");

module.exports = (bot) => {
  // Start komandasi
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    console.log(chatId);
    const Finduser = await User.findOne({ chatId: chatId });
    console.log(Finduser);
    if (Finduser) {
      bot.sendMessage(
        chatId,
        `Assalamu aleykum! <b>${Finduser?.fio}</b>\n\n✅ Siz allaqachon ro'yxatga qo'shilgansiz.\n\n` +
          `ℹ️ Sizning bizdagi ma'lumotlartingiz:\n` +
          `<b>👤 Ism:</b> ${Finduser?.fio}\n` +
          `<b>🆔 ID:</b> ${Finduser?.chatId}\n` +
          `<b>🏢 Tuman:</b> ${Finduser?.district}\n` +
          `<b>🏫 Maktab:</b> ${Finduser?.school}\n` +
          `<b>📕 Fan:</b> ${Finduser?.subject}\n` +
          `<b>📞 Telefon:</b> ${Finduser?.phone}`,
        { parse_mode: "HTML" } // HTML formatini ishlatyapmiz
      );
    } else {
      bot.sendMessage(chatId, "Tumanni tanlang:", {
        reply_markup: {
          inline_keyboard: mockData.districts.map((district) => [
            { text: district, callback_data: `district_${district}` },
          ]),
        },
      });
    }
  });

  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const data = query.data;

    bot.answerCallbackQuery(query.id); // Callbackni to'xtatish

    // 1. Tuman tanlash
    if (data.startsWith("district_")) {
      const district = data.split("_")[1];

      bot.deleteMessage(chatId, messageId); // Eski xabarni o'chirish
      bot.sendMessage(
        chatId,
        `Tanlangan tuman: ${district}. Maktabni tanlang:`,
        {
          reply_markup: {
            inline_keyboard: mockData.schools[district].map((school) => [
              { text: school, callback_data: `school_${district}_${school}` },
            ]),
          },
        }
      );
    }
    // 2. Maktab tanlash
    else if (data.startsWith("school_")) {
      const [_, district, school] = data.split("_");

      bot.deleteMessage(chatId, messageId); // Eski xabarni o'chirish
      bot.sendMessage(
        chatId,
        `Tanlangan maktab: ${school}. Ismingizni tanlang:`,
        {
          reply_markup: {
            inline_keyboard: mockData.users
              .filter(
                (user) => user.district === district && user.school === school
              )
              .map((user) => [
                {
                  text: user.fio,
                  callback_data: `user_${user.id}`,
                },
              ]),
          },
        }
      );
    }
    // 3. Ism va familiyani tanlash
    else if (data.startsWith("user_")) {
      const userId = parseInt(data.split("_")[1], 10);
      const user = mockData.users.find((u) => u.id === userId);

      bot.deleteMessage(chatId, messageId); // Eski xabarni o'chirish
      bot.sendMessage(
        chatId,
        `Ma'lumotlar to'g'riligini tekshiring:\n\n` +
          `👤 Ism: ${user.fio}\n` +
          `🏢 Tuman: ${user.district}\n` +
          `🏫 Maktab: ${user.school}\n` +
          `📕 Fan: ${user.subject}\n` +
          `📞 Telefon: ${user.phone}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Tasdiqlash",
                  callback_data: `confirm_${userId}`,
                },
              ],
              [{ text: "Qaytadan", callback_data: "register" }],
            ],
          },
        }
      );
    }
    // 4. Tasdiqlash
    else if (data.startsWith("confirm_")) {
      const userId = parseInt(data.split("_")[1], 10);
      const user = mockData.users.find((u) => u.id === userId);

      try {
        await registrationService.saveUser({
          chatId,
          district: user.district,
          school: user.school,
          fio: user.fio,
          subject: user.subject,
          phone: user.phone,
          role: user.role,
        });

        bot.deleteMessage(chatId, messageId); // Eski xabarni o'chirish
        bot.sendMessage(
          chatId,
          "✅ Ma'lumotlaringiz muvaffaqiyatli saqlandi. Rahmat!\n\nQaytadan /start buyrug'ini bering!"
        );
      } catch (error) {
        bot.sendMessage(
          chatId,
          "❌ Ma'lumotlarni saqlashda xatolik yuz berdi. @anonim_opisis"
        );
        console.error(error.message);
      }
    }
  });
};
