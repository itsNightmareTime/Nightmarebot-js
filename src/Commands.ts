import { Command } from './Command';
import Challenges from './commands/challenges';
import { Stats } from './commands/stats';

const Commands: Command[] = [Challenges, Stats];

export default Commands;
