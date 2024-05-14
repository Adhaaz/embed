
const lolcatjs = require('lolcatjs');
const figlet = require('figlet');
const { ChalkAnimation } = require('@figliolia/chalk-animation');
const chalk = require('chalk');
const spawn = require('child_process').spawn;
const path = require('path');
const CFonts = require('cfonts');
const axios = require('axios');

lolcatjs.options.seed = Math.round(Math.random() * 1000);
lolcatjs.options.colors = true;

// Fungsi untuk menghasilkan teks dengan font dan warna tertentu
const generateText = () => {
    const topBottomLine = "╔═════════════════════════════════════════════════════════════════════╗"
    
    const middleLine = "│                                                                     │";
    const textLine1 = "│      ██████╗   █████╗  ███████╗ ██╗      ██╗ ██╗  ██╗ ██╗  ██╗      │";
    const textLine2 = "│      ██╔══██╗ ██╔══██╗ ██╔════╝ ██║      ██║ ╚██╗██╔╝ ╚██╗██╔╝      │";
    const textLine3 = "│      ██║  ██║ ███████║ █████╗   ██║      ██║  ╚███╔╝   ╚███╔╝       │";
    const textLine4 = "│      ██║  ██║ ██╔══██║ ██╔══╝   ██║      ██║  ██╔██╗   ██╔██╗       │";
    const textLine5 = "│      ██████╔╝ ██║  ██║ ██║      ███████╗ ██║ ██╔╝ ██╗ ██╔╝ ██╗      │";
    const textLine6 = "│      ╚═════╝  ╚═╝  ╚═╝ ╚═╝      ╚══════╝ ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝      │";
    const bottomLine =
 "╚═════════════════════════════════════════════════════════════════════╝"

    
  	    const maxLength = 100; 
		const text = "\x1b[1m\x1b[32mTelegram Bot\x1b[0m \x1b[3mV1.0.1\x1b[0m \x1b[37mBeta\x1b[0m";
		const padding = maxLength - text.length;
		const paddedText = " ".repeat(padding);
		const botVersionLine = `${paddedText}${text}`;

    console.log("\x1b[34m" + topBottomLine + "\x1b[0m");
console.log("\x1b[37m" + middleLine + "\x1b[0m");
console.log("\x1b[33m" + textLine1 + "\x1b[0m");
console.log("\x1b[33m" + textLine2 + "\x1b[0m");
console.log("\x1b[33m" + textLine3 + "\x1b[0m");
console.log("\x1b[33m" + textLine4 + "\x1b[0m");
console.log("\x1b[33m" + textLine5 + "\x1b[0m");
console.log("\x1b[36m" + textLine6 + "\x1b[0m");
console.log("\x1b[37m" + middleLine + "\x1b[0m");
console.log("\x1b[32m" + botVersionLine + "\x1b[0m");
console.log("\x1b[34m" + bottomLine + "\x1b[0m");
};

// Menampilkan tampilan yang diinginkan
generateText();

function start() {
  let args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)];

  const text = 'V1.0.1 BETA';
  const textTop = 'TELEGRAM BOT';
  CFonts.say(textTop, {
    font: 'chrome',
    align: 'center',
    colors: ['yellow', 'magenta'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: 0
  });

  // Menampilkan teks "V1.0.1 BETA" di bawah "TELEGRAM BOT" dengan ukuran lebih besar
  const configBig = {
    font: 'tiny',
    align: 'center',
    colors: ['magenta', 'white'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: 0
  };
  CFonts.say(text, configBig);

  setTimeout(() => {
    connectingAnimation.stop();
    console.log(chalk.green('[✅] Successfully connected to Telegram Server'));

    let p = spawn(process.argv[0], args, {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    })
    .on('message', data => {
      if (data == 'reset') {
        console.log('RESET');
        p.kill();
        start();
        delete p;
      }
    });
  }, 30000);

  // Handle FetchError
  process.on('uncaughtException', function (err) {
    if (err.message.includes('FetchError')) {
      console.log(chalk.red('[🚫] Connection to Telegram Server Lost!'));
      setTimeout(() => {
        console.log(chalk.yellow('[⏳] Reconnecting to Telegram Server..'));
        start();
      }, 5000);
    }
  });
}

// Memulai proses
start();

// Menampilkan garis pemisah
console.log('----------------------------------------');
const connectingAnimation = ChalkAnimation.rainbow('[⏳] Connecting to Server..');
connectingAnimation.start();