const { EmbedBuilder, ApplicationCommandType, PermissionsBitField, Embed, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const moment = require('moment');
const { executeQuery } = require('../../functions/db');
const checkPremium = require('../../functions/checkPremium');
const convertTime = require('../../functions/convertTime');
const client = require('../..');
const checkGiveawayAmount = require('../../functions/checkGiveaways');
const genDynamicTime = require('../../functions/genDynamicTimecode');
const con = require('../../functions/db')

module.exports = {
    name: 'create',
    description: 'Host a giveaway to specific channel',
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'prize',
            description: 'Write what you will be giving out',
            type: 3,
            required: true,
            max_length: 100
        },
        {
            name: 'winners',
            description: 'How many winners will there be?',
            type: 4,
            min_value: 1,
            required: true
        },
        {
            name: 'length',
            description: 'How long will the giveaway last? For example 2d = 2 days',
            type: 3,
            required: true
        },
        {
            name: 'channel',
            description: 'Specify where will the giveaway be held',
            type: 7,
            channel_types: [0, 5]
        },
        {
            name: 'whitelist_role',
            description: 'Limit to only one role to be able to participate the giveaway',
            type: 8
        },
        {
            name: 'blacklist_role',
            description: 'Prevent a role from participating in the giveaway',
            type: 8
        }
    ],

    run: async (client, interaction) => {
        const { member, channelId, guildId, applicationId, 
            commandName, deferred, replied, ephemeral, 
            options, id, createdTimestamp 
        } = interaction; 
        const { guild } = member;

        const prize = interaction.options.getString('prize');
        const winners = interaction.options.getInteger('winners');
        const length = interaction.options.getString('length');
        const giveawayChannel = interaction.options.getChannel('channel') ? interaction.options.getChannel('channel') : interaction.channel;
        const whitelistRole = interaction.options.getRole('whitelist_role') ? interaction.options.getRole('whitelist_role') : null;
        const blacklistRole = interaction.options.getRole('blacklist_role') ? interaction.options.getRole('blacklist_role') : null;

        const premiumState = await checkPremium(guildId);
        const convertedTime = await convertTime(length);

        // Check permissions for said channel
        if(!giveawayChannel.permissionsFor(guild.members.me, true).has(PermissionsBitField.Flags.ViewChannel) && !giveawayChannel.permissionsFor(guild.members.me, true).has(PermissionsBitField.Flags.SendMessages)){
            const noPerms = new EmbedBuilder().setDescription(`I need to be able to view channel and send messages to the ${giveawayChannel}. Please fix the issue with my permissions.`).setTitle(`Missing permissions`).setColor("Red");
            return interaction.reply({embeds: [noPerms], ephemeral: true});
        }

        // Check if giveaway length is good (premiums get more)
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + (4 * 7 * 24 * 60 * 60 * 1000));
        if(convertedTime > futureDate && !premiumState){
            const tooLong = new EmbedBuilder().setDescription(`You can't host giveaways longer than 4 weeks, because you do not have premium features enabled.`).setTitle(`Missing premium`).setColor("Red");
            return interaction.reply({embeds: [tooLong], ephemeral: true});
        }

        // No more than 4 giveaways at a time without premium
        if(await checkGiveawayAmount(guildId) >= 4 && !premiumState){
            const tooMany = new EmbedBuilder().setDescription(`You are already hosting 4 giveaways on your server. Upgrade to premium to host more.`).setTitle(`Missing premium`).setColor("Red");
            return interaction.reply({embeds: [tooMany], ephemeral: true});
        }

        const participate = new ButtonBuilder()
            .setCustomId('join_giveaway')
            .setLabel('Join Giveaway!')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🎉')

        const row = new ActionRowBuilder()
            .addComponents(participate);

        const giveawayEmbed = new EmbedBuilder()
            .setTitle(`Giveaway!`)
            .setColor("#1b2433")
            .setDescription(`To participate click the button below!\n\n<:home:1143864407445733416> Hosted by: ${interaction.member}\n<:gift:1143864411036061699> Prize: \`${prize}\`\n<:win:1143864409836507266> Winners: \`${winners}\`\nEnds in: ${genDynamicTime(convertedTime, 1)} ${genDynamicTime(convertedTime, 2)}`)

        giveawayChannel.send({embeds: [giveawayEmbed], components: [row]}).then(msg => {

            con.query(`INSERT INTO giveaways (guild, channel, message, winner_count, prize, end_time) VALUES ('${guildId}', '${giveawayChannel.id}', '${msg.id}', '${winners}', '${prize}', '${convertedTime.toISOString().slice(0, 19).replace('T', ' ')}')`, function (err, res, fields){
                const giveawayStarted = new EmbedBuilder()
                    .setDescription(`Giveaway has started in ${giveawayChannel}!`)
                    .addFields(
                        {name: `Giveaway ID`, value: `\`${res.insertId}\``}
                    )

                interaction.reply({embeds: [giveawayStarted], ephemeral: true})
            })
        })
    }
}