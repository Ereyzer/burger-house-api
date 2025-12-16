import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { envVars, envVarValue } from '../config/constants/env-constants';

@Injectable()
export class TelegrabBotService {
  private readonly BASE_URL = 'https://api.telegram.org';
  private readonly CHAT_ID = envVarValue[envVars.TELEGRAM_CHAT_ID];
  private readonly TELEGRAM_BOT_KEY = envVarValue[envVars.TELEGRAM_BOT_KEY];

  sendMessage = async (message: string): Promise<void> => {
    const url = `${this.BASE_URL}/bot${this.TELEGRAM_BOT_KEY}/sendMessage?chat_id=${this.CHAT_ID}&text=${message}`;
    await axios.get(url);
  };
}
