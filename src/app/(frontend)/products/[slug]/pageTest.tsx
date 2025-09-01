import type { Metadata } from 'next'

import { RelatedProducts } from '@/blocks/RelatedProducts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Product } from '@/payload-types'

import { ProductHero } from '@/heros/ProductHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = products.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Product({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/products/' + slug
  const product = await queryProductBySlug({ slug })

  if (!product) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16 bg-kstateLightPurple flex flex-col items-center justify-center h-full w-full mx-auto">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* <ProductHero product={product} /> */}

      <div className="flex h-full w-full flex-col md:flex-row justify-center items-center gap-4 pt-8 gap-x-12 bg-kstateLightGray px-4">
        <p className="text-4xl text-teal-300">Where is this?</p>

        {/* This is the Product */}
        <div>
          <RichText className="max-w-[48rem] mx-auto" data={product.content} enableGutter={false} />
        </div>
      </div>




      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <RelatedProducts
          className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr] px-4"
          docs={product.relatedProducts.filter((product) => typeof product === 'object')}
        />
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug })

  return generateMeta({ doc: product })
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
