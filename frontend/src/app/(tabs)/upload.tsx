import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, FileText } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { extractPrescription, OcrResponse } from '../../services/api';

export default function UploadScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OcrResponse | null>(null);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to grant camera permissions to use this feature.');
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      setImageUri(pickerResult.assets[0].uri);
      processImage(pickerResult.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to grant gallery permissions to use this feature.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets[0]) {
      setImageUri(pickerResult.assets[0].uri);
      processImage(pickerResult.assets[0].uri);
    }
  };

  const processImage = async (uri: string) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await extractPrescription(uri);
      setResult(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to extract text from the prescription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.headerCard}>
        <View style={styles.iconCircle}>
          <FileText color={colors.primary} size={32} />
        </View>
        <Typography variant="h2" style={{ marginTop: 16, marginBottom: 8 }}>
          Extract Prescription
        </Typography>
        <Typography variant="body" color={colors.textMuted} align="center">
          Upload a clear photo of your handwritten or printed prescription to instantly extract medicine names.
        </Typography>
      </Card>

      <View style={styles.actionRow}>
        <Button
          title="Take Photo"
          icon={<Camera color="#FFF" size={20} />}
          onPress={takePhoto}
          style={styles.actionButton}
        />
        <Button
          title="Gallery"
          variant="secondary"
          icon={<ImageIcon color="#FFF" size={20} />}
          onPress={pickImage}
          style={styles.actionButton}
        />
      </View>

      {imageUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        </View>
      )}

      {loading && (
        <Card style={styles.loadingCard}>
          <Typography weight="600" color={colors.primary}>
            Scanning with AI...
          </Typography>
          <Typography variant="caption" color={colors.textMuted} style={{ marginTop: 4 }}>
            Please wait while we extract the medicines.
          </Typography>
        </Card>
      )}

      {result && (
        <Card elevated style={styles.resultCard}>
          <Typography variant="h3" style={{ marginBottom: 16 }}>
            Extracted Medicines
          </Typography>
          {result.medicines.map((med, idx) => (
            <View key={idx} style={styles.medicineItem}>
              <View style={styles.bullet} />
              <Typography style={{ flex: 1 }}>{med}</Typography>
            </View>
          ))}
          <View style={styles.rawTextContainer}>
            <Typography variant="caption" weight="600" color={colors.textMuted}>Raw Text:</Typography>
            <Typography variant="caption" color={colors.textLight} style={{ marginTop: 4 }}>
              {result.rawText}
            </Typography>
          </View>
        </Card>
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
  headerCard: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 24,
    backgroundColor: '#E0F2FE',
    borderWidth: 0,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
  previewContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  loadingCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  resultCard: {
    backgroundColor: colors.card,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 12,
  },
  rawTextContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
