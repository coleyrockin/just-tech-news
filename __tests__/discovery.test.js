const { Tag } = require('../models');
const { buildPostQueryOptions, normalizeDiscoveryQuery } = require('../utils/post-query');
const { validateTagIds } = require('../utils/validation');

test('normalizeDiscoveryQuery() validates and normalizes feed filters', () => {
  const filters = normalizeDiscoveryQuery({
    q: ' React ',
    sort: 'top',
    tag: 'web-dev',
    page: '2'
  });

  expect(filters).toMatchObject({
    q: 'React',
    sort: 'top',
    tag: 'web-dev',
    page: 2,
    pageSize: 10,
    limit: 10,
    offset: 10
  });
});

test('normalizeDiscoveryQuery() rejects unsupported sorts', () => {
  expect(() => normalizeDiscoveryQuery({ sort: 'random' })).toThrow('Sort must be newest');
});

test('validateTagIds() returns unique positive integer ids', () => {
  expect(validateTagIds(['3', '3', 7])).toEqual([3, 7]);
});

test('buildPostQueryOptions() requires the selected tag when filtering', () => {
  const options = buildPostQueryOptions({
    q: '',
    sort: 'newest',
    tag: 'ai',
    limit: 10,
    offset: 0
  });
  const tagInclude = options.include.find(include => include.as === 'tags');

  expect(options.distinct).toBe(true);
  expect(tagInclude.required).toBe(true);
  expect(tagInclude.where).toEqual({ slug: 'ai' });
});

test('Tag validates topic slugs', async () => {
  const tag = Tag.build({
    name: 'Bad Slug',
    slug: 'Bad Slug!',
    description: 'Invalid topic slug',
    color_token: 'tag-ai'
  });

  await expect(tag.validate()).rejects.toThrow();
});
