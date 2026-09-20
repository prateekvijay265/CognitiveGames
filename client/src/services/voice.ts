import type { VoiceConfig, SupportedLanguage } from '../types';

export interface VoiceProvider {
  speak(text: string, config?: Partial<VoiceConfig>): Promise<void>;
  stop(): void;
  isSupported(): boolean;
  getLanguageCode(lang: SupportedLanguage): string;
}

const LANGUAGE_CODES: Record<SupportedLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  as: 'as-IN',
  mni: 'en-IN', // Fallback to English for Meitei (TTS support limited)
  kha: 'en-IN', // Fallback to English for Khasi
  lus: 'en-IN', // Fallback to English for Mizo
};

class WebSpeechVoiceProvider implements VoiceProvider {
  private utterance: SpeechSynthesisUtterance | null = null;

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  isSpeaking(): boolean {
    return this.utterance !== null;
  }

  getLanguageCode(lang: SupportedLanguage): string {
    return LANGUAGE_CODES[lang] ?? 'en-IN';
  }

  async speak(text: string, config?: Partial<VoiceConfig>): Promise<void> {
    if (!this.isSupported()) return;

    return new Promise((resolve) => {
      this.stop();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = config?.language ? this.getLanguageCode(config.language) : 'en-IN';
      utterance.rate = config?.rate ?? 0.85;
      utterance.pitch = config?.pitch ?? 1.0;
      utterance.volume = config?.volume ?? 0.9;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      this.utterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
    this.utterance = null;
  }
}

class MockVoiceProvider implements VoiceProvider {
  isSupported(): boolean {
    return false;
  }

  getLanguageCode(lang: SupportedLanguage): string {
    return LANGUAGE_CODES[lang] ?? 'en-IN';
  }

  async speak(text: string): Promise<void> {
    console.log('[MockVoice] Speaking:', text);
    // Simulate speaking delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  stop(): void {
    console.log('[MockVoice] Stopped');
  }
}

// Factory: use Web Speech if available, else mock
function createVoiceProvider(): VoiceProvider {
  if ('speechSynthesis' in window) {
    return new WebSpeechVoiceProvider();
  }
  return new MockVoiceProvider();
}

class VoiceService {
  private provider: VoiceProvider;
  private config: VoiceConfig;
  private lastText: string = '';

  constructor() {
    this.provider = createVoiceProvider();
    this.config = {
      enabled: true,
      language: 'en',
      rate: 0.85,
      pitch: 1.0,
      volume: 0.9,
    };
  }

  setConfig(config: Partial<VoiceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async speak(text: string): Promise<void> {
    if (!this.config.enabled) return;
    this.lastText = text;
    await this.provider.speak(text, this.config);
  }

  async repeat(): Promise<void> {
    if (this.lastText) {
      await this.speak(this.lastText);
    }
  }

  stop(): void {
    this.provider.stop();
  }

  isSupported(): boolean {
    return this.provider.isSupported();
  }

  setLanguage(lang: SupportedLanguage): void {
    this.config.language = lang;
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    if (!enabled) this.stop();
  }
}

export const voiceService = new VoiceService();
export default voiceService;
