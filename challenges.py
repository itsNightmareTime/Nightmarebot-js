import discord
from discord.ext import commands
from datetime import date, datetime, tzinfo, timedelta
import math

# MARK: Challenges

# Localization of challenges

ENGLISH = {
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


# These challenges are available for rolls in Normal, Hard, Insane, and Survival
CORE_CHALLENGE_NAMES = [
    "chaseyMob", # Mob AI update interval reduced
    "toughZombies", # Zombies have more hp
    "extraBosses", # Boss respawn time reduced
    "fastEnemies", # Enemies have more movespeed
    "backgroundRadiation", # Passive radiation (like in defense)
    "fluctuatingRadiation", # Rad count randomly fluctuates over time
    #"toughRads", # Rads have more hp UNIMPLEMENTED
    "morePriority", # More non-zombie enemies spawn
    "abmStocks", # ABMs have reduced stocks
    "moreTimeUber", # Time uber increases more (like extinction)
    #"moreVarieties", # More varieties of enemies spawn (as if higher difficulty) UNIMPLEMENTED
    "moreSpecialZombies", # More special zombies spawn (higher chance)
    #"randomBuilds", # Player builds are randomised after selection -- DISABLED DUE TO UNPOPULARITY
    "fastRevives", # Zombies revive from corpses faster
    #"moreSpecialPriority" # More special priority spawn (higher chance) UNIMPLEMENTED
    "bloatedCorpses", # Corpses explode
    "friendsClose", # Team must stick together or take damage
    "enemiesCloser", # Enemies will spawn close to the team
    "shortSighted", # Every unit on officers' team has reduced sight range
]

# BETA Special challenges that can only be found in Nightmare and Extinction
NIGHTMARE_CHALLENGE_NAMES = [
    "doubleBosses", # More double bosses spawn
    #"lurkingUmbrella", # Umbrella patrols start on the map UNIMPLEMENTED
    "umbrellaNukes", # Periodic umbrella nukes hit the team
    "crossContamination", # Enemies from other maps can spawn
    #"rookies", # Rank bonuses are disabled
    "itFollows", # Single large invulnerable innard that hunts down team
]


def challengeDescription(challenge):
    title = ENGLISH[challenge + "_title"]
    description = ENGLISH[challenge + "_inactive"]
    return "* " + title + "\n    " + description + "\n"

# MARK: TimeZone stuff

# TODO: Assuming dota is using PDT time for its main servers. May have to adjust, though.
UTC_OFFSET = timedelta(hours = 0)
class DotaTimeZone(tzinfo):
    def utcoffset(self, dt):
        return UTC_OFFSET

    def tzname(self, dt):
        return "GMT"

    def dst(self, dt):
        return UTC_OFFSET

DOTA_TIME_ZONE = DotaTimeZone()

# MARK: Rolling
class Roller:
    # Properties
    mapName = "" #Property

    BASE = pow(2,16)-1
    MULTIPLICANT = 83
    # Ideally this is set so that BASE*MULTIPLICANT
    # is "very close" to prime. But I'm too lazy to find something that meets this condition.

    roll = 0
    remainder = 42

    def __init__(self, mapName):
        self.mapName = mapName
        self.setupPRNG()

    # Sets up the random number generator with a seed based on the day and which map is loaded
    def setupPRNG(self):
        roll = 17

        # Get a number for the current date
        # today = date.today()
        today = datetime.now(DOTA_TIME_ZONE)
        # date =  GetSystemDate() # Month day year
        dateNumber = int(today.strftime("%m%d%y"))
        print("Date:", dateNumber);
        roll = roll + dateNumber

        # Set an offset based on the map name

        roll = roll + self.hashString(self.mapName)
        print('Roll in setupPRNG', roll)

        # Seed the PRNG
        self.roll = roll

        # print("Seeding PRNG of map " + self.mapName + " with: " + str(self.roll))
        # Roll the prng a few times to make it "more random"
        for i in range(5):
            self.rollPRNG()

    # Tries to find a mostly unique number to reprsent the passed in string
    def hashString(self, string):
        retval = 0
        # Set an offset based on the map name
        Array = bytearray(string, 'utf-8')
        for index,character in enumerate(string):
            # byte = bytes(character, 'utf-8')
            byte = Array[index]
            retval = retval + ((index+1) * (byte) * ((index+1) + byte)) # Index+1 because Lua is 1 indexed
        return retval

    def rollPRNG(self):
        print("ROLLING: -------------------------------------")
        t = (self.MULTIPLICANT * self.roll) + self.remainder
        print('T:', t)

        self.roll = t % self.BASE
        print('Roll:', self.roll)
        self.remainder = math.floor(t/self.BASE)
        print('Remainder:', self.remainder)
        print("Finished: ------------------------------------")
        return int(self.roll)

    # @param challenges | array of strings
    def rollForChallenges(self, challenges):
        roll = (self.rollPRNG() % len(challenges))
        return challenges[roll]

    # @param challenges | array of strings
    def nightmareChallengeDescription(self):
        challenges = list(CORE_CHALLENGE_NAMES)
        retval = ""
        # 3 Non-NM challenges
        for i in range(3):
            challenge = self.rollForChallenges(challenges)
            challenges.remove(challenge)
            retval += challengeDescription(challenge)

        # One that may have NM only challenges
        challenges += NIGHTMARE_CHALLENGE_NAMES
        challenge = self.rollForChallenges(challenges)
        retval += challengeDescription(challenge)
        return retval        


# MARK: Discord bot portion

def getChallenges(beta):
    retval = "```"
    cityRoller = Roller("city")
    retval += "== City Challenges ==\n"
    retval += cityRoller.nightmareChallengeDescription()
    retval += "== Hive Challenges ==\n"
    hiveRoller = Roller("hive")
    retval += hiveRoller.nightmareChallengeDescription()
    retval += "```"
    return retval


class Challenges(commands.Cog):


    # Events
    @commands.Cog.listener()
    async def on_ready(self):
        print('Loading Cog: Challenges.')

    #Commands
    @commands.command(aliases=['Challenge', 'challenges', 'Challenges'], help="Lists todays challenges for City and Hive")
    async def challenge(self, ctx, beta=None):
        await ctx.send(getChallenges(beta))


def setup(client):
	client.add_cog(Challenges(client))

getChallenges(None);
