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
  const deployInfo = getDeployInfo();
  const vercelDeployInfo = getVercelDeployInfo();
  const runtimeInfo = getRuntimeInfo(deployInfo, vercelDeployInfo);
  const serverInfo = getServerInfo();

  ctx.replyWithPhoto(
    { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8Y7KfvqqCbfgCk3dsSAGgaQxmrOLYPuVSPg&usqp=CAU' },
    { caption: `${runtimeInfo}\n\n${serverInfo}` }
  );
});

function getDeployInfo() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    return 'N/A';
  }
}

function getVercelDeployInfo() {
  try {
    const vercelOutput = execSync('vercel --prod --json').toString().trim();
    return JSON.parse(vercelOutput);
  } catch (error) {
    return { url: 'N/A', deploymentId: 'N/A' };
  }
}

function getRuntimeInfo(deployInfo, vercelDeployInfo) {
  return `
Runtime Information:
- Node.js Version: ${process.version}
- Deployment Commit: ${deployInfo}
- Vercel Deployment URL: ${vercelDeployInfo.url}
- Vercel Deployment ID: ${vercelDeployInfo.deploymentId}
- Process ID: ${process.pid}
- Uptime: ${formatUptime(process.uptime())}
`;
}

function getServerInfo() {
  return `
Server Information:
- Platform: ${process.platform}
- Architecture: ${process.arch}
  - CPU Model: ${os.cpus()[0].model}
  - CPU Cores: ${os.cpus().length}
  - CPU Usage: ${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%
- Total Memory: ${formatMemory(os.totalmem())}
- Free Memory: ${formatMemory(os.freemem())} (${((os.freemem() / os.totalmem()) * 100).toFixed(2)}%)
- Uptime: ${formatUptime(os.uptime())}
- OS Type: ${os.type()}
- OS Release: ${os.release()}
- IP Address: ${getIPAddress() || 'N/A'}
`;
}

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
}

function formatMemory(bytes) {
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function getIPAddress() {
  const interfaces = os.networkInterfaces();
  const addresses = Object.values(interfaces).flat().find(i => i.family === 'IPv4' && !i.internal);
  return addresses?.address;
}

bot.launch();
