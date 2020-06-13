import config from "./config.ts";

export default class IO {
  public io: any;
  public ROOMS: any;

  constructor(SocketServer: any) {
    this.io = this.init(SocketServer)
    this.ROOMS = {
      general: [],
      deno: [],
      drash: [],
    }

    this.io.on('connection', () => {
      console.log('A user connected.');
    });
    
    this.io.on('chat', (incomingEvent: any) => {
      const { message } = incomingEvent;

      this.ROOMS[message.room].push({ ...message });
      this.io.to('chat', incomingEvent);
    });

    this.io.on('wordsmith', (incomingEvent: any) => {
      const { message } = incomingEvent;
      console.log(message.activeWord, message.input);
      if (message.activeWord && message.input && (message.activeWord === message.input)) message.completed = true;
      if (message.action === 'playerJoined') {
        message.playerCount += 1;
      }
      console.log(incomingEvent);
      this.io.to(message.gameroom, incomingEvent);
    });
    
    this.io.on('disconnect', () => {
      console.log('A user disconnected.');
    });
  }
  
  init(SocketServer: any) {
    return new SocketServer({
      address: config.hostname
    });
  }
}
