import Image from 'next/image'

export default function LogoLogin() {
  return (
    <div className="w-full h-full px-4">
      <Image
        alt="HoneyBadger-Designs Logo"
        // className="max-w-[9.375rem] invert dark:invert-0 "
        src="/assets/HBDLogoWhiteOutline.png"
        width={1000}
        height={1000}
      />
    </div>
  )
}
