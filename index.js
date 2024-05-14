const { Telegraf } = require('telegraf');
const os = require('os');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ytdls = require('ytdl-core');
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const axios = require('axios');


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


bot.command('play', async (ctx) => {
  const args = ctx.message.text.split(" ");
  
  if (!args[1]) {
    ctx.reply("Masukan Query!\n\nContoh:\n.play <judul lagu> --type <Audio atau Video>");
    return;
  }

  try {
    let query = "";
    let type = "Audio";

    for (let i = 1; i < args.length; i++) {
      if (args[i] === "--type") {
        type = args[i + 1];
        i++;
      } else {
        query += args[i] + " ";
      }
    }

    query = query.trim();

    const { videos } = await yts(query);

    if (videos.length === 0) {
      ctx.reply(`Tidak dapat menemukan video untuk query "${query}".`);
      return;
    }

    const video = videos[0];
    const videoTitle = video.title;
    currentVideoTitle = videoTitle;
    const videoId = video.videoId;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const infoMessage = `[ YouTube Play ]
    
🎶 Title: ${videoTitle}      
⏱️ Duration: ${video.duration.timestamp} ⏱️
👁️ Views: ${video.views} person
🧑‍🎤 Uploader: [${video.author.name}]
🔗 URL: ${videoUrl} 
    `;

    ctx.replyWithPhoto(video.thumbnail, {
      caption: infoMessage,
      reply_to_message_id: ctx.message.message_id,
    });

    try {
      const videoInfo = await ytdl.getInfo(
        `https://www.youtube.com/watch?v=${videoId}`
      );
      console.log(videoInfo);

      if (type.toLowerCase() === "audio") {
        const audioStream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {
          filter: "audioonly",
        });

        await ctx.replyWithAudio(
          { source: audioStream },
          {
            caption: videoTitle,
            reply_to_message_id: ctx.message.message_id,
            filename: `${videoTitle}.mp3`,
          }
        );
      } else {
        const format = ytdl.chooseFormat(videoInfo.formats, {
          quality: "lowest",
        });
        const videoStream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, {
          format: format,
        });
        const thumbnailUrl = videoInfo.videoDetails.thumbnails[0].url;

        await ctx.replyWithVideo(
          { source: videoStream },
          {
            caption: videoTitle,
            reply_to_message_id: ctx.message.message_id,
            thumb: thumbnailUrl,
          }
        );
      }
    } catch (error) {
      console.error(error);
      ctx.reply(config.msg.error);
    }
  } catch (error) {
    console.error(error);
    ctx.reply(config.msg.error);
  }
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
  - CPU Model:  ${os.cpus()[0].model}
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
