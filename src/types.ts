export type UltimatrixMode =
  | 'STANDBY'
  | 'ACTIVE_SELECTION'
  | 'TRANSFORMING'
  | 'TRANSFORMED'
  | 'ULTIMATE_MODE'
  | 'COOLDOWN';

export interface AlienData {
  id: string;
  name: string;
  ultimateName: string;
  species: string;
  planet: string;
  color: string;
  secondaryColor: string;
  ultimateColor: string;
  abilities: string[];
  ultimateAbilities: string[];
  description: string;
  ultimateDescription: string;
}

export interface UltimatrixStateSnapshot {
  mode: UltimatrixMode;
  selectedAlienIndex: number;
  selectedAlien: AlienData;
  isUltimate: boolean;
  cooldownPercent: number;
  timeRemaining: number;
  totalDuration: number;
  audioEnabled: boolean;
}

export type StateChangeCallback = (state: UltimatrixStateSnapshot) => void;
