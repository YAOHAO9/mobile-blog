import io from 'socket.io-client';
import Config from '../configs/config';

export default class SocketService {

  public static socket: SocketIOClient.Socket;

  public static get instance() {
    if (!this.socket) {
      this.socket = io(Config.serverUrl, { path: '/socket.io' });
    }
    return this.socket;
  }
}

