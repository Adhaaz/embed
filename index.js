const { Telegraf } = require('telegraf');
const os = require('os');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
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

bot.command('info-deploy', async (ctx) => {
  try {
    const response = await axios.get('https://api.vercel.com/v13/deployments/dpl_BvbM6n42CLEZHAp8STeHA4a3BSDn', {
      headers: {
        'Authorization': 'Bearer GAtTLN2cNDVUsm7qzgTcnoIH'
      }
    });

    const meki = response.json();
    const deployment = meki.data;

    let message = `
*Deployment Information*
- ID: ${deployment.id.replace(/./g, '*')}
- Name: ${deployment.name}
- Status: ${deployment.readyState}
- Canceled At: ${new Date(deployment.canceledAt).toLocaleString()}
- Created At: ${new Date(deployment.createdAt).toLocaleString()}
- Ready At: ${new Date(deployment.readyState).toLocaleString()}
- Aliases: ${deployment.alias.map(a => a.replace(/./g, '*')).join(', ')}
- Alias Assigned: ${deployment.aliasAssigned}
- Automatic Aliases: ${deployment.automaticAliases.join(', ')}
- Booted At: ${new Date(deployment.bootedAt).toLocaleString()}
- Building At: ${new Date(deployment.buildingAt).toLocaleString()}
- Build Skipped: ${deployment.buildSkipped}
- Init Ready At: ${new Date(deployment.initReadyAt).toLocaleString()}
- Lambdas: ${deployment.lambdas.map(lambda => lambda.id).join(', ')}
- Git Source:
  - Ref: ${deployment.gitSource.ref}
  - Repo ID: ${deployment.gitSource.repoId.replace(/./g, '*')}
  - Sha: ${deployment.gitSource.sha}
  - Type: ${deployment.gitSource.type}
  - PR ID: ${deployment.gitSource.prId}
- Creator:
  - UID: ${deployment.creator.uid.replace(/./g, '*')}
  - Username: ${deployment.creator.username.replace(/./g, '*')}
- Public: ${deployment.public}
- Regions: ${deployment.regions.join(', ')}
- Source: ${deployment.source}
- Status: ${deployment.status}
- Target: ${deployment.target}
- Team:
  - ID: ${deployment.team.id.replace(/./g, '*')}
  - Name: ${deployment.team.name}
  - Slug: ${deployment.team.slug.replace(/./g, '*')}
- Type: ${deployment.type}
- URL: ${deployment.url.replace(/./g, '*')}
- Version: ${deployment.version}
- Preview Comments Enabled: ${deployment.previewCommentsEnabled}
- Alias Assigned At: ${deployment.aliasAssignedAt ? new Date(deployment.aliasAssignedAt).toLocaleString() : 'N/A'}
- Build:
  - Env: ${deployment.build.env.join(', ')}
- Created In: ${deployment.createdIn}
- Env: ${deployment.env.join(', ')}
- Functions: ${deployment.functions ? JSON.stringify(deployment.functions) : 'N/A'}
- Inspector URL: ${deployment.inspectorUrl}
- Is In Concurrent Builds Queue: ${deployment.isInConcurrentBuildsQueue}
- Owner ID: ${deployment.ownerId.replace(/./g, '*')}
- Plan: ${deployment.plan}
- Project ID: ${deployment.projectId}
- Project Settings:
  - Build Command: ${deployment.projectSettings.buildCommand}
  - Dev Command: ${deployment.projectSettings.devCommand}
  - Framework: ${deployment.projectSettings.framework}
  - Command For Ignoring Build Step: ${deployment.projectSettings.commandForIgnoringBuildStep}
  - Install Command: ${deployment.projectSettings.installCommand}
  - Output Directory: ${deployment.projectSettings.outputDirectory}
  - Speed Insights:
    - ID: ${deployment.projectSettings.speedInsights.id}
    - Has Data: ${deployment.projectSettings.speedInsights.hasData}
  - Web Analytics:
    - ID: ${deployment.projectSettings.webAnalytics.id}
- Ready State Reason: ${deployment.readyStateReason}
- Routes: ${deployment.routes ? JSON.stringify(deployment.routes) : 'N/A'}
    `;

    await ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error(error);
    await ctx.reply('Error retrieving deployment information.');
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
