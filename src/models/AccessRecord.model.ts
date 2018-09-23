import User from './User.model';

export default class AccessRecord {
  public id: number;

  public userId: number;

  public user: User;

  public ip: string;

  public url: string;

  public method: string;

  public params: string;

  public body: string;

  public location: string;

  public date: Date;

  public createdAt: Date;

  public updatedAt: Date;
}
