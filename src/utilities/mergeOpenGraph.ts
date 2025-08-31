import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'HoneyBadger-Designs Website Template',
  images: [
    {
      url: `${getServerSideURL()}/team.jpg`,
    },
  ],
  siteName: 'HoneyBadger-Designs Website Template',
  title: 'HoneyBadger-Designs Website Template',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
