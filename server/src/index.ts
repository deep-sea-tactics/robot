import express from "express";
import cors from "cors";
import * as HID from "node-hid";

function findController(): HID.HID | undefined {
	const foundDevices = HID.devices().filter(item => item.product == "Logitech Extreme 3D");

	if (foundDevices.length === 0) return undefined

	return new HID.HID(foundDevices[0].path as string);
}

const device = findController() as HID.HID;

device.on("data", function(data) {
	console.log(data)
});

const app = express();
const port = 3000;

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => console.log("Listening on port " + port));