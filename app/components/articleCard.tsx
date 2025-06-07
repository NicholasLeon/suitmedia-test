import { type Idea } from "@/lib/ideas";
import Image from "next/image";
import Link from "next/link";

type ArticleCardProps = {
  idea: Idea;
};

export default function ArticleCard({ idea }: ArticleCardProps) {
  return (
    <Link href={`/ideas/${idea.slug}`} className="group block">
      <div className="aspect-[4/3] relative w-full overflow-hidden rounded-md">
        <Image
          src={idea.medium_image?.[0]?.url || ""}
          alt={idea.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>
      <h3 className="mt-2 text-lg font-semibold line-clamp-3">{idea.title}</h3>
    </Link>
  );
}
