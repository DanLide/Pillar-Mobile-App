import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, View, ViewProps } from 'react-native';

const Loading: React.FC<ViewProps> = props => (
  <View style={styles.container}>
    <ActivityIndicator size="large" {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});

export default memo(Loading);
