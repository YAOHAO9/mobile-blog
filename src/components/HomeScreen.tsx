import * as React from 'react';
import { Platform, StyleSheet, Text, Button } from 'react-native';
import Col from './layout/Col';
import { NavigationScreenProp } from 'react-navigation';
const instructions = Platform.select({
    ios: 'Home',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

interface Props {
    navigation: NavigationScreenProp<null>;
}

interface State {
}

export default class APP extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <Col>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Text style={styles.instructions}>To get started, edit App.js</Text>
                <Text style={styles.instructions}>{instructions}</Text>
                <Button
                    onPress={() => navigate('BlogDetail', { articleId: '100' })}
                    title={`没有颜色真的很不爽`}
                />
            </Col>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        margin: 20,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
    },
});
