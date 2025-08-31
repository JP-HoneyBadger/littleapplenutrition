'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { CometCard } from '../ui/comet-card'
import { SparklesText } from '@/app/_components/SparklesText'

export type CardProductData = Pick<Product, 'slug' | 'categories' | 'meta' | 'title'>

export const CardProducts: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardProductData
  relationTo?: 'products'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <CometCard>
      <article
        className={cn(
          'h-full flex flex-col border-2 border-border border-kstateDarkGray rounded-lg overflow-hidden bg-card hover:cursor-pointer shadow-sm hover:border-4 hover:shadow-2xl transition-shadow',
          className,
        )}
        ref={card.ref}
      >
        <div className="relative w-full aspect-[3/4]">
          {!metaImage && <div className="">No image</div>}
          {metaImage && typeof metaImage !== 'string' && <Media resource={metaImage} size="33vw" />}
        </div>
        <div className="p-4">
          {showCategories && hasCategories && (
            <div className="uppercase text-sm mb-4">
              {showCategories && hasCategories && (
                <div>
                  {categories?.map((category, index) => {
                    if (typeof category === 'object') {
                      const { title: titleFromCategory } = category

                      const categoryTitle = titleFromCategory || 'Untitled category'

                      const isLast = index === categories.length - 1

                      return (
                        <Fragment key={index}>
                          {categoryTitle}
                          {!isLast && <Fragment>, &nbsp;</Fragment>}
                        </Fragment>
                      )
                    }

                    return null
                  })}
                </div>
              )}
            </div>
          )}
          {titleToUse && (
            <div className="prose">
              <h3>
                <Link className="not-prose" href={href} ref={link.ref}>
                  <SparklesText>{titleToUse}</SparklesText>
                </Link>
              </h3>
            </div>
          )}
          {description && (
            <div className="mt-2 h-[100px]">{description && <p>{sanitizedDescription}</p>}</div>
          )}
        </div>
      </article>
    </CometCard>
  )
}
