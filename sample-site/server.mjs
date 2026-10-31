import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

const port = Number(process.env.PORT ?? 5373);

const server = createServer(async (request, response) => {
	if (request.url === "/icon.svg") {
		response.setHeader("content-type", "image/svg+xml");
		response.end(await readFile("icon.svg"));
		return;
	}
	response.setHeader("content-type", "text/html; charset=utf-8");
	response.end(await readFile("index.html"));
});

server.listen(port);
