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

const { width } = Dimensions.get('window');

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ visible, onClose }: ProfileDrawerProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const slideAnim = React.useRef(new Animated.Value(width)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 250,
        useNativeDriver: true,
      }).start();
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

        {/* Drawer Panel */}
        <Animated.View 
          style={[
            styles.drawerContainer,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <LinearGradient
            colors={['rgba(15,18,20,0.95)', 'rgba(15,18,20,0.85)']}
            style={styles.drawerGradient}
          >
            <BlurView intensity={30} tint="dark" style={styles.drawerContent}>
              
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
                          size={20} 
                          color="rgba(255,255,255,0.9)" 
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
              <View style={styles.footer}>
                <Text style={styles.footerText}>v1.0 · Made by Trāvea</Text>
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  drawerGradient: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    overflow: 'hidden',
  },
  drawerContent: {
    flex: 1,
    paddingTop: Platform.select({ ios: 60, android: 40 }),
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  menuList: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    paddingVertical: 18,
  },
  menuItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(194,164,110,0.1)',
    marginHorizontal: -24,
    marginVertical: 4,
  },
  footer: {
    paddingTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
});
