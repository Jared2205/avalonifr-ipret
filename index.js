const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./botconfig.json");

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('guildMemberAdd', member => {
  console.log('User ' + member.user.username + ' has joined the server!');
  member.guild.channels.get('424421754082164736').send('Welcome! ' + member.user.username + ', to Svpreme official Discord!');
});

client.on('guildMemberRemove', member => {
  console.log('User ' + member.user.username + ' has leave the server!');
  member.guild.channels.get('424421754082164736').send('GoodBye! ' + member.user.username + ', hope you enjoy there');
});

client.on("message", async message => {
  if(message.author.bot) return;
  let prefix = "-"
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "ping") {
    const embed = new Discord.RichEmbed()
    .setColor(0x954D23)
    .addField(":ping_pong: Pong!", `It took ${message.createdTimestamp}ms to send this message`)
    .addField(":desktop: API", `${Math.round(client.ping)}ms`)
    .setFooter("AvalonIFR Discord Bot BETA 3.7. Powered By Svpreme.");
    message.channel.send({embed})
  }

  if(command === "bc") {
    if(!message.member.roles.some(r=>["Administrator", "King", "Owner"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    const sayMessage = args.join(" ");
    const embed = new Discord.RichEmbed()
      .setColor(0x954D23)
      .setTitle(":loudspeaker: Action | Announcement")
      .setDescription(sayMessage);
      message.channel.send("@everyone")
      message.delete().catch(O_o=>{});
      message.channel.send({embed})
  }

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable)
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");

    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }

  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable)
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban!");

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.

    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);

    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
});

client.login("process.env.BOT.TOKEN");
