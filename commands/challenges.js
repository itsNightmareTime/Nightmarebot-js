const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const strftime = require('strftime');

const english = {
	'toughZombies_title': 'Tough Zombies',
	'toughZombies_inactive': 'Zombies are extra tough.',

	'abmStocks_title': 'Short Supply',
	'abmStocks_inactive': 'A.B.M.s have limited inventory.',

	'chaseyMob_title': 'Hive Mind',
	'chaseyMob_inactive': 'The horde follows more closely.',

	'doubleBosses_title': 'Double Trouble',
	'doubleBosses_inactive': 'Double boss spawns are more common.',

	'extraBosses_title': 'Boss Bonanza',
	'extraBosses_inactive': 'More bosses will spawn',

	'fastEnemies_title': 'Brainlusted Horde',
	'fastEnemies_inactive': 'Enemies are faster.',

	'lurkingUmbrella_title': 'Mercenary Checkpoints',
	'lurkingUmbrella_inactive': 'Soldiers start on the map.',

	'morePriority_title': 'Epidemic',
	'morePriority_inactive': 'More grotesques, ghouls, mutants, and dogs spawn.',

	'moreSpecialPriority_title': 'Furious Fangs',
	'moreSpecialPriority_inactive': 'More special grotesques, ghouls and dogs spawn.',

	'moreSpecialZombies_title': 'Cruel Claws',
	'moreSpecialZombies_inactive': 'More special zombies spawn.',

	'moreTimeUber_title': 'Against the clock',
	'moreTimeUber_inactive': 'Difficulty increases faster with time.',

	'moreUber_title': 'Uber Problems',
	'moreUber_inactive': 'Difficulty increases faster with levels.',

	'moreVarieties_title': 'Spice of Life',
	'moreVarieties_inactive': 'A greater variety of special enemies can spawn.',

	'toughRads_title': 'Bloated Fragments',
	'toughRads_inactive': 'Rad fragments are extra tough.',

	'umbrellaNukes_title': 'Nuclear',
	'umbrellaNukes_inactive': 'The squad will be targetted by periodic nuclear strikes.',

	'backgroundRadiation_title': 'Residual Radiation',
	'backgroundRadiation_inactive': 'Background radiation increases over time.',

	'rookies_title': 'Rookies',
	'rookies_inactive': 'Rank bonuses are disabled.',

	'fluctuatingRadiation_title': 'Fluctuating Radiation',
	'fluctuatingRadiation_inactive': 'Background radiation fluctuates with time.',

	'fastRevives_title': 'Regenerative Strain',
	'fastRevives_inactive': 'Zombies revive faster.',

	'crossContamination_title': 'Cross Contamination',
	'crossContamination_inactive': 'Enemies from other maps appear.',

	'bloatedCorpses_title': 'Bloated Corpses',
	'bloatedCorpses_inactive': 'Corpses Explode',

	'friendsClose_title': 'Friends Close',
	'friendsClose_inactive': 'Team must stick together or take damage.',

	'enemiesCloser_title': 'Enemies Closer',
	'enemiesCloser_inactive': 'Enemies will spawn close to the team',

	'shortSighted_title': 'Short Sighted',
	'shortSighted_inactive': 'Every unit on officer\'s team has reduced sight range.',

	'itFollows_title': 'It Follows',
	'itFollows_inactive': 'Single large invulnerable innards that hunts down team.',
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
	'friendsClose',
	// Enemies will spawn close to the team
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
	const title = english[`${challenge}_title`];
	const description = english[`${challenge}_inactive`];
	return `* ${title} \n ${description} \n`;
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