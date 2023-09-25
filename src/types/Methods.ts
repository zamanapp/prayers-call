export enum Methods {
  UMM_AL_QURA = 'UmmAlQura', // Umm al-Qura University, Makkah (should also use altitude)
  MUSLIM_WORLD_LEAGUE = 'MuslimWorldLeague', // Muslim World League (should also use altitude)
  MOONSIGHTING_COMMITTEE = 'MoonsightingCommittee', // Moon sighting Committee
  KUWAIT = 'Kuwait',
  QATAR = 'Qatar',
  EGYPTIAN = 'Egyptian', // Egyptian General Authority of Survey (should also use altitude)
  KARACHI = 'Karachi', // University of Islamic Sciences, Karachi (should also use altitude)
  TURKEY = 'Turkey', // Dianet
  DUBAI = 'Dubai', // (should also use altitude)
  SINGAPORE = 'Singapore', // Majlis Ugama Islam Singapura (MUIS)
  NORTH_AMERICA = 'NorthAmerica', // ISNA (should also use altitude)
  TEHRAN = 'Tehran', // Institute of Geophysics, University of Tehran
  // Custom Methods
  // UMM_AL_QURA_RAMADAN = 'UmmAlQuraRamadan', // Umm al-Qura University, Makkah (Ramadan) - adds 30 minutes on top of the 90 minutes used for UmmAlQura (120 minutes total)
  STANDARD = 'Standard', // 18 degrees
  ALGERIA = 'Algeria',
  BAHRAIN = 'Bahrain',
  BRUNEI = 'Brunei',
  FRANCE = 'France', // 12, as 15, 18 degrees is covered by ISNA and Standard respectively
  GERMANY = 'Germany', // needs to be tested
  INDONESIA = 'Indonesia', // Kementerian Agama Republik Indonesia (Kemenag)
  IRAQ = 'Iraq',
  JORDAN = 'Jordan', // (should also use altitude)
  LIBYA = 'Libya',
  MALAYSIA = 'Malaysia', // Jabatan Kemajuan Islam Malaysia (JAKIM)
  MOROCCO = 'Morocco', // (should also use altitude)
  RUSSIA = 'Russia', // needs to be tested
  OMAN = 'Oman',
  PALESTINE = 'Palestine', // (should also use altitude)
  SUDAN = 'Sudan',
  SYRIA = 'Syria', // (should also use altitude)
  TUNISIA = 'Tunisia', // (should also use altitude)
  YEMEN = 'Yemen', // (should also use altitude)
}

// EGYPTIAN_ALTRNATIVE = 'Other', // no method adjustments
// ISNA_ALTERNATIVE = 'Other', // no method adjustments
// MUSLIM_WORLD_LEAGUE_ALTERNATIVE = 'Other', // no method adjustments
// UMMUL_QURA_ALTERNATIVE = 'Other', // duhr adjusted 1 minute
// KARACHI_ALTERNATIVE = 'Other', // no method adjustments
// DUBAI_ALTERNATIVE = 'Other', // fajr and isha angles changed to 18 degrees and duhr adjusted 2 minute
