interface SeoProps {
  title: string;
  description: string;
  type?: 'website' | 'article';
  image?: string;
}

export const seo = ({
  title,
  description,
  type = 'website',
  image = '/og-image.png'
}: SeoProps): void => {
  // Update browser document title
  document.title = title;

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }

  // Update OpenGraph Title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', title);
  }

  // Update OpenGraph Description
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', description);
  }

  // Update OpenGraph Type
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) {
    ogType.setAttribute('content', type);
  }

  // Update OpenGraph Image
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    ogImage.setAttribute('content', image);
  }

  // Update Twitter Title
  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', title);
  }

  // Update Twitter Description
  const twitterDescription = document.querySelector('meta[property="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute('content', description);
  }

  // Update Twitter Image
  const twitterImage = document.querySelector('meta[property="twitter:image"]');
  if (twitterImage) {
    twitterImage.setAttribute('content', image);
  }
};

/**
 * Prepares JSON-LD Person schema markup for injection
 */
export const injectPersonSchema = (): void => {
  const schemaId = 'ld-json-person-schema';
  let scriptElement = document.getElementById(schemaId) as HTMLScriptElement | null;

  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = schemaId;
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  }

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'ADITHYAN P',
    'jobTitle': 'AI & Embedded Systems Engineer',
    'description': 'I design intelligent software and embedded systems that combine AI, automation, and reliable engineering.',
    'url': window.location.origin,
    'sameAs': [
      'https://github.com/adithyanp2005gt-dotcom',
      'https://www.linkedin.com/in/adithyan-p272005'
    ]
  };

  scriptElement.text = JSON.stringify(personSchema);
};
