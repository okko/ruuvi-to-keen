const Keen = require('keen-tracking');
const ruuvi = require('node-ruuvitag');
const env = require('node-env-file');

env(__dirname + '/.env');

const keenClient = new Keen({
  projectId: process.env.KEEN_PROJECTID,
  writeKey: process.env.KEEN_WRITEKEY
});

ruuvi.on('found', tag => {
  console.log(tag.id + ' found');
  tag.on('updated', data => {
    console.log(tag.id + ' data received: ' + JSON.stringify(data, null, ''));
    keenClient.recordEvent(
      'measurement',
      {
        sensor: tag.id,
        rssi: data.rssi,
        humidity: data.humidity,
        temperature: data.temperature,
        pressure: data.pressure
      },
      (err, res) => {
        if (err) {
          console.log(err);
        }
      }
    );
  });
});
