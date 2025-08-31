import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { CollectionArchiveProducts } from '@/components/CollectionArchiveProducts'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24 bg-kstateLightGray dark:bg-kstateDarkPurple">
      <PageClient />
     
      <div className="container mb-16">
        {/* <div className="prose dark:prose-invert max-w-none"> */}
        <div className="prose bg-kstateLightGray dark:bg-kstateDarkPurple">
          <h1>Products</h1>
        </div>
      </div>

      <div className="container mb-8 bg-kstateLightGray dark:bg-kstateDarkPurple">
        <PageRange
          collection="products"
          currentPage={products.page}
          limit={12}
          totalDocs={products.totalDocs}
        /> <p className="text-center">Explore our range of products</p>
      </div>

      <CollectionArchiveProducts products={products.docs} />

      <div className="container bg-kstate-light-gray dark:bg-kstate-dark-purple">
        {products.totalPages > 1 && products.page && (
          <Pagination page={products.page} totalPages={products.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Website Template Products`,
  }
}
