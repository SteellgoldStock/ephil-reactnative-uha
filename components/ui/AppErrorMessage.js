import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { AntDesign } from "@react-native-vector-icons/ant-design";

const AppErrorMessage = ({ message }) => {
  const theme = useTheme();
  
  if (!message) return null;

  return (
    <View style={[
      styles.container, 
      { backgroundColor: theme.colors.errorContainer }
    ]}>
      <AntDesign name="alert" size={16} color={theme.colors.error} />
      <Text style={[styles.text, { color: theme.colors.error }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  text: {
    textAlign: "center",
    fontSize: 14,
  },
});

export default AppErrorMessage;
