const { SlashCommandBuilder } = require('discord.js');
const botService = require('../../services/botService');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Verifies a bot for listing on the website.')
		.addStringOption(option =>
			option.setName('bot-id')
				.setDescription('The ID of the bot to verify.')
				.setRequired(true)),
	async execute(interaction) {
		const botId = interaction.options.getString('bot-id');

		try {
			const verificationResult = await botService.approveBot(botId);
			await interaction.reply(`Bot with ID ${botId} verification result: ${verificationResult.message}`);
		} catch (error) {
			console.error('Error verifying bot:', error);
			await interaction.reply({ content: `Error verifying bot: ${error.message}`, ephemeral: true });
		}
	},
};
```