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

    deleteWord = (item) => {
        const arr = this.WORDS.filter(ele => ele.word !== item.word);
        this.WORDS = [...arr];
        this.setState({ reload: !this.state.reload });
        AsyncStorage.setItem("WORDS", JSON.stringify(this.WORDS));
    }

    _renderWord = ({ item }) => {
        return (
            <View style={{ width: screenWidth, height: 44, justifyContent: 'center', flexDirection: 'row' }}>
                <TouchableOpacity onPress={this.showWord.bind(this, item)} style={{ flex: 1, height: '100%', justifyContent: 'center' }}>
                    <Text style={{ color: 'black', paddingLeft: 14 }}>{item.word}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.deleteWord.bind(this, item)} style={{ height: '100%', justifyContent: 'center' }}>
                    <Text style={{ color: 'red', paddingRight: 14 }}>{"Delete"}</Text>
                </TouchableOpacity>
                <View style={{ backgroundColor: 'grey', height: 1, width: '100%', position: 'absolute', bottom: 0 }} />
            </View>
        );
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