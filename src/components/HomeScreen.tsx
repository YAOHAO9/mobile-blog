import * as React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements'
import Col from './layout/Col';
const instructions = Platform.select({
    ios: 'Home',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

interface Props {
    navigation: any;
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
                    onPress={() => navigate('Tab', { name: 'Jane' })}
                    raised
                    buttonStyle={{ backgroundColor: '#125', borderRadius: 100 }}
                    textStyle={{ textAlign: 'center' }}
                    title={`Welcome to\nReact Native Elements`}
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