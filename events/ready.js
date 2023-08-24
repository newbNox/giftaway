const client = require('..');
const { ActivityType } = require('discord.js');

client.on("ready", () => {
    client.user.setActivity('giveaways', { type: ActivityType.Watching});
    setInterval(() => {
        client.user.setActivity('giveaways', { type: ActivityType.Watching});
        //con.query(`SELECT id FROM commentboxes LIMIT 1`);
    }, 5000);

    console.log(`Logged in as ${client.user.tag}!`)
})