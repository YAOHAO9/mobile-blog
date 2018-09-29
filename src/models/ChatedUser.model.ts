import User from './User.model';

export default class ChatedUser extends User {
  latestChatAt: string;
  chatCount: number;
  unreadCount: number;
}