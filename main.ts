import { Application } from "abc";
import * as log from "log";
import { open } from 'open';

const app = new Application();

log.info("Server started on http://localhost:3000");

app
	.file("/", "./client/public/index.html")
	.static("/", "./client/public")
	.start({ port: 3000 })

await open("https://localhost:3000");