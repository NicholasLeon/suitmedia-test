import Image from "next/image";

type BannerProps = {
  title: string;
  imageUrl: string;
};

export default function Banner({ title, imageUrl }: BannerProps) {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold text-center px-4">
          {title}
        </h1>
      </div>
    </div>
  );
}
