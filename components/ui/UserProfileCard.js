import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';

const UserProfileCard = ({ user, profilePhoto }) => {
  const theme = useTheme();

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  return (
    <View style={styles.container}>
      {profilePhoto ? (
        <Image
          source={{ uri: profilePhoto }}
          style={[styles.image, { borderColor: theme.colors.outline }]}
        />
      ) : (
        <Avatar.Text
          size={80}
          label={getInitials(user?.name || "??")}
          style={{ backgroundColor: "#7B1FA2", marginBottom: 12 }}
        />
      )}

      <Text variant="headlineSmall" style={styles.name}>
        {user?.name}
      </Text>

      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        {user?.email}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 1,
  },
  name: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UserProfileCard;
