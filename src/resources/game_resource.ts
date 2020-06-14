import { Drash } from "../../deps.ts";
import { socketServer } from "../../app.ts";

export default class GameResource extends Drash.Http.Resource {
  static paths = ["/game"];

  public GET() {
    this.response.headers.set("Content-Type", "text/html");
    this.response.body = this.response.render("/game.html");
    return this.response;
  }
}
