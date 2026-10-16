import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/clients/strapi';
import { pages as fallbackPages } from '@/lib/data/content';

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return fallbackPages.map((page) => ({ slug: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: 'Page' };
  return { title: page.title, description: page.hero };
}

export default async function CMSPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) {
    notFound();
  }

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero">
          <p className="eyebrow">Youli Atelier</p>
          <h1>{page.title}</h1>
          <p>{page.hero}</p>
        </div>
        <div className="page-sections">
          {page.sections.map((section) => (
            <div className="summary-card" key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
        <Link className="cta ghost" href="/collections">
          Return to shop
        </Link>
      </div>
    </section>
  );
}
