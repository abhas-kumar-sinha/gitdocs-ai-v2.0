import Image from "next/image"

const BgMain = ( { bgNumber } : { bgNumber: number } ) => {
  return (
    <div
    className="absolute top-40 inset-0 -z-10 blur-3xl"
    >
    <Image
        alt=""
        width={1000}
        height={1000}
        src={bgNumber === 1 ? "/1.jpg" : bgNumber === 2 ? "/2.jpg" : "/3.jpg"}
        className="absolute h-screen w-screen md:w-[calc(100vw-8rem)] -translate-x-1/2 left-1/2 opacity-90 mix-blend-screen"
    />
    </div>
  )
}
export default BgMain