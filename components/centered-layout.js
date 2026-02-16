import { View, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useTheme } from "react-native-paper";

export const CenteredLayout = ({ children }) => {
  const theme = useTheme();
  return <View style={{ flex: 1, justifyContent: "center", padding: 30, backgroundColor: theme.colors.background }}>{children}</View>
};

export const FormLayout = ({ children }) => {
  const theme = useTheme();
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 30 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{
          gap: 10,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: theme.colors.outlineVariant,
          padding: 20,
          backgroundColor: theme.colors.surface,
        }}>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
};
