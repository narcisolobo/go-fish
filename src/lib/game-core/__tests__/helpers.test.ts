import { aOrAn, rankNames } from '../helpers';

describe('aOrAn', () => {
  it('returns "an" for vowel-starting words', () => {
    expect(aOrAn('Ace')).toBe('an');
    expect(aOrAn('Eight')).toBe('an');
    expect(aOrAn('Eights')).toBe('an');
    expect(aOrAn('Aces')).toBe('an');
  });

  it('returns "a" for consonant-starting words', () => {
    expect(aOrAn('Four')).toBe('a');
    expect(aOrAn('Jack')).toBe('a');
    expect(aOrAn('Queens')).toBe('a');
  });
});

describe('rankNames', () => {
  const allRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  it('includes all expected ranks in singular and plural', () => {
    for (const rank of allRanks) {
      expect(rankNames.singular[rank as keyof typeof rankNames.singular]).toBeDefined();
      expect(rankNames.plural[rank as keyof typeof rankNames.plural]).toBeDefined();
    }
  });

  it('correctly maps examples in singular form', () => {
    expect(rankNames.singular['A']).toBe('Ace');
    expect(rankNames.singular['6']).toBe('Six');
    expect(rankNames.singular['J']).toBe('Jack');
  });

  it('correctly maps examples in plural form', () => {
    expect(rankNames.plural['A']).toBe('Aces');
    expect(rankNames.plural['6']).toBe('Sixes');
    expect(rankNames.plural['J']).toBe('Jacks');
  });
});
