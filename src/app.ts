import { Drash } from "./deps.ts";
import config from "./config.ts";
import { SocketServer } from "./sockets/mod.ts";

import HomeResource from "./home_resource.ts";
import ioServer from "./io_server.ts";
import ChatResource from "./chat_resource.ts";

let server = new Drash.Http.Server({
  response_output: "text/html",
  memory_allocation: {
    multipart_form_data: 128
  },
  directory: config.directory,
  static_paths: config.staticPaths,
  resources: [HomeResource, ChatResource]
});


const io = new ioServer(SocketServer);

export { 
  io,
};

server.run({
  hostname: "realworld_sockets",
  port: 1667,
});

console.log('Sockets server running on realworld_sockets:1667')
