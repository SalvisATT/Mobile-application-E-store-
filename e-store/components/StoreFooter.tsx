import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2025 Store. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    height: '10%',
    backgroundColor: '#5E4B3C',
    color: '#FDF6E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    fontFamily: "'Merriweather', serif",
    borderTopWidth: 2,
    borderTopColor: '#8C6D50',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footerText: {
    color: '#FDF6E3',
    fontFamily: "'Merriweather', serif",
  },
});

export default Footer;
