const { EmbedBuilder, ApplicationCommandType, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed } = require('discord.js');
const moment = require('moment');
const con = require('../../functions/db')

module.exports = {
    name: 'End Giveaway',
    cooldown: 3000,
    type: ApplicationCommandType.Message,

    run: async (client, interaction) => {
        const { member, channelId, guildId, applicationId, 
            commandName, deferred, replied, ephemeral, 
            options, id, createdTimestamp 
        } = interaction; 
        const { guild } = member;

        const messageId = interaction.targetId;

        con.query(`SELECT * FROM giveaways WHERE message='${messageId}' AND guild='${guildId}'`, function (err, res){
            if(res.length > 0){

                if(res[0].ended){
                    const endedGiveaway = new EmbedBuilder()
                        .setTitle(`Giveaway already ended`)
                        .setDescription(`Giveaway with ID: \`${giveawayId}\` has already ended.`)
                        .setColor("Red");

                    return interaction.reply({embeds: [endedGiveaway], ephemeral: true});
                }

                endGiveaway(res[0].id)
                

            } else {
                const noGiveaway = new EmbedBuilder()
                    .setTitle(`Invalid giveaway id`)
                    .setDescription(`Couldn't find giveaway with ID: \`${giveawayId}\`.`)
                    .setColor("Red");

                interaction.reply({embeds: [noGiveaway], ephemeral: true})
            }
        })

    }
}