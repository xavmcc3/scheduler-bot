const { SlashCommandBuilder } = require('discord.js')

const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Gives details on how to use the application.');

async function execute(interaction) {
    await interaction.reply('`throw new NotImplementedException();`');
}

module.exports = {
	execute, 
    data
};