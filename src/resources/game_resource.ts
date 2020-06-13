import { Drash } from "../../deps.ts";
import { socketServer } from "../../app.ts";

export default class GameResource extends Drash.Http.Resource {
  static paths = ["/game"];

  public GET() {
    socketServer.on('wordsmith', (incomingEvent: any) => {
      const { message } = incomingEvent;
      console.log(message.activeWord, message.input);
      if (message.activeWord && message.input && (message.activeWord === message.input)) message.completed = true;
      if (message.action === 'playerJoined') {
        message.playerCount += 1;
      }
      console.log(incomingEvent);
      socketServer.broadcast(message.gameroom, incomingEvent);
    });
    this.response.headers.set("Content-Type", "text/html");
    this.response.body = this.response.render("/game.html");
    return this.response;
  }
}
