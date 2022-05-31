import { Injectable } from '@nestjs/common';
import { join } from 'path';
import say from 'say';
import { generateRandomId } from 'src/shared/helpers';
import { promisify } from 'util';

@Injectable()
export class TtsService {
  private saySpeak = promisify(say.speak.bind(say));
  private sayExport = promisify(say.export.bind(say));

  public async say(text: string): Promise<void> {
    return this.saySpeak(text, 'Alex', 0.75);
  }

  public async toFile(text: string): Promise<string> {
    const filePath = join('tmp', `${generateRandomId(16)}.wav`);

    await this.sayExport(text, 'Alex', 0.75, join(process.cwd(), filePath));

    return filePath;
  }
}
