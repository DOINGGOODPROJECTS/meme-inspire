import { Client, GatewayIntentBits } from 'discord.js';

const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let isReady = false;

discordClient.login(process.env.DISCORD_BOT_TOKEN);

discordClient.on('ready', () => {
  console.log('Bot Discord connecté !');
  isReady = true;
});

export async function sendMemeToChannel(imageBuffer: Buffer, text: string, author?: string) {
  if (!isReady) {
    throw new Error('Le bot Discord n\'est pas encore prêt');
  }

  const channel = await discordClient.channels.fetch(process.env.DISCORD_CHANNEL_ID!);
  
  if (!channel?.isTextBased()) {
    throw new Error('Le canal spécifié n\'est pas un canal texte');
  }

  await channel.send({
    content: `**Nouveau mème généré!**\n${text}${author ? `\n- ${author}` : ''}`,
    files: [{
      attachment: imageBuffer,
      name: 'meme.png'
    }]
  });
}