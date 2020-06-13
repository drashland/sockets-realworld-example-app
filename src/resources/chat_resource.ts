import { Drash } from "../../deps.ts";
import { messages } from "../messages.ts";

export default class ChatResource extends Drash.Http.Resource {
  static paths = ["/chat", "/chat/:room"];

  public GET() {
    let chatroom = this.request.getPathParam("room");

    if (!chatroom) {
      this.response.headers.set("Content-Type", "text/html");
      this.response.body = this.response.render("/chat.html");
    } else {
      this.response.body =  messages[chatroom] ? messages[chatroom].messages : [];
    }
    return this.response;
  }
}
