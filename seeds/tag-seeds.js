const { Tag } = require('../models');

const tagdata = [
  {
    name: 'AI',
    slug: 'ai',
    description: 'Machine learning, agents, research, and applied AI tools.',
    color_token: 'tag-ai'
  },
  {
    name: 'Web Dev',
    slug: 'web-dev',
    description: 'Frontend, backend, APIs, performance, and developer tooling.',
    color_token: 'tag-web'
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'AppSec, privacy, threat research, and defensive engineering.',
    color_token: 'tag-security'
  },
  {
    name: 'Cloud',
    slug: 'cloud',
    description: 'Infrastructure, serverless, databases, and platform engineering.',
    color_token: 'tag-cloud'
  },
  {
    name: 'Open Source',
    slug: 'open-source',
    description: 'Libraries, maintainers, licensing, and community projects.',
    color_token: 'tag-open'
  },
  {
    name: 'Startups',
    slug: 'startups',
    description: 'Product strategy, funding, launch lessons, and growth.',
    color_token: 'tag-startups'
  },
  {
    name: 'Hardware',
    slug: 'hardware',
    description: 'Chips, devices, robotics, and the physical side of tech.',
    color_token: 'tag-hardware'
  }
];

const seedTags = () => Tag.bulkCreate(tagdata);

module.exports = seedTags;
