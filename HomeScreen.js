/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Dimensions, TextInput, Image, TouchableOpacity, AsyncStorage, Linking } from 'react-native';
import FastImage from "react-native-fast-image";
import FlipCard from 'react-native-flip-card';
import { Content } from "native-base";
import { EventRegister } from "react-native-event-listeners";


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.WORDS = [];

    this.state = {
      item: null,
      reload: false,
      flip: false,
      isFront: true
    }

  }


  componentDidMount() {
    AsyncStorage.getItem("WORDS", (err, result) => {
      if (!err && !!result) {
        this.WORDS = [...JSON.parse(result)];
      }
      if (this.WORDS && this.WORDS.length > 0) {
        this._showWord(this.WORDS[0]);
      }
    })
    this.showWordLst = EventRegister.addEventListener("SHOW_WORDS", this._showWord);
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.showWordLst);
  }

  _showWord = (item) => {
    this.onFocusWord = "" + item.word;
    this.word = item.word
    this.wordLink = item.wordLink;
    this.definition = item.definition;
    this.examples = item.examples;
    if (!this.txtWord) {
      return;
    }
    this.txtWord.setNativeProps({
      text: item.word || ""
    });
    this.txtWordLink.setNativeProps({
      text: item.wordLink || ""
    });
    this.txtDefinition.setNativeProps({
      text: item.definition || ""
    });
    this.txtExamples.setNativeProps({
      text: item.examples || ""
    });
  }

  _doFlip = () => {
    this.setState({
      flip: !this.state.flip,
      isFront: !this.state.isFront
    })
  }

  _goNext = () => {
    if (!this.state.isFront) {
      this.setState({
        flip: !this.state.flip,
        isFront: true
      })
    }

    let idx = -1;
    let arr = this.WORDS.filter((item, index) => {
      idx = this.onFocusWord == item.word ? index : idx;
      return this.onFocusWord == item.word;
    });
    if (arr.length > 0) {
      if (idx >= this.WORDS.length - 1) {
        nextItem = this.WORDS[0];
      } else {
        nextItem = this.WORDS[idx + 1]
      }
      this._showWord(nextItem);
    }
  }

  _goPrev = () => {
    if (!this.state.isFront) {
      this.setState({
        flip: !this.state.flip,
        isFront: true
      })
    }

    let idx = -1;
    let arr = this.WORDS.filter((item, index) => {
      idx = this.onFocusWord == item.word ? index : idx;
      return this.onFocusWord == item.word;
    });
    if (arr.length > 0) {
      if (idx <= 0) {
        nextItem = this.WORDS[this.WORDS.length - 1];
      } else {
        nextItem = this.WORDS[idx - 1]
      }
      this._showWord(nextItem);
    }

  }

  _doResetForNewWord = () => {

    this.word = "";
    this.wordLink = "";
    this.definition = "";
    this.examples = "";
    this.txtWord.setNativeProps({
      text: ""
    });
    this.txtWordLink.setNativeProps({
      text: ""
    });
    this.txtDefinition.setNativeProps({
      text: ""
    });
    this.txtExamples.setNativeProps({
      text: ""
    });

    this.setState({
      reload: !this.state.reload
    })
  }

  _doSave = () => {
    if (!!!this.word || !!!this.wordLink) return;
    let arr = this.WORDS.filter((item, index) => {
      return this.word == item.word;
    });
    if (arr.length > 0) {
      return;
    }
    this.WORDS = [{
      word: this.word,
      wordLink: this.wordLink,
      definition: this.definition,
      examples: this.examples,
    }, ...this.WORDS];

    AsyncStorage.setItem("WORDS", JSON.stringify(this.WORDS));
  }

  __lookUp = () => {
    Linking.openURL(`https://www.google.com/search?q=${this.word}&tbm=isch`);
  }

  _goMyWords = () => {
    this.props.navigation.navigate("Words");
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, paddingTop: 50 }}>
          <FlipCard
            ref={com => {
              this.flibCard = com
            }}
            style={styles.card}
            friction={6}
            perspective={1000}
            flipHorizontal={true}
            flipVertical={false}
            flip={this.state.flip}
            clickable={false}
            onFlipEnd={(isFlipEnd) => { console.log('isFlipEnd', isFlipEnd) }}
          >
            {/* Face Side */}
            <Content style={{ flex: 1, backgroundColor: 'green' }}>
              <View style={styles.face}>
                <View style={{ height: 60, flexDirection: "row", justifyContent: 'flex-start', width: '100%', paddingTop: 16, paddingBottom: 8 }}>
                  <TouchableOpacity onPress={this._doResetForNewWord} style={{ justifyContent: 'center', alignItems: 'flex-start', marginLeft: 14, marginRight: 8, backgroundColor: 'purple', padding: 8 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Add Word</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._doSave} style={{ width: 70, justifyContent: 'center', alignItems: 'center', backgroundColor: 'purple' }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.__lookUp} style={{ width: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'purple', marginLeft: 8 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Look Up</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this._goMyWords} style={{ width: 100, justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ color: 'purple', fontWeight: 'bold' }}>My Words</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.txtWordContainer}>
                  <Text style={{ color: 'white', flex: 1 }}>New Word</Text>
                  <TextInput autoCapitalize={"none"} placeholder={""} defaultValue={this.word} ref={com => { this.txtWord = com }} style={styles.txtWord} onChangeText={(txt) => {
                    this.word = txt;
                  }} />
                </View>
                <View style={styles.txtWordContainer}>
                  <Text style={{ color: 'white', flex: 1 }}>Visualization</Text>
                  <TextInput autoCapitalize={"none"} placeholder={""} defaultValue={this.wordLink} ref={com => { this.txtWordLink = com }} style={styles.txtWord} onChangeText={(txt) => {
                    this.wordLink = txt;
                  }} />
                </View>
                <View style={[styles.txtWordContainer, { alignItems: 'flex-start' }]}>
                  <Text style={{ color: 'white', flex: 1 }}>Definition</Text>
                  <TextInput autoCapitalize={"none"} multiline={true} placeholder={""} defaultValue={this.definition} ref={com => { this.txtDefinition = com }} style={[styles.txtWord, { height: 120 }]} onChangeText={(txt) => {
                    this.definition = txt;
                  }} />
                </View>
                <View style={[styles.txtWordContainer, { alignItems: 'flex-start' }]}>
                  <Text style={{ color: 'white', flex: 1 }}>Examples</Text>
                  <TextInput autoCapitalize={"none"} multiline={true} placeholder={""} defaultValue={this.examples} ref={com => { this.txtExamples = com }} style={[styles.txtWord, { height: 120 }]} onChangeText={(txt) => {
                    this.examples = txt;
                  }} />
                </View>
              </View>
            </Content>
            {/* Back Side */}
            <View style={styles.back}>
              <FastImage
                style={{ width: '100%', height: "100%" }}
                defaultSource={require("./images/img_placehoder.png")}
                source={{
                  uri: this.wordLink,
                  headers: { Authorization: 'someAuthToken' },
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          </FlipCard>
        </View>
        <View style={{ width: screenWidth, height: 100, paddingBottom: 30, backgroundColor: undefined }}>
          <View style={{ flex: 1, flexDirection: "row", backgroundColor: 'lightgrey' }}>
            <TouchableOpacity onPress={this._goPrev} style={{ flex: 1, justifyContent: 'center', paddingLeft: 14 }}>
              <Text style={{ color: 'black' }}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._doFlip} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 14 }}>
              <Text style={{ color: !this.state.isFront ? 'green' : 'red' }}>Flip {this.state.isFront ? 'Back' : "Front"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._goNext} style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingRight: 14 }}>
              <Text style={{ color: 'black' }}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View >
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

styles.card = {
  width: screenWidth
}

styles.face = {
  flex: 1,
  alignItems: 'center'
}

styles.back = {
  flex: 1,
  backgroundColor: 'black',
  alignItems: 'center'
}

styles.txtWordContainer = {
  width: screenWidth,
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10
}

styles.txtWord = {
  flex: 3,
  height: 44,
  marginLeft: 8,
  marginRight: 8,
  backgroundColor: 'white',
  paddingLeft: 8,
}
