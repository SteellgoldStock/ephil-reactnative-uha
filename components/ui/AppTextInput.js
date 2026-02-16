import React from 'react';
import { TextInput, HelperText } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

const AppTextInput = ({ 
  label, 
  value, 
  onChangeText, 
  error, 
  errorText,
  mode = "flat",
  disabled = false,
  ...props 
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        mode={mode}
        error={!!error}
        disabled={disabled}
        {...props}
      />
      {error && errorText ? (
        <HelperText type="error" visible={!!error}>
          {errorText}
        </HelperText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 4,
  },
});

export default AppTextInput;
