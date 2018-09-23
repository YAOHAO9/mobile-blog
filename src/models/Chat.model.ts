import User from './User.model';

export default class Chat {
  public id: number;

  public session: string;

  public senderId: number;

  public sender: User;

  public receiverId: number;

  public receiver: User;

  public type: string;

  public content: string;

  public img: string;

  public read: boolean;

  public createdAt: Date;

  public updatedAt: Date;
}
