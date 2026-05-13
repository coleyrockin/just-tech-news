const mockFindAll = jest.fn();
const mockFindOne = jest.fn();

jest.mock('../models', () => ({
  User: {
    findAll: mockFindAll,
    findOne: mockFindOne
  },
  Post: {},
  Comment: {},
  Vote: {}
}));

const userRoutes = require('../controllers/api/user-routes');

const getRoute = path => {
  const layer = userRoutes.stack.find(routeLayer => routeLayer.route?.path === path);
  return layer.route.stack[0].handle;
};

const createResponse = () => ({
  body: undefined,
  statusCode: 200,
  json(payload) {
    this.body = payload;
    return this;
  },
  status(code) {
    this.statusCode = code;
    return this;
  }
});

test('public users endpoint does not request email or password attributes', async () => {
  mockFindAll.mockResolvedValueOnce([]);
  const response = createResponse();

  await getRoute('/')({}, response, jest.fn());

  expect(mockFindAll).toHaveBeenCalledWith({ attributes: ['id', 'username'] });
  expect(response.body).toEqual([]);
});

test('public single-user endpoint does not request email or password attributes', async () => {
  const user = { id: 1, username: 'casey' };
  mockFindOne.mockResolvedValueOnce(user);
  const response = createResponse();

  await getRoute('/:id')({ params: { id: 1 } }, response, jest.fn());

  expect(mockFindOne.mock.calls[0][0].attributes).toEqual(['id', 'username']);
  expect(response.body).toBe(user);
});
