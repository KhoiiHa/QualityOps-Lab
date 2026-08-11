import { expect, test } from '@playwright/test';

test('GET /posts/1 liefert den erwarteten Beitrag', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');

  const post = await response.json();

  expect(post).toEqual({
    userId: 1,
    id: 1,
    title: expect.any(String),
    body: expect.any(String),
  });
  expect(post.title).not.toHaveLength(0);
  expect(post.body).not.toHaveLength(0);
});

test('GET eines nicht vorhandenen Beitrags liefert 404', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts/999999');

  expect(response.status()).toBe(404);
  expect(response.headers()['content-type']).toContain('application/json');
  expect(await response.json()).toEqual({});
});
