async function convertTime(input){

    const timeUnits = {
        m: 60000, // minutes
        h: 3600000, // hours
        d: 86400000, // days
        w: 604800000, // weeks
    }

    const match = input.match(/^(\d+)([mhdw])?$/i);

    if(match) {
        const value = parseInt(match[1]);
        const unit = match[2] ? match[2].toLowerCase() : 'm';

        const timeInMilliseconds = timeUnits[unit] ||timeUnits.m;

        const realTime = new Date(Date.now() + value * timeInMilliseconds);

        return realTime;
    }

    return null;
}

module.exports = convertTime;