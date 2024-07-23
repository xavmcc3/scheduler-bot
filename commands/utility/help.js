const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js')

const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Gives details on how to use the application.');

const profileimage = new AttachmentBuilder('./res/schedule-pfp.png', { name: 'pfp.png' });

async function execute(interaction) {
    const embed = new EmbedBuilder()
    .setColor(0x52FF80)
	.setTitle('Upcoming Session')
	.setAuthor({ name: 'Scheduler', iconURL: 'attachment://pfp.png' })
    .setDescription('Use the application by typing `/` followed by the name of a command.')
    .addFields(
		{ name: '**Commands**', value: '**`/session`** See the details for the upcoming session.\n**`/confirm`** Let people know you\'re going to the next session.\n**`/unconfirm`** If things changed or you accidentally confirmed, use this to unconfirm.\n**`/help`** Shows this message.' }
    )
    .setTimestamp()

    await interaction.reply({
        embeds: [embed],
        files: [profileimage]
    });
}

module.exports = {
	execute, 
    data
};