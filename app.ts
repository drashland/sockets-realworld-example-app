import { Drash, SocketServer } from "./deps.ts";
import config from "./config.ts";

import HomeResource from "./src/resources/home_resource.ts";
import ChatResource from "./src/resources/chat_resource.ts";
import GameResource from "./src/resources/game_resource.ts";
import { messages } from "./src/messages.ts";


const webServer = new Drash.Http.Server({
  response_output: "application/json",
  directory: Deno.realPathSync("."),
  static_paths: ["/public"],
  resources: [
    HomeResource,
    ChatResource,
    GameResource,
  ],
  template_engine: true,
  views_path: "./src/views",
});

webServer.run({
  hostname: config.webServer.hostname,
  port: config.webServer.port,
});
console.log(`Web server started on ${config.webServer.hostname}:${config.webServer.port}`);

const socketServer = new SocketServer();
socketServer.run({
  hostname: config.socketServer.hostname,
  port: config.socketServer.port,
});
console.log(
  `Socket server started on ${config.socketServer.hostname}:${config.socketServer.port}`,
);

socketServer.on("connection", () => {
  console.log("A user connected.");
});

socketServer.on("disconnect", () => {
  console.log("A user disconnected.");
});

socketServer.on('chat', (incomingMessage: any) => {
  const { message } = incomingMessage;
  if (!messages[message.room]) {
    messages[message.room] = {
      messages: []
    };
  }
  messages[message.room].messages.push({ ...message });
  socketServer.to('chat', incomingMessage);
});

socketServer.on('wordsmith', (incomingMessage: any) => {
  const { message } = incomingMessage;
  if (!messages[message.gameroom]) {
    messages[message.gameroom] = { status: {} };
  }
  if (message.activeWord && message.input && (message.activeWord === message.input)) message.completed = true;
  if (message.action === 'player_joined') {
    messages[message.gameroom].status.players = [null, null];
    messages[message.gameroom].status.players[message.space - 1] = true;
  }

  if (message.action === 'status') {
    message.status = messages[message.gameroom].status;
  }
  socketServer.broadcast(message.gameroom, incomingMessage);
});


export {
  socketServer,
};

