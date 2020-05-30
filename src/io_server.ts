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
    
    this.io.on('disconnect', () => {
      console.log('A user disconnected.');
    });
  }
  
  init(SocketServer: any) {
    return new SocketServer();
  }
}
