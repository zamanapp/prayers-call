// https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
// https://webspace.science.uu.nl/~gent0113/islam/islam_tabcal_variants.htm
export enum HijriCalendar {
  GENERAL = 'islamic',
  CIVIC = 'islamic-civil',
  TABULAR = 'islamic-tbla',
  UMM_AL_QURA = 'islamic-umalqura',
  SIGHTING_SA = 'islamic-rgsa',
}
