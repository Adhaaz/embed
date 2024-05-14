const { Telegraf } = require('telegraf');
const os = require('os');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');


const bot = new Telegraf('6817115625:AAGZ2bt9sDF11Y41gRrQTCNIJuqjweTVDE0');


bot.start((ctx) => ctx.reply('Welcome!'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('????'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));


bot.command('download', async (ctx) => {
  try {
    // Mendapatkan URL video dari pengguna
    const url = ctx.message.text.split(' ')[1];

    // Menggunakan ytdl-core untuk mendapatkan informasi video
    const info = await ytdl.getInfo(url);
    console.log(info)

    // Membuat pesan dengan informasi video
    const message = `
Title: ${info.videoDetails.title}
Duration: ${info.videoDetails.lengthSeconds} seconds
Size: ${(info.videoDetails.filesize / 1024 / 1024).toFixed(2)} MB
`;

    // Mengirim pesan ke pengguna
    await ctx.reply(message);

    // Mengunggah video ke chat
    await ctx.replyWithVideo({ url: info.videoDetails.video_url });
  } catch (error) {
    // Menangani kesalahan
    console.error(error);
    await ctx.reply('Terjadi kesalahan saat mengunduh video.');
  }
});

bot.command('server', (ctx) => {
  // Get deploy information
  let deployInfo;
  try {
    deployInfo = execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    deployInfo = 'N/A';
  }

  // Get Vercel deployment information
  let vercelDeployInfo;
  try {
    vercelDeployInfo = execSync('vercel --prod --json').toString().trim();
    vercelDeployInfo = JSON.parse(vercelDeployInfo);
  } catch (error) {
    vercelDeployInfo = { url: 'N/A', deploymentId: 'N/A' };
  }

  // Get runtime information
  const runtimeInfo = `
Runtime Information:
- Node.js Version: ${process.version}
- Deployment Commit: ${deployInfo}
- Vercel Deployment URL: ${vercelDeployInfo.url}
- Vercel Deployment ID: ${vercelDeployInfo.deploymentId}
- Process ID: ${process.pid}
- Uptime: ${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m ${Math.floor(process.uptime() % 60)}s
`;

  // Get server information
  const serverInfo = `
Server Information:
- Platform: ${process.platform}
- Architecture: ${process.arch}
- CPU Cores: ${os.cpus().length}
- Total Memory: ${(os.totalmem() / (1024 * 1024)).toFixed(2)} MB
- Free Memory: ${(os.freemem() / (1024 * 1024)).toFixed(2)} MB
- Uptime: ${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m ${Math.floor(os.uptime() % 60)}s
- OS Type: ${os.type()}
- OS Release: ${os.release()}
`;

  ctx.reply(`${runtimeInfo}\n\n${serverInfo}`);
});

bot.launch();
