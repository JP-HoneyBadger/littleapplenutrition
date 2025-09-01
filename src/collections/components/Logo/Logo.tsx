import Image from 'next/image'
import React from 'react'

export const Logo = () => {
  return (
    <Image
      alt="HoneyBadger-Designs Logo"
      className="max-w-[9.375rem] md:max-w-[300px] invert-0 dark:invert w-full"
      src="/assets/HBDLogoBlack.png"
      width={300}
      height={300}
    />
  )
}
