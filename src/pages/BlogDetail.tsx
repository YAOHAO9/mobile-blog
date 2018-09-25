import * as React from 'react';
import { WebView, ScrollView } from 'react-native';
import Article from '../models/Article.model';
import { getRequest } from '../services/RequestService';
import ArticleContent from '../models/ArticleContent.model';
import Config from '../configs/config';
import Page from '../components/layout/Page';

interface Props {
  navigation: any;
}

interface State {
  webViewHeight: number;
  articleContent: Partial<ArticleContent>
}

export default class BlogDetail extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title", "Blog detail"),
    };
  };
  private webView: WebView = null;
  public constructor(props: Props) {
    super(props);
    this.state = {
      webViewHeight: 0,
      articleContent: null
    }
  }

  public componentWillMount() {
    const articleId = this.props.navigation.getParam('articleId')
    this.getArticleDetail(articleId);
  }

  public render() {
    const articleId = this.props.navigation.getParam('articleId')
    return (
      <Page navigation={this.props.navigation} customHeader={false}>
        <ScrollView style={{ flex: 1 }}>
          <WebView
            originWhitelist={['*']}
            source={{ uri: `${Config.serverUrl}/api/article/detailHtml/${articleId}` }}
            style={{ height: this.state.webViewHeight }}
            ref={(webView) => this.webView = webView}
            onLoadEnd={() => this.webViewLoaded()}
            onMessage={(e) => {
              this.handleMessage(e)
            }}
            javaScriptEnabled={true}
          />
        </ScrollView >
      </Page>
    );
  }

  public async getArticleDetail(articleId) {
    const detailArticle: Article = await getRequest(`/api/article/${articleId}`);
    this.props.navigation.setParams({ title: detailArticle.title })
    this.setState({ articleContent: detailArticle.content })
  }

  public webViewLoaded() {
    this.webView.injectJavaScript(`
        const height = document.body.scrollHeight;
        window.postMessage(height);
    `);
  }

  public handleMessage(e) {
    this.setState({
      webViewHeight: +e.nativeEvent.data
    });
  }
}
