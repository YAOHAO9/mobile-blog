import User from './User.model';
import Archive from './Archive.model';
import Discussion from './Discussion.model';

export default class Moment {
  public id: number;

  public userId: number;

  public user: User;

  public images: Archive[];

  public content: string;

  public city: string;

  public ip: string;

  public discussions: Discussion[];

  public approves: number[];

  public disapproves: number[];

  public createdAt: Date;

  public updatedAt: Date;
}
