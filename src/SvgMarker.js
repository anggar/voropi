import Svg, { Circle, Ellipse, Line } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import React from 'react';

const Pinpoint = ({fill}) => (
    <Svg height="64" width="64" viewBox="0 0 100 100">
      <Circle
        cx="50"
        cy="20"
        r="18"
        stroke="white"
        strokeWidth="4"
        fill={fill}
      />
    </Svg>
);

Pinpoint.defaultProps = {
  fill: "#ff0000"
}

const CurrentPin = () => (
  <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
    <Svg height="64" width="64" viewBox="0 0 100 100">
      <Circle
        cx="50"
        cy="70"
        r="20"
        stroke="white"
        strokeWidth="4"
        fill={theme.colors.primary}
        opacity={0.4}
      />
      <Circle
        cx="50"
        cy="70"
        r="8"
        fill={theme.colors.tertiary}
      />
    </Svg>
  </View>
);

export { Pinpoint, CurrentPin };
