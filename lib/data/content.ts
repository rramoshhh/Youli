import type { Page } from '../types';

export const pages: Page[] = [
  {
    id: 'page-about',
    slug: 'about',
    title: 'About Youli Atelier',
    hero:
      'Atelier-crafted lingerie designed to feel intentional, from the first seam to the final silhouette.',
    sections: [
      {
        title: 'Our Approach',
        body:
          'Every piece is engineered for a refined fit, balancing structure with softness for a barely-there feel.',
      },
      {
        title: 'Materials',
        body:
          'We source Italian lace and silk satin with a focus on tactility, longevity, and a luminous finish.',
      },
    ],
  },
  {
    id: 'page-delivery',
    slug: 'delivery-returns',
    title: 'Delivery & Returns',
    hero:
      'Complimentary express shipping and considered returns, designed to feel effortless.',
    sections: [
      {
        title: 'Delivery',
        body:
          'Orders ship within 48 hours from our Paris atelier. Express shipping is complimentary on orders over $120.',
      },
      {
        title: 'Returns',
        body:
          'Returns are accepted within 14 days on unworn items with original tags and hygiene seals intact.',
      },
    ],
  },
];
