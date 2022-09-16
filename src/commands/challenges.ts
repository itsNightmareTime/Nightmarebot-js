import { Client, EmbedBuilder, CommandInteraction } from "discord.js";
import { describe } from "node:test";
import { Command } from '../Command';
const strftime = require('strftime');

type Challenge = {
	title: string;
	description: string
}

type ChallengeData = {
    [key: string]: Challenge;
};

const english: ChallengeData = {
	toughZombies: {
		title: 'Tough Zombies',
		description: 'Zombies are extra tough.',
	},
	abmStocks: {
		title: 'Short Supply',
		description: 'A.B.M.s have limited inventory.',
	},
	chaseyMob: {
		title: 'Hive Mind',
		description: 'The horde follows more closely.',
	},
	doubleBosses: {
		title: 'Double Trouble',
		description: 'Double boss spawns are more common.',
	},
	extraBosses: {
		title: 'Boss Bonanza',
		description: 'More bosses will spawn',
	},
	fastEnemies: {
		title: 'Brainlusted Horde',
		description: 'Enemies are faster.',
	},
	lurkingUmbrella: {
		title: 'Mercenary Checkpoints',
		description: 'Soldiers start on the map.',
	},
	morePriority: {
		title: 'Epidemic',
		description: 'More grotesques, ghouls, mutants, and dogs spawn.',
	},
	moreSpecialPriority: {
		title: 'Furious Fangs',
		description: 'More special grotesques, ghouls and dogs spawn.',
	},
	moreSpecialZombies: {
		title: 'Cruel Claws',
		description: 'More special zombies spawn.',
	},
	moreTimeUber: {
		title: 'Against the clock',
		description: 'Difficulty increases faster with time.',
	},
	moreUber: {
		title: 'Uber Problems',
		description: 'Difficulty increases faster with levels.',
	},
	moreVarieties: {
		title: 'Spice of Life',
		description: 'A greater variety of special enemies can spawn.',
	},
	toughRads: {
		title: 'Bloated Fragments',
		description: 'Rad fragments are extra tough.',
	},
	umbrellaNukes: {
		title: 'Nuclear',
		description: 'The squad will be targetted by periodic nuclear strikes.',
	},
	backgroundRadiation: {
		title: 'Residual Radiation',
		description: 'Background radiation increases over time.',
	},
	rookies: {
		title: 'Rookies',
		description: 'Rank bonuses are disabled.',
	},
	fluctuatingRadiation: {
		title: 'Fluctuating Radiation',
		description: 'Background radiation fluctuates with time.',
	},
	fastRevives: {
		title: 'Regenerative Strain',
		description: 'Zombies revive faster.',
	},
	crossContamination: {
		title: 'Cross Contamination',
		description: 'Enemies from other maps appear.',
	},
	bloatedCorpses: {
		title: 'Bloated Corpses',
		description: 'Corpses Explode',
	},
	friendsClose: {
		title: 'Friends Close',
		description: 'Team must stick together or take damage.',
	},
	enemiesCloser: {
		title: 'Enemies Closer',
		description: 'Enemies will spawn close to the team',
	},
	shortSighted: {
		title: 'Short Sighted',
		description: 'Every unit on officer\'s team has reduced sight range.',
	},
	itFollows: {
		title: 'It Follows',
		description: 'Single large invulnerable innards that hunts down team.',
	}
};

const coreChallengeNames = [
	// Mob AI update interval reduced
	'chaseyMob',
	// Zombies have more hp
	'toughZombies',
	// Boss respawn time reduced
	'extraBosses',
	// Enemies have more movespeed
	'fastEnemies',
	// Passive radiation (like in defense)
	'backgroundRadiation',
	// Rad count randomly fluctuates over time
	'fluctuatingRadiation',
	// More non-zombie enemies spawn
	'morePriority',
	// ABMs have reduced stocks
	'abmStocks',
	// Time uber increases more (like extinction)
	'moreTimeUber',
	// More special zombies spawn (higher chance)
	'moreSpecialZombies',
	// Zombies revive from corpses faster
	'fastRevives',
	// Corpses explode
	'bloatedCorpses',
	// Team must stick together or take damage
	'enemiesCloser',
	// Every unit on officers' team has reduced sight range
	'shortSighted',
];

const nightmareChallengeNames = [
	// More double bosses spawn
	'doubleBosses',
	// Periodic umbrella nukes hit the team
	'umbrellaNukes',
	// Enemies from other maps can spawn
	'crossContamination',
	// Single large invulnerable innard that hunts down team
	'itFollows',
];

const challengeDescription = (challenge: string): string => {
	const challengeInfo = english[challenge];
	return `* ${challengeInfo.title} \n ${challengeInfo.description} \n`;
};

const getChallenges = (map: string): string => {
	const roller = new Roller(map);
	return roller.nightmareChallengeDescription();
};

class Roller {
	private mapName: string;
	private base: number;
	private multiplicant: number;
	private remainder: number;
	private roll: number;

	constructor(map: string) {
		this.mapName = map;
		this.base = Math.pow(2, 16) - 1;
		this.multiplicant = 83;
		this.roll = 0;
		this.remainder = 42;
		this.setupPrng();
	}

	setupPrng(): void {
		let roll = 17;
		const dateNumber = parseInt(strftime('%m%d%y', new Date(Date.now())));
		roll = roll += dateNumber;
		roll = roll + this.hashString(this.mapName);
		this.roll = roll;
		for (let i = 0; i < 5; i++) {
			this.rollPrng();
		}
	}

	hashString(string: string): number {
		let retval = 0;
		const array: number[] = [];
		const buffer = Buffer.from(string, 'utf8');
		for (let i = 0; i < buffer.length; i++) {
			array.push(buffer[i]);
		}
		array.forEach((byte, index) => {
			retval = retval + ((index + 1) * byte * ((index + 1) + byte));
		});
		return retval;
	}

	rollPrng(): number {
		const t = (this.multiplicant * this.roll) + this.remainder;
		this.roll = t % this.base;
		this.remainder = Math.floor(t / this.base);
		return this.roll;
	}

	rollForChallenges(challenges: string []): string {
		const roll = (this.rollPrng() % challenges.length);
		return challenges[roll];
	}

	nightmareChallengeDescription(): string {
		let challenges = [...coreChallengeNames];
		let retval = '';

		for (let i = 0; i < 3; i++) {
			const challenge = this.rollForChallenges(challenges);
			const index = challenges.indexOf(challenge);
			challenges.splice(index, 1);
			retval += challengeDescription(challenge);
		}

		challenges = [...challenges, ...nightmareChallengeNames];
		const challenge = this.rollForChallenges(challenges);
		retval += challengeDescription(challenge);

		return retval;
	}

}

export const Challenges: Command = {
	name: 'challenges',
	description: 'Displays todays challenges',
	run: async (client: Client, interaction: CommandInteraction) => {
		const challengesEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Challenges')
			.addFields(
				{ name: 'City Challenges', value: getChallenges('city'), inline: false },
				{ name: 'Hive Challenges', value: getChallenges('hive'), inline: false },
			);

		try {
			await interaction.reply({ embeds: [challengesEmbed], ephemeral: true });
		}
		catch (error) {
			if (error instanceof Error) {
				await interaction.reply({ ephemeral: true, content: `Error processing command: ${error.message}` });
			} else {
				await interaction.reply({ ephemeral: true, content: `Error processing command: No Message Given` });
			}
		}
	},
};