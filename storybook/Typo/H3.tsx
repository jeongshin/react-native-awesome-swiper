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

export interface H3Props {
  text: string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
}

const H3: React.FC<H3Props> = ({ text, containerStyle, style }) => {
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
    fontSize: 24,
    fontWeight: '600',
  },
});

H3.defaultProps = {
  containerStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
};

export default H3;
