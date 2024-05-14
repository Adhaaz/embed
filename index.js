const { Telegraf } = require('telegraf');

const bot = new Telegraf('6817115625:AAGZ2bt9sDF11Y41gRrQTCNIJuqjweTVDE0');

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('????'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.launch();
