MCP(Model Context Protocol)란?
**MCP(Model Context Protocol)**는 AI 모델과 애플리케이션 간의 상호작용을 표준화하는 프로토콜입니다.
쉽게 말해서, LLM(대형 언어 모델) 및 AI 모델과 클라이언트(앱, 서비스) 간의 데이터를 주고받는 방식을 정의한 프로토콜입니다.

🛠️ MCP의 주요 개념
MCP는 일반적으로 AI 모델과 데이터를 주고받기 위한 통신 구조를 제공합니다.
이는 OpenAI API, LangChain, Function Calling과 유사한 개념을 포함할 수 있습니다.

1️⃣ MCP Server (McpServer)
AI 모델과 상호작용할 수 있는 서버를 생성하는 역할.

특정 기능(도구, API)을 정의하고 클라이언트가 요청하면 처리하는 구조.

📌 예제 (McpServer 생성)

typescript
복사
편집
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
name: "My MCP Server",
version: "1.0.0",
});
2️⃣ MCP Tool (도구)
AI 모델이 사용할 수 있는 함수(Function Calling) 같은 개념.

예를 들어, 두 숫자를 더하는 add라는 도구를 만들 수 있음.

📌 예제 (add 도구 추가)

typescript
복사
편집
import { z } from "zod";

server.tool(
"add",
{
a: z.number(),
b: z.number(),
},
async ({ a, b }) => {
return {
content: [{ type: "text", text: String(a + b) }],
};
}
);
tool(name, schema, function) 형태로 도구를 정의함.

클라이언트가 add를 호출하면 a + b의 결과를 반환.

3️⃣ MCP Resource (리소스)
특정 데이터를 정의하고, 클라이언트가 이를 가져올 수 있도록 하는 기능.

URL 패턴을 기반으로 데이터를 제공하는 방식.

📌 예제 (greeting 리소스 추가)

typescript
복사
편집
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

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
greeting://John 같은 URI를 호출하면 "Hello, John!" 이 반환됨.

4️⃣ SSE (Server-Sent Events) 지원
MCP는 실시간 데이터 전송을 위해 SSE(Server-Sent Events)도 지원.

LLM의 스트리밍 응답을 처리하는 데 유용.

📌 예제 (SSE 연결)

typescript
복사
편집
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

app.get("/sse", async (req, res) => {
const transport = new SSEServerTransport("/messages", res);
await server.connect(transport);
});
클라이언트가 /sse 엔드포인트에 연결하면 실시간으로 데이터를 수신 가능.

📌 MCP는 어디에 사용될 수 있을까?
LLM(대형 언어 모델)과 애플리케이션을 연결하는 API 서버

AI 기능을 제공하는 마이크로서비스 구축

AI 모델의 Function Calling을 지원하는 프레임워크

LangChain과 같은 AI 프레임워크의 대체 또는 보완 솔루션

서버-클라이언트 간 AI 기반 대화형 애플리케이션 개발

🚀 결론
MCP(Model Context Protocol)는 AI 모델과 애플리케이션 간의 상호작용을 표준화하는 프로토콜입니다.
이를 통해 도구(tool), 리소스(resource), 스트리밍(SSE) 등의 기능을 쉽게 구현할 수 있습니다.

💡 간단히 말하면?
👉 MCP = AI 모델을 위한 API 서버를 쉽게 만드는 프레임워크! 🚀
