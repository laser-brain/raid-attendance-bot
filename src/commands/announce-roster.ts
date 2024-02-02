import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("announce-roster")
  .setDescription("Announce the current roster to the channel");

export async function execute(interaction: CommandInteraction) {
  interaction.reply("some people are here!");
}
