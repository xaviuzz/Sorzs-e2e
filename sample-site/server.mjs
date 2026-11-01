import { readFile } from "node:fs/promises";
import { createServer } from "node:http";

const port = Number(process.env.PORT ?? 5373);
const defaultTitle = "Sorzs Sample Page";
const titlesByLastSegment = {
	"": "Sorzs Home",
	docs: "Sorzs Docs",
	guide: "Sorzs Guide",
};

function titleOf(url) {
	const { pathname } = new URL(url, "http://sample-site");
	const lastSegment = pathname.split("/").pop();
	return titlesByLastSegment[lastSegment] ?? defaultTitle;
}

const server = createServer(async (request, response) => {
	if (request.url === "/icon.svg") {
		response.setHeader("content-type", "image/svg+xml");
		response.end(await readFile("icon.svg"));
		return;
	}
	response.setHeader("content-type", "text/html; charset=utf-8");
	const page = await readFile("index.html", "utf8");
	response.end(page.replaceAll("{{title}}", titleOf(request.url)));
});

server.listen(port);
