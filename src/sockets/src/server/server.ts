import { serve } from "../../deps.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  WebSocket,
} from "../../deps.ts";
import EventEmitter from "./event_emitter.ts";

export default class SocketServer extends EventEmitter {
  private config: any;

  constructor(config: any = {}) {
    super();
    if (!config.address) {
      config.address = "realworld_sockets";
    }
    if (!config.port) {
      config.port = "3000";
    }
    this.config = config;
    this.connect();
  }

  public getConfig() {
    return this.config;
  }

  public async connect() {
    const server = serve(`${this.config.address}:${this.config.port}`);

    console.log(`Running on ${this.config.address}:${this.config.port}`);

    for await (const req of server) {
      const { headers, conn } = req;
      try {
        const socket = await acceptWebSocket({
          conn,
          headers,
          bufReader: req.r,
          bufWriter: req.w,
        });
        console.log("A user connected!");
        const clientId = conn.rid;
        super.addClient(socket, clientId);

        try {
          for await (const ev of socket) {
            if (ev instanceof Uint8Array) {
              await super.checkEvent(ev, clientId);
            } else if (isWebSocketCloseEvent(ev)) {
              const { code, reason } = ev;
              console.log("ws:Close", code, reason);
            }
          }
        } catch (err) {
          console.error(`failed to receive frame: ${err}`);

          if (!socket.isClosed) {
            await super.removeClient(clientId);
          }
        }
      } catch (err) {
        console.error(`failed to accept websocket: ${err}`);
        await req.respond({ status: 400 });
      }
    }
  }
}
