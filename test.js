//console.log(JSON.stringify("hello"));

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', { autoOpen: false });

let dataReceived = false;

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
  // Because there's no callback to write, write errors will be emitted on the port:
  port.write('main screen turn on');
});

/*
// The open event is always emitted
port.on('open', function() {
  // open logic
});
*/


// Switches the port into "flowing mode"
port.on('data', function (data) {
  dataReceived = true;
  let stringdata = data.toString()
  //console.log('stringData:', stringdata);
  console.log('==================================================================================================')
  console.log(stringdata)
  /*
  var incomeing = true
  while (incomeing) {
    var senserdata = []
    while(senserdata.length < 4) {
      var i = senserdata.length
      senserdata[i] = stringdata
    }
    var today = new Date()
    var json = {"Date":today,"Sensordata":senserdata}
    console.log(json)
    incomeing = false
  }
  */

  //let infodata = JSON.parse(stringdata);
  //console.log('infoData:', infodata);

  //test code to upload to MAM

  const { executeDataPublishing } = require('./sendbyoneseed');
  (async function() {
      await executeDataPublishing({
          time: new Date(),
          data: {
              "Temp": stringdata,
          }
  })
  })();
  /*
  port.close(() => {
    console.log('successfull exit');
  });
  */
});

/*
// Read data that is available but keep the stream from entering "flowing mode"
port.on('readable', function () {
    console.log('Data:', port.read());
});
*/

//port.write('Hi Mom!');
//port.write(Buffer.from('Hi Mom!'));

// if we dont receive data in 5 seconds stop the program
setTimeout(() => {
  if (dataReceived) return;

  console.error('Timeout: no data received in time')
  port.close(() => {
    console.error('Timeout: closed port')
    process.exit();
  });
}, 1000 * 30);