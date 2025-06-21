import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
	index("routes/chat/index.tsx"),
	...prefix("api", [route("message", "routes/apis/message.ts")]),
] satisfies RouteConfig;
