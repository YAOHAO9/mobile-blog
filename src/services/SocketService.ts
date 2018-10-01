import io from 'socket.io-client';
import Config from '../configs/config';
import Chat from '../models/Chat.model';
import store from '../redux/Store';
import User from '../models/User.model';
import { getRequest } from './RequestService';
import { updateUser } from '../redux/ReduxUser';
import { updateAllUnreadMsgCount } from '../redux/ReduxChat';

export default class SocketService {

  public socket: SocketIOClient.Socket;
  public loginUser: User;
  public updateListener: (chat: Chat) => any;

  private constructor() {
    this.socket = io(Config.serverUrl, { path: '/socket.io' });
    this.addUpdateEnvet();
  }

  public static socketService: SocketService;
  public static get instance() {
    if (!this.socketService) {
      this.socketService = new SocketService();
    }
    return this.socketService;
  }


  public connect() {
    this.socket.on('connect', async () => {
      // get login user
      const loginUser: User = await getRequest('/api/user/whoami');
      this.loginUser = loginUser;
      store.dispatch(updateUser(loginUser));

      // get allUnreadMsgCount
      const allUnreadMsgCount = await getRequest('/api/chat/allUnreadMsgCount');
      store.dispatch(updateAllUnreadMsgCount(allUnreadMsgCount));
      this.socket.emit('whoami', { userId: loginUser.id, accessOrigin: Config.serverUrl });
    });
  }

  public registerUpdateListener(listener: (chat: Chat) => any) {
    this.updateListener = listener;
  }

  public addUpdateEnvet() {
    this.socket.on('update', (chat: Chat) => {
      if (!chat.receiverId)
        return;
      if (this.updateListener) {
        this.updateListener(chat);
      }
    });
  }
}

