/**
 * Generate dynamic time code to be used in Discord
 * 
 * 
 * @param {Date} time - The Date object representing the timestamp.
 * @param {Integer} type - Type of time to generate (1 = relative, 2 = date)
 * @returns {string} A dynamic time code string usable in Discord.
 */
function genDynamicTime(time, type = 1){
    const timestampInSeconds = Math.floor(time.getTime() / 1000);

    if(type === 1){
        const dynamicTimeCode = `<t:${timestampInSeconds}:R>`;
        return dynamicTimeCode;
    }

    if(type === 2){
        const dynamicTimeCode = `<t:${timestampInSeconds}:f>`;
        return dynamicTimeCode;
    }
    
}

module.exports = genDynamicTime;