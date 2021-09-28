import { Application, send } from "https://deno.land/x/oak/mod.ts";
import * as log from "https://deno.land/std@0.106.0/log/mod.ts";

const app = new Application();

app.use(async (context) => {
	await send(context, context.request.url.pathname, {
		root: `${Deno.cwd()}/public`,
		index: "index.html",
	});
});

log.info("Server started on http://localhost:3000");

await app.listen({ port: 3000 });