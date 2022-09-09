const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const strftime = require('strftime');

const english = {
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
	},
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

const challengeDescription = (challenge) => {
	const challengeData = english[challenge];
	return `* ${challengeData.title} \n ${challengeData.description} \n`;
};

const getChallenges = (map) => {
	const roller = new Roller(map);
	return roller.nightmareChallengeDescription();
};

class Roller {

	constructor(map) {
		this.mapName = map;
		this.base = Math.pow(2, 16) - 1;
		this.multiplicant = 83;
		this.role = 0;
		this.remainder = 42;
		this.setupPrng();
	}

	setupPrng() {
		let roll = 17;
		const dateNumber = parseInt(strftime('%m%d%y', new Date(Date.now())));
		roll = roll += dateNumber;
		roll = roll + this.hashString(this.mapName);
		this.roll = roll;
		for (let i = 0; i < 5; i++) {
			this.rollPrng();
		}
	}

	hashString(string) {
		let retval = 0;
		const array = [];
		const buffer = Buffer.from(string, 'utf8');
		for (let i = 0; i < buffer.length; i++) {
			array.push(buffer[i]);
		}
		array.forEach((byte, index) => {
			retval = retval + ((index + 1) * byte * ((index + 1) + byte));
		});
		return retval;
	}

	rollPrng() {
		const t = (this.multiplicant * this.roll) + this.remainder;
		this.roll = t % this.base;
		this.remainder = Math.floor(t / this.base);
		return this.roll;
	}

	rollForChallenges(challenges) {
		const roll = (this.rollPrng() % challenges.length);
		return challenges[roll];
	}

	nightmareChallengeDescription() {
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

module.exports = {
	data: new SlashCommandBuilder()
		.setName('challenges')
		.setDescription('Displays todays challenges'),
	async execute(interaction) {
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
			await interaction.reply({ ephemeral: true, content: `Error processing command: ${error.message}` });
		}
	},
};