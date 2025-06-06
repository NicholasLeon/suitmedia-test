import { getQuery } from "@/lib/utils";

const BASE_URL = "/api/ideas";

export type Idea = {
  id: number;
  title: string;
  slug: string;
  content: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  image: {
    url: string;
    alt?: string;
  };
};

export type FetchIdeasParams = {
  page?: number;
  size?: number;
  sort?: string;
  filters?: Record<string, string | number>;
};

export async function fetchIdeas({
  page = 1,
  size = 10,
  sort = "-published_at",
  filters = {},
}: FetchIdeasParams = {}): Promise<Idea[]> {
  try {
    const query = getQuery({
      page,
      size,
      sort,
      ...filters,
      "append[]": ["small_image", "medium_image"],
    });

    const response = await fetch(`${BASE_URL}?${query}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("API responded error:", response.statusText);
      return [];
    }

    const json = await response.json();
    return json.data;
  } catch (err) {
    console.error("Fetching Error:", err);
    return [];
  }
}
