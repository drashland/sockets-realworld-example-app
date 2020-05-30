import { Drash } from "./deps.ts";
import { io } from "./app.ts";
import { decodeHTML } from "./helpers.ts";

export default class ChatResource extends Drash.Http.Resource {
  static paths = ["/chat", "/chat/:room"];

  public GET() {
    let chatroom = this.request.getPathParam("room");

    if (!chatroom) {
      this.response.body = decodeHTML("public/chat");
    } else {
      this.response.body =  io.ROOMS[chatroom];
      this.response.headers.set("Content-Type", "application/json");
    }

    return this.response;
  }
}
