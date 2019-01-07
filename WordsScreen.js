import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, TextInput, Image, TouchableOpacity, AsyncStorage, Linking, FlatList } from 'react-native';
import FastImage from "react-native-fast-image";
import FlipCard from 'react-native-flip-card';
import { Content } from "native-base";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import { EventRegister } from "react-native-event-listeners";


export default class WordsScreen extends Component {
    constructor(props) {
        super(props);
        this.WORDS = [];

        this.state = {
            reload: false,
        }

    }


    componentDidMount() {
        AsyncStorage.getItem("WORDS", (err, result) => {
            if (!err && !!result) {
                this.WORDS = [...JSON.parse(result)];
                this.setState({ reload: !this.state.reload });
            }

        })
    }

    showWord = (item) => {
        EventRegister.emitEvent("SHOW_WORDS", item);
        this.props.navigation.goBack();
    }

    _renderWord = ({ item }) => {
        return (
            <TouchableOpacity onPress={this.showWord.bind(this, item)} style={{ width: screenWidth, height: 44, justifyContent: 'center' }}>
                <Text style={{ color: 'black', paddingLeft: 14 }}>{item.word}</Text>
                <View style={{ backgroundColor: 'grey', height: 1, width: '100%', position: 'absolute', bottom: 0 }} />
            </TouchableOpacity>);
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "white", paddingBottom: 30 }}>
                <View style={{ width: '100%', backgroundColor: "white", height: 100, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.goBack();
                    }} style={{ width: 100, height: 50, bottom: 0, left: 0, justifyContent: 'center', position: 'absolute' }}>
                        <Text style={{ color: 'green', paddingLeft: 14 }}>Back</Text>
                    </TouchableOpacity>

                    <Text style={{ color: 'green' }}>My Words</Text>
                </View>
                <FlatList
                    style={{ flex: 1, backgroundColor: 'lightgrey' }}
                    data={this.WORDS}
                    keyExtractor={item => item.word}
                    renderItem={this._renderWord}
                />
            </View>

        )
    }

}