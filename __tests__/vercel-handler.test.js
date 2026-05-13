jest.mock('../app', () => ({
  app: jest.fn(),
  initializeApp: jest.fn().mockResolvedValue(undefined)
}));

const { app, initializeApp } = require('../app');
const handler = require('../api');

test('Vercel handler initializes the app and delegates to Express req/res', async () => {
  const req = { url: '/login' };
  const res = {};

  app.mockReturnValue('handled');

  await expect(handler(req, res)).resolves.toBe('handled');
  expect(initializeApp).toHaveBeenCalledTimes(1);
  expect(app).toHaveBeenCalledWith(req, res);
});
