import User from './User.model';

export default class Discussion {
  public id: number;

  public userId: number;

  public user: User;

  public content: string;

  public momentId: number;

  public articleId: number;

  public createdAt: Date;

  public updatedAt: Date;
}
