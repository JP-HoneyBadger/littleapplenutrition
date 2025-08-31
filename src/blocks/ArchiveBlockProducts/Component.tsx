import type { Product, ArchiveBlockProducts as ArchiveBlockProductsProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchiveProducts } from '@/components/CollectionArchiveProducts'

export const ArchiveBlockProducts: React.FC<
  ArchiveBlockProductsProps & {
    id?: string
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let products: Product[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedProducts = await payload.find({
      collection: 'products',
      depth: 1,
      limit,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    products = fetchedProducts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedProducts = selectedDocs.map((products) => {
        if (typeof products.value === 'object') return products.value
      }) as Product[]

      products = filteredSelectedProducts
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchiveProducts products={products} />
    </div>
  )
}
