import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, Camera, CalendarHeart, ShieldAlert } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';

export default function HomeScreen() {
  const router = useRouter();

  const actions = [
    {
      title: 'Check Symptoms',
      subtitle: 'AI Triage & Diagnosis',
      icon: <Activity color={colors.primary} size={32} />,
      route: '/symptoms',
      color: '#E0F2FE', // light blue
    },
    {
      title: 'Scan Prescription',
      subtitle: 'Extract medicines instantly',
      icon: <Camera color={colors.primary} size={32} />,
      route: '/upload',
      color: '#FEF3C7', // light amber
    },
    {
      title: 'Book Appointment',
      subtitle: 'Consult a local doctor',
      icon: <CalendarHeart color={colors.primary} size={32} />,
      route: '/appointments',
      color: '#D1FAE5', // light emerald
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Typography variant="h1" color={colors.primaryDark}>MedEase</Typography>
        <Typography variant="body" color={colors.textMuted} style={styles.subtitle}>
          Your personal health assistant
        </Typography>
      </View>

      <Card elevated style={styles.alertCard}>
        <View style={styles.alertIcon}>
          <ShieldAlert color={colors.warning} size={24} />
        </View>
        <View style={styles.alertContent}>
          <Typography weight="600">Not feeling well?</Typography>
          <Typography variant="caption" color={colors.textMuted}>
            Describe your symptoms to get immediate AI guidance before booking a visit.
          </Typography>
        </View>
      </Card>

      <Typography variant="h3" style={styles.sectionTitle}>Quick Actions</Typography>
      
      <View style={styles.grid}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => router.push(action.route as any)}
          >
            <Card style={styles.actionCard}>
              <View style={[styles.iconBox, { backgroundColor: action.color }]}>
                {action.icon}
              </View>
              <Typography weight="600" style={styles.actionTitle}>{action.title}</Typography>
              <Typography variant="caption" color={colors.textMuted}>{action.subtitle}</Typography>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  subtitle: {
    marginTop: 4,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    marginBottom: 32,
  },
  alertIcon: {
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  grid: {
    gap: 16,
  },
  actionButton: {
    width: '100%',
  },
  actionCard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 20,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
});
