import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { MapPin, Clock, Calendar as CalendarIcon } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getAvailableSlots, AppointmentSlot } from '../../services/api';

export default function AppointmentsScreen() {
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    setLoading(true);
    try {
      const data = await getAvailableSlots();
      setSlots(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load slots.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (slot: AppointmentSlot) => {
    Alert.alert(
      'Confirm Booking',
      `Would you like to book an appointment with ${slot.doctorName} at ${slot.time}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          style: 'default',
          onPress: () => {
            Alert.alert('Success', 'Your appointment has been booked successfully! You will receive an SMS confirmation.');
            // In a real app, we'd update the backend here and refresh the list
            setSlots((prev) => prev.map(s => s.id === slot.id ? { ...s, available: false } : s));
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Typography variant="h2" style={{ marginBottom: 8 }}>Available Doctors</Typography>
        <Typography variant="body" color={colors.textMuted}>
          Find and book a telemedicine slot with a nearby primary health center or specialist.
        </Typography>
      </View>

      {loading ? (
        <Typography align="center" style={{ marginTop: 40 }} color={colors.textMuted}>
          Loading available slots...
        </Typography>
      ) : (
        <View style={styles.list}>
          {slots.map((slot) => (
            <Card key={slot.id} style={[styles.slotCard, !slot.available && styles.slotCardDisabled]}>
              <View style={styles.slotHeader}>
                <View>
                  <Typography weight="bold" style={{ fontSize: 18 }}>{slot.doctorName}</Typography>
                  <Typography variant="caption" color={colors.primaryDark} style={{ marginTop: 2 }}>
                    {slot.specialty}
                  </Typography>
                </View>
                <View style={styles.timeTag}>
                  <Clock size={14} color={slot.available ? colors.primaryDark : colors.textMuted} />
                  <Typography variant="caption" weight="600" color={slot.available ? colors.primaryDark : colors.textMuted} style={{ marginLeft: 4 }}>
                    {slot.time}
                  </Typography>
                </View>
              </View>

              <View style={styles.locationRow}>
                <MapPin size={16} color={colors.textLight} />
                <Typography variant="caption" color={colors.textMuted} style={{ marginLeft: 6 }}>
                  Telemedicine / Virtual Clinic
                </Typography>
              </View>

              <Button
                title={slot.available ? "Book Slot" : "Fully Booked"}
                variant={slot.available ? "primary" : "outline"}
                disabled={!slot.available}
                onPress={() => handleBook(slot)}
                style={styles.bookButton}
              />
            </Card>
          ))}
        </View>
      )}
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
  },
  list: {
    gap: 16,
  },
  slotCard: {
    padding: 20,
  },
  slotCardDisabled: {
    opacity: 0.7,
    backgroundColor: '#F8FAFC', // slightly grayer
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bookButton: {
    width: '100%',
  },
});
