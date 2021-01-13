/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';

import Maps from "./src/Maps";
import Slider from '@react-native-community/slider';
import BottomSheet from '@gorhom/bottom-sheet';

const App = () => {
  return (
    <View>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
          <Maps />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: "white",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: "black",
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
