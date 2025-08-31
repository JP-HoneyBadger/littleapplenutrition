import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { Search } from '@/search/Component'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'
import { CollectionArchiveProducts } from '@/components/CollectionArchiveProducts'
import { CardProductData } from '@/components/CardProducts'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  // Fetch POSTS (paginated so totalDocs/docs are available)
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    ...(query
      ? {
          where: {
            or: [
              { title: { like: query } },
              { 'meta.description': { like: query } },
              { 'meta.title': { like: query } },
              { slug: { like: query } },
            ],
          },
        }
      : {}),
  })

  // Fetch PRODUCTS (paginated too)
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    ...(query
      ? {
          where: {
            or: [
              { title: { like: query } },
              { 'meta.description': { like: query } },
              { 'meta.title': { like: query } },
              { slug: { like: query } },
            ],
          },
        }
      : {}),
  })

  const hasPosts = (posts?.totalDocs ?? 0) > 0
  const hasProducts = (products?.totalDocs ?? 0) > 0
  const hasAny = hasPosts || hasProducts

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>
          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {hasAny ? (
        <>
          {hasProducts && (
            <div className="container mb-16">
              <h2 className="text-2xl font-bold mb-6">Products</h2>

              <CollectionArchiveProducts products={products.docs as CardProductData[]} />
            </div>
          )}
          {hasPosts && (
            <div className="container mb-16">
              <h2 className="text-2xl font-bold mb-6">Posts</h2>

              <CollectionArchive posts={posts.docs as CardPostData[]} />
            </div>
          )}
        </>
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `HoneyBadger-Designs Website Template Search`,
  }
}
