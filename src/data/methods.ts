import { Methods } from '../types/Methods'

// the keys are ISO 3166-1 alpha-3 country codes (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3)
export const CountryMethods = {
  SAU: [Methods.UMM_AL_QURA],
  AFG: [Methods.KARACHI],
  ALB: [Methods.MUSLIM_WORLD_LEAGUE],
  ARE: [Methods.DUBAI],
  BGD: [Methods.KARACHI],
  BHR: [Methods.BAHRAIN],
  BRN: [Methods.BRUNEI],
  CAN: [Methods.NORTH_AMERICA, Methods.MUSLIM_WORLD_LEAGUE],
  DEU: [Methods.GERMANY],
  // DNK: ['Europe/Copenhagen'],
  DZA: [Methods.ALGERIA],
  EGY: [Methods.EGYPTIAN],
  FRA: [Methods.FRANCE, Methods.NORTH_AMERICA, Methods.STANDARD],
  GBR: [Methods.NORTH_AMERICA, Methods.MUSLIM_WORLD_LEAGUE, Methods.MOONSIGHTING_COMMITTEE],
  IDN: [Methods.INDONESIA],
  IND: [Methods.KARACHI],
  IRN: [Methods.TEHRAN],
  IRQ: [Methods.IRAQ],
  ISR: [Methods.PALESTINE],
  JOR: [Methods.JORDAN],
  KWT: [Methods.KUWAIT],
  LBN: [Methods.EGYPTIAN],
  LBY: [Methods.LIBYA],
  MAR: [Methods.MOROCCO],
  MYS: [Methods.MALAYSIA],
  OMN: [Methods.OMAN],
  PAK: [Methods.KARACHI],
  PSE: [Methods.PALESTINE],
  QAT: [Methods.QATAR],
  RUS: [Methods.RUSSIA],
  // SDN: ['Africa/Khartoum'],
  SGP: [Methods.SINGAPORE],
  THA: [Methods.MALAYSIA],
  TUN: [Methods.TUNISIA],
  TUR: [Methods.TURKEY],
  USA: [Methods.NORTH_AMERICA, Methods.MUSLIM_WORLD_LEAGUE, Methods.MOONSIGHTING_COMMITTEE, Methods.EGYPTIAN],
  YEM: [Methods.YEMEN],
}