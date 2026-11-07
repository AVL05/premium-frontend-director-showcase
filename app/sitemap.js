import { SITE_URL } from './site';

// One page: the whole showcase is a single continuous take.
export default function sitemap() {
  return [{ url: SITE_URL + '/', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }];
}
