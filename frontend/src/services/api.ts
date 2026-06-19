// Mock API Service for Hackathon Frontend

export interface SymptomResponse {
  diagnosis: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface OcrResponse {
  medicines: string[];
  rawText: string;
}

export interface AppointmentSlot {
  id: string;
  doctorName: string;
  specialty: string;
  time: string;
  available: boolean;
}

const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyzeSymptoms = async (symptoms: string): Promise<SymptomResponse> => {
  await mockDelay(1500); // Simulate API latency
  
  if (symptoms.toLowerCase().includes('chest pain') || symptoms.toLowerCase().includes('breath')) {
    return {
      diagnosis: 'Potential cardiac issue or severe respiratory distress. Seek immediate medical attention.',
      severity: 'High',
    };
  }
  
  if (symptoms.toLowerCase().includes('fever') && symptoms.toLowerCase().includes('cough')) {
    return {
      diagnosis: 'Likely viral respiratory infection. Monitor temperature and stay hydrated. Consult a doctor if fever persists for more than 3 days.',
      severity: 'Medium',
    };
  }

  return {
    diagnosis: 'Mild symptoms detected. Rest and observe. If symptoms worsen, please consult a healthcare professional.',
    severity: 'Low',
  };
};

export const extractPrescription = async (imageUri: string): Promise<OcrResponse> => {
  await mockDelay(2000); // Simulate OCR and LLM processing
  return {
    medicines: ['Paracetamol 500mg - Twice a day', 'Azithromycin 250mg - Once a day for 3 days', 'Cetirizine 10mg - At night'],
    rawText: 'Rx... Paracetamol 500mg bd... Azithromycin 250mg od x 3d... Cetirizine 10mg hs...',
  };
};

export const getAvailableSlots = async (): Promise<AppointmentSlot[]> => {
  await mockDelay(800);
  return [
    { id: '1', doctorName: 'Dr. R. Sharma', specialty: 'General Physician', time: '10:00 AM', available: true },
    { id: '2', doctorName: 'Dr. P. Patel', specialty: 'General Physician', time: '11:30 AM', available: false },
    { id: '3', doctorName: 'Dr. S. Gupta', specialty: 'Cardiologist', time: '02:00 PM', available: true },
    { id: '4', doctorName: 'Dr. A. Verma', specialty: 'Pediatrician', time: '04:15 PM', available: true },
  ];
};
