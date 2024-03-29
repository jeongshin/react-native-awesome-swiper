import React from 'react';
import type {
  StyleProp,
  TextStyle,
  ViewStyle} from 'react-native';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

export interface H1Props {
  text: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
}

const H1: React.FC<H1Props> = ({ text, containerStyle, style }) => {
  return (
    <View style={containerStyle}>
      <Text style={StyleSheet.flatten([defaultStyles.title, style])}>
        {text}
      </Text>
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: '700',
  },
});

H1.defaultProps = {
  containerStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
};

export default H1;
