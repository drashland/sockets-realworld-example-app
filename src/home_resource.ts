import { Drash } from "./deps.ts";
import { decodeHTML } from "./helpers.ts";


export default class HomeResource extends Drash.Http.Resource {

  static paths = [
    "/",
  ];

  public GET() {
    this.response.body = decodeHTML("./index");
    return this.response;
  }
}
