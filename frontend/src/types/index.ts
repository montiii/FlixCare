export interface Baby {
  id?: number;
  name: string;
  birthDate: string;
  gender?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeedingRecord {
  id?: number;
  babyId: number;
  babyName?: string;
  feedingTime: string;
  feedingType: FeedingType;
  amountMl?: number;
  durationMinutes?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum FeedingType {
  BREAST_LEFT = 'BREAST_LEFT',
  BREAST_RIGHT = 'BREAST_RIGHT',
  BREAST_BOTH = 'BREAST_BOTH',
  BOTTLE_FORMULA = 'BOTTLE_FORMULA',
  BOTTLE_BREAST_MILK = 'BOTTLE_BREAST_MILK',
  SOLID_FOOD = 'SOLID_FOOD'
}

export interface TemperatureRecord {
  id?: number;
  babyId: number;
  babyName?: string;
  measurementTime: string;
  temperatureCelsius: number;
  measurementLocation?: MeasurementLocation;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum MeasurementLocation {
  FOREHEAD = 'FOREHEAD',
  EAR = 'EAR',
  RECTAL = 'RECTAL',
  ARMPIT = 'ARMPIT',
  ORAL = 'ORAL'
}

export interface CleaningRecord {
  id?: number;
  babyId: number;
  babyName?: string;
  cleaningTime: string;
  cleaningType: CleaningType;
  diaperContent?: DiaperContent;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum CleaningType {
  DIAPER_CHANGE = 'DIAPER_CHANGE',
  BATH = 'BATH',
  SPONGE_BATH = 'SPONGE_BATH',
  HAIR_WASH = 'HAIR_WASH'
}

export enum DiaperContent {
  WET = 'WET',
  DIRTY = 'DIRTY',
  BOTH = 'BOTH',
  CLEAN = 'CLEAN'
}

export interface WeightRecord {
  id?: number;
  babyId: number;
  babyName?: string;
  measurementTime: string;
  weightGrams: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicationRecord {
  id?: number;
  babyId: number;
  babyName?: string;
  medicationTime: string;
  medicationType: MedicationType;
  dosage?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export enum MedicationType {
  VITAMIN_D = 'VITAMIN_D',
  EYE_CLEANING = 'EYE_CLEANING'
}

