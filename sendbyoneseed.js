let Mam = require('./lib/mam.client.js')
let IOTA = require('iota.lib.js')
let iota = new IOTA({ provider: `https://msl-fullnode.de:443` })
let keyString = 'mysecret';
let key = iota.utils.toTrytes(keyString);
let timeInterval = 15;
let securityLevel = 1;
let seed = 'SST9DZCZHNXWNXJVJRBHPEGZWOHUMJHKBNSIU9PKEJKQFACQPNORCGMOQGT99UDFNJCZTZOSNZUVOVJMV';


let mamState = Mam.init(iota,seed,securityLevel);
// channel mode default public
//mamState = Mam.changeMode(mamState, 'private');
//mamState = Mam.changeMode(mamState, 'restricted', key);
// Publish to Tangle
const publish = async function(packet) {
    // Create MAM Payload
    let trytes = iota.utils.toTrytes(JSON.stringify(packet));
    let message = Mam.create(mamState, trytes);
    console.log(JSON.stringify(message,null,"\t"));
    // Save new mamState
    mamState = message.state;
    // Attach the payload to the Tangle
    await Mam.attach(message.payload, message.address);
    return message.root;
}
// Create simulated sensor data
// For example json = {"data":40,"dateTime":"23/02/2018 10:54:34"}

/*
const generateDummyJSON = function(){
    let randomNumber = Math.floor((Math.random()*89)+10);
	//!!!!console.log(randomNumber);
    let json = "BLACKPINK IN YOU AREA";
    return json;
}
*/

const executeDataPublishing = async function(packet) {
    let root = await publish(packet);
    console.log("Message: ", JSON.stringify(packet));
}
//intervalInstance = setInterval(executeDataPublishing, parseInt(timeInterval)*1000);

//executeDataPublishing('check')


module.exports = {
    executeDataPublishing
};



