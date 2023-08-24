const con = require('../functions/db');

async function checkGiveawayAmount(guildId){
    new Promise((res, rej) => {

        con.query(`SELECT * FROM giveaways WHERE guild='${guildId}'`, function(e, r){
            if(e){
                rej(e)
                return(e)
            }
            res(r.length)
        })
    })
}

module.exports = checkGiveawayAmount;