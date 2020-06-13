import { Drash } from "./deps.ts";
import { decodeHTML } from "./helpers.ts";

export default class GameResource extends Drash.Http.Resource {
  static paths = ["/game"];

  public GET() {

    this.response.body = decodeHTML("public/game");
    return this.response;
  }
}
