module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Registers a user to use stats commands'),
    async execute(interaction) {
        await interaction.reply('Running Register');
    },
}