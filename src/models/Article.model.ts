import ArticleContent from './ArticleContent.model';
import User from './User.model';
import Discussion from './Discussion.model';

export default class Article {
  public id: number;

  public userId: number;

  public user: User;

  public icon: number;

  public title: string;

  public description: string;

  public type: string;

  public content: ArticleContent;

  public discussions: Discussion[];

  public approves: number[];

  public disapproves: number[];

  public createdAt: Date;

  public updatedAt: Date;
}
