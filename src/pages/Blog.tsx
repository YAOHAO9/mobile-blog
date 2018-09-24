import * as React from 'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import Row from '../components/layout/Row';
import Colors from '../variables/Colors';
import Article from '../models/Article.model';
import { getRequest } from '../services/RequestService';
import { fromNow } from '../services/ToolService';

interface State {
  articles: Article[],
  refreshing: boolean;
  noMore: boolean;
  loadingMore: boolean;
}

export default class BlogPage extends React.Component<null, State> {

  public constructor(props) {
    super(props);
    this.state = {
      articles: [],
      refreshing: false,
      noMore: false,
      loadingMore: false,
    }
  }

  public componentWillMount() {
    this.getArticles();
  }

  public render() {
    return (
      <FlatList
        style={{ marginVertical: 4 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => this.getArticles(true)}
          ></RefreshControl>
        }
        data={this.state.articles}
        keyExtractor={(item) => item.id + ''}
        renderItem={(data) => this.renderArticleItem(data.item)}
        onEndReached={() => this.getArticles()}
        onEndReachedThreshold={0.3}
      >
      </FlatList>
    );
  }

  public async getArticles(isRefreshing: boolean = false) {
    if ((!isRefreshing && this.state.noMore) || this.state.loadingMore) {
      return
    }
    await this.setState({ loadingMore: true })
    const offset = isRefreshing ? 0 : this.state.articles.length
    let articles: Article[] = await getRequest(`/api/article?sort=-createdAt&count=10&offset=${offset}`)
    const noMore = articles.length > 0 ? false : true
    if (!isRefreshing) {
      articles = [...this.state.articles, ...articles]
    }
    this.setState({ articles, refreshing: false, noMore, loadingMore: false })
  }

  public renderArticleItem(article: Article) {
    return (
      <View style={{ padding: 10, marginVertical: 1, borderRadius: 6, backgroundColor: Colors.white }}>
        <Text style={{ color: Colors.black, fontSize: 16 }}>{article.title}</Text>
        <Text style={{ color: Colors.gray, fontSize: 14 }}>...</Text>
        <Row flex={undefined} justifyContent={undefined}>
          <Text style={{ flex: 1, color: Colors.gray, fontSize: 14 }}>YAOHAO</Text>
          <Text style={{ color: Colors.gray, fontSize: 12 }}>{fromNow(article.createdAt)}</Text>
        </Row>
      </View>
    )
  }
}
