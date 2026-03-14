import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="otp" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="profile-setup" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}
