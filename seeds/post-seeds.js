const { Post } = require('../models');

const postdata = [
  {
    title: 'OpenAI releases a practical guide to building reliable agent workflows',
    post_url: 'https://openai.com/index/new-tools-for-building-agents/',
    user_id: 10
  },
  {
    title: 'CISA shares secure-by-design guidance for small engineering teams',
    post_url: 'https://www.cisa.gov/resources-tools/resources/secure-by-design',
    user_id: 8
  },
  {
    title: 'The modern web performance checklist teams are using in production',
    post_url: 'https://web.dev/articles/performance',
    user_id: 1
  },
  {
    title: 'How early-stage startups are using AI copilots without losing product focus',
    post_url: 'https://a16z.com/ai-startups/',
    user_id: 4
  },
  {
    title: 'Inside the database choices behind fast serverless applications',
    post_url: 'https://aws.amazon.com/serverless/',
    user_id: 7
  },
  {
    title: 'Why accessibility audits catch more than screen reader defects',
    post_url: 'https://developer.mozilla.org/en-US/docs/Learn/Accessibility',
    user_id: 4
  },
  {
    title: 'Passkeys are changing the shape of consumer authentication',
    post_url: 'https://www.passkeys.io/',
    user_id: 1
  },
  {
    title: 'A maintainer guide to keeping open-source issue queues healthy',
    post_url: 'https://opensource.guide/best-practices/',
    user_id: 1
  },
  {
    title: 'Product-led growth lessons from technical developer tools',
    post_url: 'https://www.productled.org/foundations/what-is-product-led-growth',
    user_id: 9
  },
  {
    title: 'Serverless cold starts are becoming a design problem, not just an infra problem',
    post_url: 'https://vercel.com/docs/functions',
    user_id: 5
  },
  {
    title: 'The chip supply chain behind the next wave of edge AI devices',
    post_url: 'https://spectrum.ieee.org/semiconductors',
    user_id: 3
  },
  {
    title: 'How to write open-source docs that reduce maintainer support load',
    post_url: 'https://www.writethedocs.org/guide/',
    user_id: 10
  },
  {
    title: 'Security teams are shifting from annual audits to continuous controls',
    post_url: 'https://owasp.org/www-project-devsecops-guideline/',
    user_id: 8
  },
  {
    title: 'Vector databases explained for product engineers',
    post_url: 'https://www.pinecone.io/learn/vector-database/',
    user_id: 3
  },
  {
    title: 'CSS container queries are finally changing component architecture',
    post_url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries',
    user_id: 3
  },
  {
    title: 'What founders should know before adding AI to a workflow product',
    post_url: 'https://www.ycombinator.com/library',
    user_id: 7
  },
  {
    title: 'Robotics teams are borrowing deployment patterns from web engineering',
    post_url: 'https://spectrum.ieee.org/robotics',
    user_id: 6
  },
  {
    title: 'How small open-source projects can handle security disclosures responsibly',
    post_url: 'https://github.com/ossf/scorecard',
    user_id: 4
  },
  {
    title: 'Agentic coding tools need better evals, not just bigger context windows',
    post_url: 'https://github.blog/ai-and-ml/',
    user_id: 6
  },
  {
    title: 'Designing resilient Node APIs for hosted MySQL and serverless runtimes',
    post_url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
    user_id: 7
  }
];

const seedPosts = () => Post.bulkCreate(postdata);

module.exports = seedPosts;
