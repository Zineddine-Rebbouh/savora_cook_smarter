import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function useVoiceCommands() {
  const isSupported = Platform.OS !== 'web';
  const [isListening, setIsListening] = useState(false);
  const [partial, setPartial] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) =>
      setPartial(e.value?.[0] ?? '');
    Voice.onSpeechResults = (e: SpeechResultsEvent) =>
      setResults(e.value ?? []);
    Voice.onSpeechError = (e: SpeechErrorEvent) =>
      setError(e.error?.message ?? e.error?.code ?? 'Speech recognition failed');

    return () => {
      Voice.destroy();
      Voice.removeAllListeners();
    };
  }, [isSupported]);

  const start = useCallback(async () => {
    if (!isSupported) {
      return;
    }

    setError(null);
    setResults([]);
    setPartial('');

    try {
      await Voice.start('en-US');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start listening');
    }
  }, [isSupported]);

  const stop = useCallback(async () => {
    if (!isSupported) {
      return;
    }

    try {
      await Voice.stop();
    } catch {
      // already stopped
    }
  }, [isSupported]);

  return { isSupported, isListening, partial, results, error, start, stop };
}
