import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs';
import { getAllAudioBase64 } from 'google-tts-api';
import { join } from 'path';
import { promisify } from 'util';
import { generateRandomId } from '../../shared/helpers';

@Injectable()
export class TtsService {
  private asyncWriteFile = promisify(writeFile);

  public async toFile(text: string): Promise<string> {
    const filePath = join('tmp', `${generateRandomId(16)}.wav`);

    const speech = (
      await getAllAudioBase64(text, {
        lang: 'en',
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10_000,
      })
    ).reduce((concated, chunk) => concated + chunk.base64, '');

    return this.asyncWriteFile(filePath, speech, 'base64').then(() => filePath);
  }
}
