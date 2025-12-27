import Image from "next/image"

const BgMain = () => {
  return (
    <div
    className="absolute top-50 inset-0 -z-10 blur-3xl"
    >
    <Image
        alt=""
        width={1000}
        height={1000}
        src="/1.jpg"
        className="absolute h-screen w-screen md:w-[calc(100vw-8rem)] -translate-x-1/2 left-1/2 duration-200 ease-linear"
    />
    </div>
  )
}
export default BgMain