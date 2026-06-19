import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Send } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { analyzeSymptoms, SymptomResponse } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  severity?: 'Low' | 'Medium' | 'High';
}

export default function SymptomsScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your MedEase AI assistant. Please describe your symptoms in detail.',
      sender: 'bot',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('@symptoms_chat');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (e) {
      console.log('Failed to load chat history');
    }
  };

  const saveChatHistory = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem('@symptoms_chat', JSON.stringify(newMessages));
    } catch (e) {
      console.log('Failed to save chat history');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await analyzeSymptoms(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.diagnosis,
        sender: 'bot',
        severity: response.severity,
      };
      setMessages((prev) => {
        const updatedMessages = [...prev, botMessage];
        saveChatHistory(updatedMessages);
        return updatedMessages;
      });
    } catch (error) {
      setMessages((prev) => {
        const errorMessages: Message[] = [
          ...prev,
          { id: Date.now().toString(), text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' },
        ];
        return errorMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity?: 'Low' | 'Medium' | 'High') => {
    if (severity === 'High') return colors.error;
    if (severity === 'Medium') return colors.warning;
    if (severity === 'Low') return colors.success;
    return colors.primary;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Typography
              color={msg.sender === 'user' ? '#FFF' : colors.text}
              style={{ lineHeight: 22 }}
            >
              {msg.text}
            </Typography>
            {msg.severity && (
              <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(msg.severity) + '20' }]}>
                <Typography variant="caption" weight="600" color={getSeverityColor(msg.severity)}>
                  Severity: {msg.severity}
                </Typography>
              </View>
            )}
          </View>
        ))}
        {loading && (
          <View style={[styles.messageBubble, styles.botBubble, styles.loadingBubble]}>
            <ActivityIndicator color={colors.primary} size="small" />
            <Typography variant="caption" color={colors.textMuted} style={{ marginLeft: 8 }}>
              Analyzing...
            </Typography>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your symptoms here..."
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <Button
          title=""
          icon={<Send color="#FFF" size={20} />}
          onPress={handleSend}
          disabled={loading || !input.trim()}
          style={styles.sendButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  severityBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 48,
    maxHeight: 120,
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 0,
    minHeight: 48,
  },
});
