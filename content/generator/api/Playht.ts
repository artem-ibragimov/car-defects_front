import * as PlayHT from 'playht';
import fs from 'fs';

export class Playht {

   constructor(cfg: { userId: string, apiKey: string; }) {
      PlayHT.init(cfg);
   }

   generateVoice(filename: string, text: string) {
      return PlayHT.stream(text, {
         speed: 1.2,
         // voiceEngine: 'Play3.0-mini',
         // voiceEngine: 'PlayHT2.0-turbo',
         model: 'PlayDialog',
         outputFormat: 'mp3',
         language: 'english',
         voiceId: 's3://voice-cloning-zero-shot/65977f5e-a22a-4b36-861b-ecede19bdd65/original/manifest.json',
         voice: 's3://voice-cloning-zero-shot/65977f5e-a22a-4b36-861b-ecede19bdd65/original/manifest.json',
         // voiceId: 's3://voice-cloning-zero-shot/65977f5e-a22a-4b36-861b-ecede19bdd65/original/manifest.json',
         // voice: 's3://voice-cloning-zero-shot/e040bd1b-f190-4bdb-83f0-75ef85b18f84/original/manifest.json',
      })
         .then((stream) => {
            return new Promise<string>((resolve, reject) => {
               stream.on('data', (chunk) => {
                  fs.appendFileSync(filename, chunk);
               });
               stream.on('end', () => resolve('✅ voice'));
               stream.on('error', reject);
            });
         }).catch(console.error);
   }
}