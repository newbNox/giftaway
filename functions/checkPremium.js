const con = require('../functions/db');

async function checkPremium(guildId){
    new Promise((res, rej) => {

        con.query(`SELECT * FROM guilds WHERE guild='${guildId}'`, function(e, r){
            if(r.length > 0){
                if(r[0].premium){
                    res(true);
                } else {
                    res(false);
                }
            } else {
                rej(e);
            }
        })
    })
}

module.exports = checkPremium;