import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useProgressStore } from '../store/progressStore';
import { useSettingsStore } from '../store/settingsStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.85,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.55,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, [opacity, scale]);

  useEffect(() => {
    void useProgressStore.getState().hydrate();
    void useSettingsStore.getState().hydrate();
    const t = setTimeout(() => {
      navigation.replace('Home');
    }, 2600);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.logoWrap, { transform: [{ scale }], opacity }]}>
        <Text style={styles.logoMark}>NF</Text>
      </Animated.View>
      <Text style={styles.title}>NumberFlow</Text>
      <Text style={styles.sub}>Yükleniyor…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  logoWrap: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoMark: {
    fontSize: 44,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    color: '#94a3b8',
  },
});
