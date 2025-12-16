import { Injectable } from '@nestjs/common';
import { TelegrabBotService } from './services/TelegramBot.service';

@Injectable()
export class AppService {
  constructor(private readonly telegramBotService: TelegrabBotService) {}

  async getHello(): Promise<string> {
    const message = 'Hello World!';
    console.log(await this.telegramBotService.sendMessage(message));
    return message;
  }
}
