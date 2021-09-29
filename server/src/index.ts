import express from "express";
import cors from "cors";
import * as HID from "node-hid";

console.log(HID.devices());

const app = express();
const port = 3000;

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => console.log("Listening on port " + port));