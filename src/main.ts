import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

let transport: SSEServerTransport;

// Create an MCP server
const server = new McpServer({
  name: "k0h5.dev-test mcp-server",
  version: "1.0.0",
});

// 도구 이름: add
// 설명: 두 숫자를 더합니다
// 매개변수:
//   - a: 첫 번째 숫자
//   - b: 두 번째 숫자
// 반환값: 두 숫자의 합
server.tool(
  "add",
  {
    a: z.number(),
    b: z.number(),
  },
  async ({ a, b }) => {
    console.log(`[ADD TOOL] 입력값: a=${a}, b=${b}`);
    const result = a + b;
    console.log(`[ADD TOOL] 결과: ${result}`);
    return {
      content: [{ type: "text", text: String(result) }],
    };
  }
);

server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  })
);

const app = express();

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  // Note: to support multiple simultaneous connections, these messages will
  // need to be routed to a specific matching transport. (This logic isn't
  // implemented here, for simplicity.)
  await transport.handlePostMessage(req, res);
});

app.listen(8001, () => {
  console.log("서버가 8001 포트에서 실행 중입니다.");
  console.log("add 도구를 테스트하려면 클라이언트에서 연결하세요.");
});
