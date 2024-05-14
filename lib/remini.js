const FormData = require('form-data');
const Jimp = require('jimp');

async function remini(imageData, effect) {
  return new Promise(async (resolve, reject) => {
    let availableEffects = ['enhance', 'recolor', 'remini'];
    effect = availableEffects.includes(effect) ? effect : availableEffects[0];

    let formData = new FormData();
    let url = `https://${effect}.vyro.ai`;

    formData.append('image', Buffer.from(imageData), {
      'filename': 'enhance_image_body.jpg',
      'contentType': 'image/jpeg'
    });

    formData.submit({
      'url': url,
      'host': 'inferenceengine.vyro.ai',
      'path': `/${effect}`,
      'protocol': 'https:',
      'headers': {
        'User-Agent': 'okhttp/4.9.3',
        'Connection': 'Keep-Alive',
        'Accept-Encoding': 'gzip'
      }
    }, function (error, response) {
      if (error) reject();
      let chunks = [];
      response.on('data', function (data) {
        chunks.push(data);
      }).on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      response.on('error', (error) => {
        reject();
      });
    });
  });
}

module.exports.remini = remini;