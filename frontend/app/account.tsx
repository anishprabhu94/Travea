import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  ImageBackground,
  Animated,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useAuth } from '../contexts/AuthContext';

export default function Account() {
  const router = useRouter();
  const { user, updateProfile, signOut } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [homeCity, setHomeCity] = useState(user?.home_city || '');
  const [showNameModal, setShowNameModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');

  const handleSaveName = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name: editNameValue });
      setName(editNameValue);
      setShowNameModal(false);
      Alert.alert('Success', 'Name updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update name');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCity = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ home_city: homeCity });
      setShowCityModal(false);
      Alert.alert('Success', 'Home city updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update home city');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    router.push('/change-password' as any);
  };

  const renderCard = (
    title: string,
    items: Array<{ label: string; value?: string; onPress?: () => void; placeholder?: boolean }>
  ) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {items.map((item, index) => (
        <View key={index}>
          {index > 0 && <View style={styles.cardDivider} />}
          <TouchableOpacity
            style={styles.cardItem}
            onPress={item.onPress}
            disabled={!item.onPress}
            activeOpacity={item.onPress ? 0.7 : 1}
          >
            <Text style={styles.cardItemLabel}>{item.label}</Text>
            {item.value ? (
              <View style={styles.cardItemValue}>
                <Text style={styles.cardItemValueText}>{item.value}</Text>
                {item.onPress && (
                  <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.4)" />
                )}
              </View>
            ) : item.placeholder ? (
              <View style={styles.cardItemValue}>
                <Text style={styles.placeholderText}>Coming Soon</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Living Radial Gradient Background */}
      <View style={styles.background}>
        <LinearGradient
          colors={['rgba(194,164,110,0.15)', 'rgba(11,15,20,0.8)', '#0B0F14']}
          locations={[0, 0.5, 1]}
          start={{ x: 0.3, y: 0.2 }}
          end={{ x: 1, y: 1 }}
          style={styles.radialGradient}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#F8F8F8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>Manage your profile and preferences</Text>

        {/* Profile Information Card */}
        {renderCard('Profile Information', [
          {
            label: 'Name',
            value: user?.name,
            onPress: () => {
              setEditNameValue(user?.name || '');
              setShowNameModal(true);
            },
          },
          {
            label: 'Email',
            value: user?.email,
          },
          {
            label: 'Home City',
            value: user?.home_city || 'Not set',
            onPress: () => setShowCityModal(true),
          },
        ])}

        {/* Change Password Card (Only for email users) */}
        {user?.auth_provider === 'email' && renderCard('Security', [
          {
            label: 'Change Password',
            onPress: handleChangePassword,
            value: '••••••••',
          },
        ])}

        {/* Two-Factor Authentication Card */}
        {renderCard('Two-Factor Authentication', [
          {
            label: 'Enable 2FA',
            placeholder: true,
          },
        ])}

        {/* Linked Accounts Card */}
        {renderCard('Linked Accounts', [
          {
            label: user?.auth_provider === 'google' ? 'Google Account' : user?.auth_provider === 'apple' ? 'Apple Account' : 'Email',
            value: user?.email,
          },
        ])}

        {/* Privacy & Data Card */}
        {renderCard('Privacy & Data', [
          {
            label: 'Data Privacy',
            placeholder: true,
          },
          {
            label: 'Download Your Data',
            placeholder: true,
          },
          {
            label: 'Delete Account',
            placeholder: true,
          },
        ])}

        {/* Support Card */}
        {renderCard('Support', [
          {
            label: 'Contact Support',
            placeholder: true,
          },
        ])}

        {/* Terms & Privacy Policy Card */}
        {renderCard('Legal', [
          {
            label: 'Terms of Service',
            placeholder: true,
          },
          {
            label: 'Privacy Policy',
            placeholder: true,
          },
        ])}

        {/* Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Name Edit Modal */}
      <Modal
        visible={showNameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNameModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowNameModal(false)}
          />
          <View style={styles.modalContent}>
            <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
              <Text style={styles.modalTitle}>Edit Name</Text>
              <TextInput
                style={styles.modalInput}
                value={editNameValue}
                onChangeText={setEditNameValue}
                placeholder="Enter your name"
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowNameModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleSaveName}
                  disabled={isSaving}
                >
                  <LinearGradient
                    colors={['#C2A46E', '#A8855C']}
                    style={styles.modalSaveGradient}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#F8F8F8" />
                    ) : (
                      <Text style={styles.modalSaveText}>Save</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </View>
      </Modal>

      {/* City Edit Modal */}
      <Modal
        visible={showCityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowCityModal(false)}
          />
          <View style={styles.modalContent}>
            <BlurView intensity={30} tint="dark" style={styles.modalBlur}>
              <Text style={styles.modalTitle}>Home City</Text>
              <TextInput
                style={styles.modalInput}
                value={homeCity}
                onChangeText={setHomeCity}
                placeholder="Enter your home city"
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoFocus
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setHomeCity(user?.home_city || '');
                    setShowCityModal(false);
                  }}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleSaveCity}
                  disabled={isSaving}
                >
                  <LinearGradient
                    colors={['#C2A46E', '#A8855C']}
                    style={styles.modalSaveGradient}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#F8F8F8" />
                    ) : (
                      <Text style={styles.modalSaveText}>Save</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </View>
      </Modal>
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
  radialGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0B0F14',
    background: 'radial-gradient(circle at 30% 20%, rgba(194,164,110,0.15) 0%, rgba(194,164,110,0.05) 40%, transparent 70%)',
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
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 28,
    letterSpacing: 0.2,
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
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(194,164,110,0.05)',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 40,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 6px 30px rgba(0,0,0,0.4), 0 10px 40px rgba(194,164,110,0.05)',
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(194,164,110,0.8)', // Reduced opacity from 0.9 to 0.8 for refinement
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cardItemLabel: {
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
  cardItemValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardItemValueText: {
    fontSize: 16, // Increased from 15 for better hierarchy
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  placeholderText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalBlur: {
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 20,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#F8F8F8',
    borderWidth: 1,
    borderColor: 'rgba(194,164,110,0.3)',
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  modalSaveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalSaveGradient: {
    padding: 14,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F8F8F8',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
});