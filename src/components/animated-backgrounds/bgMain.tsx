import Image from "next/image"

const BgMain = ( { bgNumber } : { bgNumber: number } ) => {
  return (
    <div
    className="absolute top-45 inset-0 -z-10 blur-3xl"
    >
    <Image
        alt=""
        width={1000}
        height={1000}
        src={bgNumber === 1 ? "/1.jpg" : bgNumber === 2 ? "/2.jpg" : "/3.jpg"}
        className="absolute h-screen w-screen md:w-[calc(100vw-8rem)] -translate-x-1/2 left-1/2 opacity-80 mix-blend-screen"
    />
     <div className="absolute inset-0 bg-white/20 dark:bg-black/20" />
    </div>
  )
}
export default BgMain