const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const strftime = require('strftime');

const english = {
    "toughZombies_title": "Tough Zombies",
    "toughZombies_inactive": "Zombies are extra tough.",

    "abmStocks_title": "Short Supply",
    "abmStocks_inactive": "A.B.M.s have limited inventory.",

    "chaseyMob_title": "Hive Mind",
    "chaseyMob_inactive": "The horde follows more closely.",

    "doubleBosses_title": "Double Trouble",
    "doubleBosses_inactive": "Double boss spawns are more common.",

    "extraBosses_title": "Boss Bonanza",
    "extraBosses_inactive": "More bosses will spawn",

    "fastEnemies_title": "Brainlusted Horde",
    "fastEnemies_inactive": "Enemies are faster.",

    "lurkingUmbrella_title": "Mercenary Checkpoints",
    "lurkingUmbrella_inactive": "Soldiers start on the map.",

    "morePriority_title": "Epidemic",
    "morePriority_inactive": "More grotesques, ghouls, mutants, and dogs spawn.",

    "moreSpecialPriority_title": "Furious Fangs",
    "moreSpecialPriority_inactive": "More special grotesques, ghouls and dogs spawn.",

    "moreSpecialZombies_title": "Cruel Claws",
    "moreSpecialZombies_inactive": "More special zombies spawn.",

    "moreTimeUber_title": "Against the clock",
    "moreTimeUber_inactive": "Difficulty increases faster with time.",

    "moreUber_title": "Uber Problems",
    "moreUber_inactive": "Difficulty increases faster with levels.",

    "moreVarieties_title": "Spice of Life",
    "moreVarieties_inactive": "A greater variety of special enemies can spawn.",

    "toughRads_title": "Bloated Fragments",
    "toughRads_inactive": "Rad fragments are extra tough.",

    "umbrellaNukes_title": "Nuclear",
    "umbrellaNukes_inactive": "The squad will be targetted by periodic nuclear strikes.",

    "backgroundRadiation_title": "Residual Radiation",
    "backgroundRadiation_inactive": "Background radiation increases over time.",

    "rookies_title": "Rookies",
    "rookies_inactive": "Rank bonuses are disabled.",

    "fluctuatingRadiation_title": "Fluctuating Radiation",
    "fluctuatingRadiation_inactive": "Background radiation fluctuates with time.",

    "fastRevives_title": "Regenerative Strain",
    "fastRevives_inactive": "Zombies revive faster.",

    "crossContamination_title": "Cross Contamination",
    "crossContamination_inactive": "Enemies from other maps appear.",

    "bloatedCorpses_title": "Bloated Corpses",
    "bloatedCorpses_inactive": "Corpses Explode",

    "friendsClose_title": "Friends Close",
    "friendsClose_inactive": "Team must stick together or take damage.",

    "enemiesCloser_title": "Enemies Closer",
    "enemiesCloser_inactive": "Enemies will spawn close to the team",

    "shortSighted_title": "Short Sighted",
    "shortSighted_inactive": "Every unit on officer's team has reduced sight range.",

    "itFollows_title": "It Follows",
    "itFollows_inactive": "Single large invulnerable innards that hunts down team."
}

const coreChallengeNames = [
    "chaseyMob", // Mob AI update interval reduced
    "toughZombies", // Zombies have more hp
    "extraBosses", // Boss respawn time reduced
    "fastEnemies", // Enemies have more movespeed
    "backgroundRadiation", // Passive radiation (like in defense)
    "fluctuatingRadiation", // Rad count randomly fluctuates over time
    "morePriority", // More non-zombie enemies spawn
    "abmStocks", // ABMs have reduced stocks
    "moreTimeUber", // Time uber increases more (like extinction)
    "moreSpecialZombies", // More special zombies spawn (higher chance)
    "fastRevives", // Zombies revive from corpses faster
    "bloatedCorpses", // Corpses explode
    "friendsClose", // Team must stick together or take damage
    "enemiesCloser", // Enemies will spawn close to the team
    "shortSighted", // Every unit on officers' team has reduced sight range
]

const nightmareChallengeNames = [
    "doubleBosses", // More double bosses spawn
    "umbrellaNukes", // Periodic umbrella nukes hit the team
    "crossContamination", // Enemies from other maps can spawn
    "itFollows", // Single large invulnerable innard that hunts down team

]

const challengeDescription = (challenge) => {
    //console.log(challenge);
    const title = english[`${challenge}_title`];
    const description = english[`${challenge}_inactive`]
    return `* ${title} \n ${description} \n`
}

const getChallenges = (map) => {
    const roller = new Roller(map);
    return roller.nightmareChallengeDescription();
}

class Roller {

    constructor(map) {
        this.mapName = map;
        this.base = Math.pow(2, 16) - 1;
        this.multiplicant = 83;
        this.role = 0;
        this.remainder = 42;
        this.setupPrng();
    };

    setupPrng() {
        //console.log("Setting up PRNG")
        let roll = 17
        const dateNumber = strftime('%m%d%y', new Date());
        //console.log("Date Number:", dateNumber);
        roll = roll += dateNumber;
        roll = roll + this.hashString(this.mapName);
        this.roll = roll;
        for (let i = 0; i < 5; i++) {
            this.rollPrng();
        }
    }
    
    hashString(string) {
        retval = 0;
        let array = [];
        for (let i = 0; i < string.length; i++) {
            array.push(string.charCodeAt(i));
        }
        array.forEach((byte, index) => {
            retval = retval + ((index + 1) * byte * ((index + 1) + byte))
        })
        return retval;
    }

    rollPrng() {
        const t = (this.multiplicant * this.roll) + this.remainder;
        //console.log(t);

        this.roll = t % this.base;
        //console.log(this.roll);
        this.remainder = Math.floor(t / this.base)
        //console.log(this.remainder);

        return this.roll;
    }

    rollForChallenges(challenges) {
        //console.log("Rolling:", this.rollPrng());
        const roll = (this.rollPrng() % challenges.length);
        //console.log(roll);
        return challenges[roll];
    }

    nightmareChallengeDescription() {
        let challenges = [...coreChallengeNames]
        let retval = '';
        
        for (let i = 0; i < 3; i++) {
            let challenge = this.rollForChallenges(challenges);
            const index = challenges.indexOf(challenge)
            challenges.splice(index - 1, 1);
            retval += challengeDescription(challenge);
        }

        challenges  = [...challenges, ...nightmareChallengeNames];
        let challenge = this.rollForChallenges(challenges);
        retval += challengeDescription(challenge)
        
        return retval;
    }
    
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('challenges')
        .setDescription('Displays todays challenges'),
    async execute(interaction) {
        const challengesEmbed = new MessageEmbed()
            .setColor()
            .setTitle('Challenges')
            .addFields(
                { name: 'City Challenges', value: getChallenges("city"), inline: false },
                { name: 'Hive Challenges', value: getChallenges("hive"), inline: false }
            );

        await interaction.reply({ content: "Sending Challenges", ephemeral: true });
        await interaction.channel.send({ embeds: [challengesEmbed] });
    }
}