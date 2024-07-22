// Scheduler Discord Bot
//
// Deploy commands with `node deploy-commands.js`
// Run bot with `node .`
//
// Xavier McClurkin

// Import dependencies
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
require('dotenv').config()

// Create the client object
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
] });

// Create a command collection in the client object and retrieve commands
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for(const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    // Loop through all files in the command folders
    for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Check if the command is valid and add it to the client's command collection if it is 
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


// Notify once the client object is ready
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Execute command from an interaction
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
	    console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

    try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred)
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		else
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login as the client
client.login(process.env["TOKEN"]);