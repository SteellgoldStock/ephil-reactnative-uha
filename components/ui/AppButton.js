import React from 'react';
import { Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const AppButton = ({ 
  children, 
  onPress, 
  mode = "contained", 
  loading = false, 
  disabled = false, 
  style,
  contentStyle,
  textColor,
  ...props 
}) => {
  const theme = useTheme();
  
  // Base color from your project
  const primaryColor = "#7B1FA2";

  return (
    <Button
      mode={mode}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        mode === "contained" && !style?.backgroundColor && { backgroundColor: primaryColor },
        mode === "outlined" && !style?.borderColor && { borderColor: primaryColor },
        style
      ]}
      contentStyle={[styles.content, contentStyle]}
      textColor={textColor || (mode === "outlined" ? primaryColor : undefined)}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={mode === "contained" ? "#fff" : primaryColor} size="small" />
      ) : (
        children
      )}
    </Button>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 4,
  },
});

export default AppButton;
