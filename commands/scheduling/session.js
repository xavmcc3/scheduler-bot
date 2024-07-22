const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const Canvas = require('@napi-rs/canvas');
require('dotenv').config()
const fs = require('fs');

const data = new SlashCommandBuilder()
    .setName('session')
    .setDescription('Displays the current details for the upcoming session.');

const profileimage = new AttachmentBuilder('./res/schedule-pfp.png', { name: 'pfp.png' });

function drawImageInCircle(c, image, x, y, s, confirmed) {
    c.save();
    c.fillStyle = '#000000';
    c.beginPath();
    c.arc(x, y, s / 2, 0, 2 * Math.PI);
    c.clip();

    c.drawImage(image, x - s/2, y - s/2, s, s);
    c.restore();

    if(!confirmed) return;

    c.save();
    c.beginPath();
    c.fillStyle = '#313131';
    c.arc(x + (s / 2) - 7, y + (s / 2) - 7, 15, 0, 2 * Math.PI);
    c.fill();

    c.beginPath();
    c.fillStyle = '#52ff80';
    c.arc(x + (s / 2) - 7, y + (s / 2) - 7, 10, 0, 2 * Math.PI);
    c.fill();

    c.beginPath()
    c.lineWidth = 4;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.strokeStyle = '#313131';
    pos = { x: x + (s / 2) - 7, y: y + (s / 2) - 7 }
    c.moveTo(pos.x - 4, pos.y);
    c.lineTo(pos.x - 1, pos.y + 3);
    c.lineTo(pos.x + 4, pos.y - 3);
    c.stroke();
    c.restore();
}

async function showConfirmedMembers(members) {
    const canvas = Canvas.createCanvas(500, members.length * (60) + 20);
    const c = canvas.getContext('2d');

    c.fillStyle = '#313131';
    c.fillRect(0, 0, 500, members.length * (60) + 20);

    let memberindex = 0;
    c.textAlign = 'left';
    c.textBaseline = 'middle';
    c.fillStyle = '#e2e2e2';
    c.font = 'bold 24px sans-serif';
    c.textRendering = 'geometricPrecision';
    for(const member of members) {
        if(!member.confirmed) c.globalAlpha = 0.6

        const pfp = await Canvas.loadImage(member.avatar);
        c.fillText(member.username, 60 + 10 + 15, memberindex * (60) + (60 / 2) + 10);
        drawImageInCircle(c, pfp, (60 / 2) + 10, memberindex * (60) + (60 / 2) + 10, 55, member.confirmed);

        c.globalAlpha = 1
        memberindex++;
    }

    return new AttachmentBuilder(await canvas.encode('png'), { name: 'canvas.png' })
}

async function execute(interaction) {
    const data = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));

    const members = [];
    interaction.member.guild.members.cache.forEach(member => {
        if(member.user.bot) return;
        members.push({ 
            username:  member.nickname ?? member.user.globalName ?? member.user.username,
            avatar: member.displayAvatarURL(),
            confirmed: data.session.confirmed.includes(member.user.id)
        })
    })

    const date = new Date()
    date.setDate(date.getDate() + (12 - date.getDay()) % 7)

    const canvasattachment = await showConfirmedMembers(members)

    const embed = new EmbedBuilder()
	.setColor(0x52FF80)
	.setTitle('Upcoming Session')
	.setAuthor({ name: 'Scheduler', iconURL: 'attachment://pfp.png' })
	// .setDescription('*No date set*')
    .setDescription(`**📌** ${process.env["LOCATION"]}\n\n**📅** ${data.session.date}\n**🕑** ${data.session.time}`)
	.addFields(
		{ name: '**Confirmed**', value: `${data.session.confirmed.length != members.length ? '⭕' : '✅'} *${data.session.confirmed.length}/${members.length} members attending.*` }
    )
	.setImage('attachment://canvas.png')
    // .setThumbnail('attachment://pfp.png')
	// .setTimestamp(date)
	.setFooter({ text: 'Use /help for details' });

    await interaction.reply({
        embeds: [embed],
        files: [profileimage, canvasattachment]
    });
}

module.exports = {
	execute, 
    data
};