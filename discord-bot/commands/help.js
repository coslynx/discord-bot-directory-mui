const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays all available commands.'),
	async execute(interaction) {
		const commands = interaction.client.commands;
		const commandList = Array.from(commands.values()).map(command => command.data.name).join(', ');
		await interaction.reply(`Available commands: ${commandList}`);
	},
};
```