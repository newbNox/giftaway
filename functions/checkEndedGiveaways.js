const client = require('..');
const con = require('./db')

async function endedGiveawaysCheck(){
    const currentDate = new Date()
    con.query(`SELECT * FROM giveaways WHERE ended='0'`, function(err, res){
        if(res.length > 0){

            for(i = 0; i < res.length; i++){
                const [year, month, day, hour, minute, second] = res[i].end_time.split(/[- :]/); 
                const formattedDate = new Date(year, month - 1, day, hour, minute, second);
                if(currentDate < formattedDate){
                    endGiveaway(res[i].id);
                } else {
                    continue;
                }
            }

        } else {
            return;
        }
    })

}

async function endGiveaway(giveawayId){
    const entries = await getGiveawayEntries(giveawayId);
    con.query(`SELECT * FROM giveaways WHERE id='${giveawayId}'`, function (err, res){

        con.query(`UPDATE giveaways SET ended='1' WHERE id='${giveawayId}'`);


        const winners = drawWinner(res[0].winner_count, entries)
        const giveawayGuild = client.guilds.cache.get(res[0].guild);
        if(!giveawayGuild) return;
        const giveawayChannel = giveawayGuild.channels.cache.get(res[0].channel);
        if(!giveawayChannel) return;
        const giveawayMsg = giveawayChannel.messages.fetch(res[0].message);
        if(!giveawayMsg) return;
    })
}

async function getGiveawayEntries(giveawayId){
    new Promise((resolve, reject) => {
        con.query(`SELECT * FROM entries WHERE giveaway_id='${giveawayId}'`, function (err, res){
            if(err){
                reject(err)
                return;
            }
            if(res.length >= 0){
                resolve(res);
            } else {
                resolve(false);
            }
        })
    })
}

/**
 * 
 * @param {Integer} amount - Amount of winners to draw
 * @param {Array} list - List containing entry information
 * @returns {Array} List of winners
 */
async function drawWinner(amount, list){
    if(list.length === 0){
        return [];
    }
    let winners = [];
    for(i = 0; i < amount; i++){
        const randomNumber = Math.floor(Math.random() * list.length);
        winners.push(list[randomNumber]);
    }

    return winners;
}