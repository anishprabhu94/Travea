import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ visible, onClose }: ProfileDrawerProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const slideAnim = React.useRef(new Animated.Value(24)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.98)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 14,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 24,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { id: 'account', label: 'Account', icon: 'person-outline', route: '/account' },
    { id: 'settings', label: 'Settings', icon: 'settings-outline', route: '/settings' },
    { id: 'help', label: 'Help & Support', icon: 'help-circle-outline', route: '/help-support' },
    { id: 'logout', label: 'Log Out', icon: 'log-out-outline', route: null },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />

        {/* Compact Floating Drawer */}
        <Animated.View 
          style={[
            styles.drawerContainer,
            { 
              transform: [
                { translateX: slideAnim },
                { scale: scaleAnim }
              ],
              opacity: fadeAnim,
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(194,164,110,0.06)', 'rgba(15,18,20,0.55)']}
            style={styles.drawerGradient}
          >
            {/* Bronze vertical accent line */}
            <View style={styles.bronzeAccent} />
            
            <BlurView intensity={32} tint="dark" style={styles.drawerContent}>
              
              {/* Menu Items */}
              <View style={styles.menuList}>
                {menuItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        if (item.id === 'logout') {
                          handleLogout();
                        } else if (item.route) {
                          handleNavigation(item.route);
                        }
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuItemInner}>
                        <Ionicons 
                          name={item.icon as any} 
                          size={18} 
                          color="rgba(255,255,255,0.8)" 
                        />
                        <Text style={styles.menuItemText}>{item.label}</Text>
                      </View>
                    </TouchableOpacity>
                    {index < menuItems.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
              </View>

              {/* Footer */}
              <View style={styles.footerContainer}>
                <View style={styles.footerDivider} />
                <View style={styles.footer}>
                  <Text style={styles.footerText}>v1.0 · Made by Trāvea</Text>
                </View>
              </View>

            </BlurView>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    right: 26,
    top: 54, // Lowered by 36px from 18
    width: 248, // Reduced from 260 for slimmer silhouette
    borderRadius: 32,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 40,
      },
      android: {
        elevation: 22,
      },
      web: {
        boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
      },
    }),
  },
  drawerGradient: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 32,
  },
  bronzeAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(194,164,110,0.6)',
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 42, // Reduced by 6px from 48 to tighten spacing
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  menuList: {
    flex: 1,
    paddingTop: 12,
  },
  menuItem: {
    paddingVertical: 14,
    position: 'relative',
  },
  menuItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(194,164,110,0.1)',
    marginVertical: 6,
  },
  footerContainer: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(194,164,110,0.1)',
    marginBottom: 10,
  },
  footer: {
    paddingBottom: 4,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
});
