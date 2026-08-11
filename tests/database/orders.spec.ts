import { expect, test } from '@playwright/test';
import { DatabaseSync } from 'node:sqlite';

test('bezahlte Bestellungen werden korrekt aggregiert', () => {
  const database = new DatabaseSync(':memory:');

  try {
    database.exec(`
      CREATE TABLE orders (
        id INTEGER PRIMARY KEY,
        status TEXT NOT NULL,
        total_cents INTEGER NOT NULL CHECK (total_cents >= 0)
      ) STRICT;
    `);

    const insertOrder = database.prepare(
      'INSERT INTO orders (id, status, total_cents) VALUES (?, ?, ?)',
    );

    insertOrder.run(1, 'PAID', 1299);
    insertOrder.run(2, 'PAID', 2500);
    insertOrder.run(3, 'CANCELLED', 999);
    insertOrder.run(4, 'PAID', 3201);

    const result = database
      .prepare(`
        SELECT
          COUNT(*) AS order_count,
          SUM(total_cents) AS total_cents
        FROM orders
        WHERE status = ?
      `)
      .get('PAID');

    expect(result).toEqual({
      order_count: 3,
      total_cents: 7000,
    });
  } finally {
    database.close();
  }
});
