
import SocialPost from 'social-post-api';
import chalk from 'chalk';
import { createWriteStream, readFile, readFileSync, writeFile, writeFileSync } from 'fs';
import { get } from 'https';
import { OpenAI } from 'openai';
import { createInterface } from 'readline';

const social = new SocialPost("66H3ABB-NZ9MW1R-M6MWFSA-6VHPXRW");



try {
   const file = './content/posted.txt';
   const posted = readFileSync(file).toString().split("\n");
   const json = JSON.parse(readFileSync(`src/lib/i18n/en.json`).toString());
   const poster = Object.keys(json.text.article).filter((t) => !posted.includes(t))[0];
   post(`${json.text.article[poster].text}\n\nhttps://car-defects.com/articles/en/${poster}/`,
      [`https://car-defects.com/assets/img/${poster}--640.webp`])
      .then(() => {
         writeFileSync(file, posted.concat(poster).join('\n'));
      }).catch(console.error);
} catch (error) {
   console.error(error);
}

function post(text, mediaUrls) {
   return social.post({
      "post": text,
      "platforms": ["facebook", "twitter", "youtube", "reddit", "pinterest"],
      mediaUrls,
   }).then((res) => {
      if (res.status === 'error') { throw res; }
      console.log(res);
   });
}

