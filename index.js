//Développé par Arizaki
//Merci de me credité si vous reprenez le code.

const Discord = require('discord.js');
const fetch = require('node-fetch');
const config = require('./config.json');

const client = new Discord.Client();
const prefix = config.prefix;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (message.author.bot) return; // Ignore les messages provenant des autres bots
  if (!message.content.startsWith(prefix)) return; // Ignore les messages ne commençant pas par le préfixe

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'info') {
    // Récupérer le nom de la commande à partir des arguments
    const name = args[0];

    // Vérifier si le nom de la commande est fourni
    if (!name) {
      return message.reply('Veuillez spécifier le nom de la commande.');
    }

    // Récupérer les données depuis le JSON
    const response = await fetch(config.url);
    const data = await response.json();

    // Trouver la commande correspondante dans le JSON
    const commandData = data.find((cmd) => cmd.name.toLowerCase() === name.toLowerCase());

    // Vérifier si la commande existe dans le JSON
    if (!commandData) {
      return message.reply(`La commande "${name}" n'a pas été trouvée.`);
    }

    // Extraire les informations nécessaires de la commande
    const description = commandData.description;
    const urls = commandData.urls.split(',');
    const embedColor = commandData.embedColor || config.embedColor;
    const image = commandData.image || config.image;

    // Créer un message Discord avec les informations récupérées
    const embed = new Discord.MessageEmbed()
      .setTitle(`Informations sur la commande "${name}"`)
      .setDescription(description)
      .setImage(image)
      .addField('Liens utiles', urls.join('\n'))
      .setColor(embedColor)
      .setFooter("Développé par Arizaki.xyz")

    // Envoyer le message dans le salon où la commande a été utilisée
    message.channel.send(embed);
  }
});

client.login(config.token);
