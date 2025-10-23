import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const router = useRouter();
  const { user, updateSettings } = useAuth();

  // Notifications state
  const [tripUpdates, setTripUpdates] = useState(user?.settings?.notifications?.trip_updates ?? true);
  const [inspiration, setInspiration] = useState(user?.settings?.notifications?.inspiration ?? true);
  const [priceAlerts, setPriceAlerts] = useState(user?.settings?.notifications?.price_alerts ?? true);

  // App Preferences state
  const [theme, setTheme] = useState(user?.settings?.app_preferences?.theme ?? 'auto');
  const [language, setLanguage] = useState(user?.settings?.app_preferences?.language ?? 'en');
  const [currency, setCurrency] = useState(user?.settings?.app_preferences?.currency ?? 'USD');
  const [units, setUnits] = useState(user?.settings?.app_preferences?.units ?? 'km');

  // Accessibility state
  const [textSize, setTextSize] = useState(user?.settings?.accessibility?.text_size ?? 'default');
  const [motionReduction, setMotionReduction] = useState(user?.settings?.accessibility?.motion_reduction ?? false);

  // Save settings whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        const newSettings = {
          notifications: {
            trip_updates: tripUpdates,
            inspiration: inspiration,
            price_alerts: priceAlerts,
          },
          app_preferences: {
            theme: theme,
            language: language,
            currency: currency,
            units: units,
          },
          accessibility: {
            text_size: textSize,
            motion_reduction: motionReduction,
          },
        };
        await updateSettings(newSettings);
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    };

    // Only save if we have user data
    if (user) {
      saveSettings();
    }
  }, [tripUpdates, inspiration, priceAlerts, theme, language, currency, units, textSize, motionReduction]);

  const renderSection = (title: string, content: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {content}
      </View>
    </View>
  );

  const renderToggleItem = (label: string, value: boolean, onValueChange: (value: boolean) => void) => (
    <View style={styles.toggleItem}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(194,164,110,0.5)' }}
        thumbColor={value ? '#EAE7E1' : '#EAE7E1'}
        ios_backgroundColor="rgba(255,255,255,0.1)"
        style={styles.switch}
      />
    </View>
  );

  const renderSegmentedControl = (
    options: Array<{ label: string; value: string }>,
    selectedValue: string,
    onSelect: (value: string) => void
  ) => (
    <View style={styles.segmentedControl}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.segment,
            selectedValue === option.value && styles.segmentActive,
            index === 0 && styles.segmentFirst,
            index === options.length - 1 && styles.segmentLast,
          ]}
          onPress={() => onSelect(option.value)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              selectedValue === option.value && styles.segmentTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSelectItem = (
    label: string,
    value: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.selectItem} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.selectLabel}>{label}</Text>
      <View style={styles.selectValue}>
        <Text style={styles.selectValueText}>{value}</Text>
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.4)" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background */}
      <LinearGradient
        colors={['#0B0F14', '#0B0F14']}
        style={styles.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#F8F8F8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* A. Notifications */}
        {renderSection(
          'Notifications',
          <>
            {renderToggleItem('Trip updates', tripUpdates, setTripUpdates)}
            <View style={styles.divider} />
            {renderToggleItem('Inspiration & curated travel picks', inspiration, setInspiration)}
            <View style={styles.divider} />
            {renderToggleItem('Price alerts', priceAlerts, setPriceAlerts)}
          </>
        )}

        {/* B. App Preferences */}
        {renderSection(
          'App Preferences',
          <>
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Theme</Text>
              {renderSegmentedControl(
                [
                  { label: 'Light', value: 'light' },
                  { label: 'Dark', value: 'dark' },
                  { label: 'Auto', value: 'auto' },
                ],
                theme,
                setTheme
              )}
            </View>
            <View style={styles.divider} />
            {renderSelectItem(
              'Language',
              language === 'en' ? 'English' : language,
              () => {
                Alert.alert(
                  'Language',
                  'Select your preferred language',
                  [
                    { text: 'English', onPress: () => setLanguage('en') },
                    { text: 'Spanish', onPress: () => setLanguage('es') },
                    { text: 'French', onPress: () => setLanguage('fr') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }
            )}
            <View style={styles.divider} />
            {renderSelectItem(
              'Currency',
              currency,
              () => {
                Alert.alert(
                  'Currency',
                  'Select your preferred currency',
                  [
                    { text: 'USD', onPress: () => setCurrency('USD') },
                    { text: 'EUR', onPress: () => setCurrency('EUR') },
                    { text: 'GBP', onPress: () => setCurrency('GBP') },
                    { text: 'JPY', onPress: () => setCurrency('JPY') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }
            )}
            <View style={styles.divider} />
            {renderSelectItem(
              'Units',
              units === 'km' ? 'Kilometers' : 'Miles',
              () => {
                Alert.alert(
                  'Units',
                  'Select your preferred distance unit',
                  [
                    { text: 'Kilometers', onPress: () => setUnits('km') },
                    { text: 'Miles', onPress: () => setUnits('mi') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }
            )}
          </>
        )}

        {/* C. Accessibility */}
        {renderSection(
          'Accessibility',
          <>
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Text size</Text>
              {renderSegmentedControl(
                [
                  { label: 'Small', value: 'small' },
                  { label: 'Default', value: 'default' },
                  { label: 'Large', value: 'large' },
                ],
                textSize,
                setTextSize
              )}
            </View>
            <View style={styles.divider} />
            {renderToggleItem('Motion reduction', motionReduction, setMotionReduction)}
          </>
        )}

        {/* Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.select({ ios: 60, android: 40 }),
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8F8F8',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(194,164,110,0.9)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(194,164,110,0.15)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    letterSpacing: 0.2,
    flex: 1,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 12,
  },
  preferenceItem: {
    paddingVertical: 8,
  },
  preferenceLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    letterSpacing: 0.2,
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentFirst: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  segmentLast: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  segmentActive: {
    backgroundColor: 'rgba(201,169,109,0.3)',
    borderRadius: 10,
  },
  segmentText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  segmentTextActive: {
    color: '#F8F8F8',
    fontWeight: '600',
  },
  selectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  selectLabel: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  selectValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectValueText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
});
