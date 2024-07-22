const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const data = new SlashCommandBuilder()
    .setName('confirm')
    .setDescription('Let people know you can attend the next session.');

async function execute(interaction) {
    const data = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));

    if(!data.session.confirmed.includes(interaction.member.user.id))
        data.session.confirmed.push(interaction.member.user.id);
    else {
        await interaction.reply({
            content: '🫨🫨 You\'re already confirmed for this session!! You can unconfirm anytime with `\/unconfirm`',
            ephemeral: true
        });
        return;
    }

    fs.writeFileSync('./data/data.json', JSON.stringify(data, null, 2), 'utf8');

    await interaction.reply({
        content: '### Got it! You\'re confirmed 😁🤯\nYou can unconfirm anytime with `\/unconfirm`',
        ephemeral: true
    });
}

module.exports = {
	execute, 
    data
};