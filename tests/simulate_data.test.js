const { generateMany } = require('../simulate_data');

describe('simulate_data.generateMany', () => {
  test('returns requested number of records with expected fields', () => {
    const rows = generateMany(5);
    expect(Array.isArray(rows)).toBe(true);
    expect(rows).toHaveLength(5);
    const tsRe = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    rows.forEach(r => {
      expect(['device_1', 'device_2']).toContain(r.device_id);
      expect(typeof r.timestamp).toBe('string');
      expect(r.timestamp).toMatch(tsRe);
      expect(r.acknowledged).toBe(false);
      expect(typeof r.randomExtra).toBe('string');
      expect(r.randomExtra.length).toBeGreaterThan(0);
    });
  });

  test('defaults to 10 records when no count provided', () => {
    const rows = generateMany();
    expect(rows).toHaveLength(10);
  });
});