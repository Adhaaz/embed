const { Telegraf } = require('telegraf');

const bot = new Telegraf('6817115625:AAGZ2bt9sDF11Y41gRrQTCNIJuqjweTVDE0');

bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('????'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.command('server', (ctx) => {
  const serverInfo = `
Server Information:
- Platform: ${process.platform}
- Architecture: ${process.arch}
- Node.js Version: ${process.version}
- CPU Cores: ${require('os').cpus().length}
`;

  ctx.reply(serverInfo);
});

bot.launch();
