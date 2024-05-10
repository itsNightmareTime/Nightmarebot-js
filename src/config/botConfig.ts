import { readFileSync } from 'fs';
import { resolve } from 'path';
import { load } from 'js-yaml';
import { privateEncrypt } from 'crypto';

export interface BotConfig {
  token: string;
  swatBaseUrl: string;
}

const isBotConfig = (
  config: BotConfig,
): boolean => config.token !== undefined
  && config.swatBaseUrl !== undefined;

const configFile = 'src/config/config.yml';

const botConfig = load(readFileSync(resolve(configFile), 'utf8')) as BotConfig;

if (!isBotConfig(botConfig)) {
  throw new TypeError(`Invalid Configuration: ${configFile}`);
}

export default botConfig;
