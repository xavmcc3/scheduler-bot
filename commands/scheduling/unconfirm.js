const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const data = new SlashCommandBuilder()
    .setName('unconfirm')
    .setDescription('Let people know you can\'t attend the next session. Things change, we get it 👍');

async function execute(interaction) {
    const data = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));

    if(data.session.confirmed.includes(interaction.member.user.id))
        data.session.confirmed.splice(data.session.confirmed.indexOf(interaction.member.user.id), 1);
    else {
        await interaction.reply({
            content: '😜😐 You aren\'t confirmed for this session yet!! You can confirm anytime with `\/confirm`',
            ephemeral: true
        });
        return;
    }

    fs.writeFileSync('./data/data.json', JSON.stringify(data, null, 2), 'utf8');

    await interaction.reply({
        content: '### Ok! You\'ve unconfirmed 😱🥲\nYou can re-confirm anytime with `\/confirm`',
        ephemeral: true
    });
}

module.exports = {
	execute, 
    data
};