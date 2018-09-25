import * as React from 'react';
import { Text, View, FlatList, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import Row from '../components/layout/Row';
import Colors from '../variables/Colors';
import Article from '../models/Article.model';
import { getRequest } from '../services/RequestService';
import { fromNow } from '../services/ToolService';
import Page from '../components/layout/Page';

interface Props {
  navigation: any;
}

interface State {
  articles: Article[],
  refreshing: boolean;
  noMore: boolean;
  loadingMore: boolean;
}

export default class BlogPage extends React.Component<Props, State> {

  public constructor(props: Props) {
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
      <Page navigation={this.props.navigation} customHeader={true}>
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
      </Page>
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
      <TouchableOpacity onPress={() => this.props.navigation.navigate('BlogDetail', { articleId: article.id })}>
        <View style={styles.itemWrap}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.description}>...</Text>
          <Row flex={undefined} justifyContent={undefined}>
            <Text style={styles.author}>YAOHAO</Text>
            <Text style={styles.date}>{fromNow(article.createdAt)}</Text>
          </Row>
        </View>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  itemWrap: { padding: 10, marginVertical: 1, borderRadius: 6, backgroundColor: Colors.white },
  title: { color: Colors.black, fontSize: 16 },
  description: { color: Colors.gray, fontSize: 14 },
  author: { flex: 1, color: Colors.gray, fontSize: 14 },
  date: { color: Colors.gray, fontSize: 12 }
});