import type { Collection, Product } from '../types';

export const collections: Collection[] = [
  {
    id: 'col_sets',
    handle: 'sets',
    title: 'Signature Sets',
    description: 'Matching sets with sculpted lace and satin foundations.',
    image: {
      src: '/assets/boidour4.webp',
      alt: 'Model wearing the Noir Lace lingerie set in matte black lace.',
    },
  },
  {
    id: 'col_bras',
    handle: 'bras',
    title: 'Bras',
    description: 'Soft-structure bras designed for a refined everyday fit.',
    image: {
      src: '/assets/boidour1.webp',
      alt: 'Lace bra in soft studio lighting.',
    },
  },
  {
    id: 'col_panties',
    handle: 'panties',
    title: 'Panties',
    description: 'Minimal silhouettes with couture finishing.',
    image: {
      src: '/assets/boidour2.webp',
      alt: 'Close-up of satin lingerie detailing.',
    },
  },
];

export const products: Product[] = [
  {
    id: 'prod_noir_lace',
    slug: 'noir-lace-set',
    title: 'Noir Lace Set',
    description: 'Matte silk foundation with sculpted lace geometry.',
    longDescription:
      'Matte silk foundation with sculpted lace and adjustable straps for a seamless, luminous fit.',
    price: 128,
    currency: 'USD',
    images: [
      { src: '/assets/boidour4.webp', alt: 'Noir Lace set front view.' },
      { src: '/assets/boidour1.webp', alt: 'Noir Lace set side view.' },
      { src: '/assets/boidour5.webp', alt: 'Noir Lace set detail view.' },
    ],
    collectionHandle: 'sets',
    collectionTitle: 'Signature Sets',
    badge: 'Signature Look',
    rating: 4.9,
    reviewCount: 312,
    details: [
      'French lace, silk-lined cups, brushed elastic for comfort.',
      'Adjustable straps and hook-and-eye closure.',
    ],
    fitCare: [
      'True to size. Hand wash cold, lay flat to dry.',
      'Avoid heat to preserve lace structure.',
    ],
    delivery: [
      'Delivery timelines and rates are shown at checkout.',
      'Packaging is designed to protect delicate lace.',
    ],
  },
  {
    id: 'prod_satin_line',
    slug: 'satin-line-set',
    title: 'Satin Line Set',
    description: 'Liquid satin with clean contour seams.',
    longDescription:
      'Liquid satin with clean contour seams and a smooth, second-skin feel.',
    price: 112,
    currency: 'USD',
    images: [
      { src: '/assets/boidour6.webp', alt: 'Satin Line set in luminous ivory.' },
      { src: '/assets/boidour3.webp', alt: 'Satin Line set detail shot.' },
    ],
    collectionHandle: 'sets',
    collectionTitle: 'Signature Sets',
    badge: 'Featured',
    rating: 4.7,
    reviewCount: 198,
    details: [
      'Silk satin with a softly structured cup.',
      'Light boning for gentle shape and lift.',
    ],
    fitCare: [
      'Fits true to size. Wash in lingerie bag.',
      'Line dry for longest wear.',
    ],
    delivery: [
      'Delivery timelines and rates are shown at checkout.',
      'Orders are packed with care for satin finishes.',
    ],
  },
  {
    id: 'prod_velvet_bloom',
    slug: 'velvet-bloom-set',
    title: 'Velvet Bloom Set',
    description: 'Velvet-soft mesh with tonal floral motifs.',
    longDescription:
      'Velvet-soft mesh with tonal floral motifs and a graceful, sculpted fit.',
    price: 136,
    currency: 'USD',
    images: [
      { src: '/assets/boidour7.webp', alt: 'Velvet Bloom set in soft light.' },
      { src: '/assets/boidour5.webp', alt: 'Velvet Bloom close-up detail.' },
    ],
    collectionHandle: 'sets',
    collectionTitle: 'Signature Sets',
    badge: 'New Season',
    rating: 4.8,
    reviewCount: 164,
    details: [
      'Sheer velvet mesh with floral appliqué.',
      'Comfort elastic with signature gold hardware.',
    ],
    fitCare: [
      'Fits true to size. Hand wash recommended.',
      'Store flat to preserve applique shape.',
    ],
    delivery: [
      'Delivery timelines and rates are shown at checkout.',
      'Packaged to maintain shape and softness.',
    ],
  },
  {
    id: 'prod_atelier_bra',
    slug: 'atelier-bra',
    title: 'Atelier Bra',
    description: 'Soft structure, barely-there coverage.',
    longDescription:
      'Soft structure, barely-there coverage with elevated finishing and a refined edge.',
    price: 96,
    currency: 'USD',
    images: [
      { src: '/assets/boidour2.webp', alt: 'Atelier Bra in warm neutral tone.' },
      { src: '/assets/boidour1.webp', alt: 'Atelier Bra with lace detailing.' },
    ],
    collectionHandle: 'bras',
    collectionTitle: 'Bras',
    rating: 4.6,
    reviewCount: 142,
    details: [
      'Soft mesh with minimal seaming.',
      'Adjustable straps and smooth underband.',
    ],
    fitCare: [
      'True to size. Hand wash cold.',
      'Dry flat away from direct heat.',
    ],
    delivery: ['Delivery timelines and rates are shown at checkout.'],
  },
  {
    id: 'prod_silk_slip',
    slug: 'silk-slip',
    title: 'Silk Slip',
    description: 'Bias-cut satin with a liquid drape.',
    longDescription:
      'Bias-cut satin with a liquid drape and adjustable straps for all-day ease.',
    price: 98,
    currency: 'USD',
    images: [
      { src: '/assets/boidour3.webp', alt: 'Silk Slip in soft studio lighting.' },
      { src: '/assets/boidour6.webp', alt: 'Silk Slip detail view.' },
    ],
    collectionHandle: 'sets',
    collectionTitle: 'Signature Sets',
    rating: 4.5,
    reviewCount: 108,
    details: [
      'Bias-cut satin with a low, elegant back.',
      'Soft straps with gold-tone adjusters.',
    ],
    fitCare: [
      'Fits true to size. Hand wash cold.',
      'Dry flat to preserve sheen.',
    ],
    delivery: ['Delivery timelines and rates are shown at checkout.'],
  },
  {
    id: 'prod_signature_brief',
    slug: 'signature-brief',
    title: 'Signature Brief',
    description: 'High-rise brief with clean line finish.',
    longDescription:
      'High-rise brief with clean line finish and a smooth, invisible edge.',
    price: 72,
    currency: 'USD',
    images: [
      { src: '/assets/boidour5.webp', alt: 'Signature Brief in soft black.' },
      { src: '/assets/boidour2.webp', alt: 'Signature Brief close-up detail.' },
    ],
    collectionHandle: 'panties',
    collectionTitle: 'Panties',
    rating: 4.4,
    reviewCount: 86,
    details: [
      'Soft microfiber with seamless finish.',
      'Cotton gusset for breathability.',
    ],
    fitCare: [
      'Fits true to size. Machine wash cold in lingerie bag.',
      'Lay flat to dry.',
    ],
    delivery: ['Delivery timelines and rates are shown at checkout.'],
  },
];

export const featuredProducts = products.slice(0, 3);
export const recentlyViewed = products.slice(3, 6);
