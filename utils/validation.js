const { URL } = require('url');
const { httpError } = require('./http');

const SORT_OPTIONS = ['newest', 'top', 'trending'];
const MAX_SEARCH_LENGTH = 80;
const MAX_PAGE_SIZE = 20;
const DEFAULT_PAGE_SIZE = 10;

const normalizeText = value => (typeof value === 'string' ? value.trim() : '');

const requirePositiveInteger = (value, message = 'A valid id is required.') => {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw httpError(400, message);
  }

  return parsedValue;
};

const normalizeSlug = value => normalizeText(value).toLowerCase();

const validateSlug = value => {
  const slug = normalizeSlug(value);

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw httpError(400, 'A valid topic slug is required.');
  }

  return slug;
};

const validateOptionalSlug = value => {
  if (!value) {
    return '';
  }

  return validateSlug(value);
};

const validateSearchQuery = value => {
  const query = normalizeText(value);

  if (query.length > MAX_SEARCH_LENGTH) {
    throw httpError(400, `Search must be ${MAX_SEARCH_LENGTH} characters or fewer.`);
  }

  return query;
};

const validateSort = value => {
  const sort = normalizeText(value || 'newest').toLowerCase();

  if (!SORT_OPTIONS.includes(sort)) {
    throw httpError(400, 'Sort must be newest, top, or trending.');
  }

  return sort;
};

const validatePage = value => {
  const page = Number(value || 1);

  if (!Number.isInteger(page) || page < 1) {
    throw httpError(400, 'Page must be a positive whole number.');
  }

  return page;
};

const validatePageSize = value => {
  const pageSize = Number(value || DEFAULT_PAGE_SIZE);

  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
    throw httpError(400, `Page size must be between 1 and ${MAX_PAGE_SIZE}.`);
  }

  return pageSize;
};

const validateTagIds = value => {
  const tagIds = Array.isArray(value) ? value : value ? [value] : [];
  const uniqueIds = [...new Set(tagIds.map(id => requirePositiveInteger(id, 'Tag ids must be valid.')))];

  return uniqueIds;
};

const validateHttpUrl = value => {
  const url = normalizeText(value);

  try {
    const parsedUrl = new URL(url);

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Unsupported protocol');
    }
  } catch {
    throw httpError(400, 'Post URL must be a valid HTTP or HTTPS URL.');
  }

  return url;
};

module.exports = {
  DEFAULT_PAGE_SIZE,
  SORT_OPTIONS,
  normalizeText,
  requirePositiveInteger,
  validateHttpUrl,
  validateOptionalSlug,
  validatePage,
  validatePageSize,
  validateSearchQuery,
  validateSlug,
  validateSort,
  validateTagIds
};
