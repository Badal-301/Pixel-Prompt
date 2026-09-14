export interface Clue {
  id: string;
  label: string;
  code: string;
  revealedText: string;
  strength: number;
  unlockedHint: string;
  requiredSignals?: number;
  triggerGlitch?: boolean;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMsRemaining: number;
  isExpired: boolean;
}

export interface TelemetryData {
  objectCode: string;
  status: string;
  signalStrength: number;
  origin: string;
  protocol: string;
}

export interface TransmissionRegistration {
  email: string;
  transmissionId: string;
  registeredAt: string;
}
