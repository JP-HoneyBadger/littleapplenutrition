import Image from 'next/image'
import React from 'react'

export const Logo2 = () => {
  return (
    <Image
      alt="HoneyBadger-Designs Logo"
      className="max-w-[9.375rem] md:max-w-[200px] invert-0 dark:invert w-full"
      src="/assets/HBDLogoBlack.png"
      width={300}
      height={300}
    />
  )
}
