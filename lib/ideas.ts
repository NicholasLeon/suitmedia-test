import { getQuery } from "@/lib/utils";

export type ImageFormat = {
  id: number;
  mime: string;
  file_name: string;
  url: string;
};

export type Idea = {
  id: number;
  slug: string;
  title: string;
  content: string;
  published_at: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  small_image: ImageFormat[];
  medium_image: ImageFormat[];
};

export type FetchIdeasParams = {
  page?: number;
  size?: number;
  sort?: string;
  filters?: Record<string, string | number>;
};

type Meta = {
  total: number;
  last_page: number;
  per_page: number;
  current_page: number;
};

type ApiResponse = {
  data: Idea[];
  meta: Meta;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchIdeas({
  page = 1,
  size = 10,
  sort = "-published_at",
  filters = {},
}: FetchIdeasParams = {}): Promise<{ data: Idea[]; meta: Meta | null }> {
  try {
    const query = getQuery({
      "page[number]": page,
      "page[size]": size,
      sort,
      ...filters,
      "append[]": ["small_image", "medium_image"],
    });

    const response = await fetch(`${BASE_URL}?${query}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("API responded error:", response.statusText);
      return { data: [], meta: null };
    }

    const json: ApiResponse = await response.json();
    return {
      data: json.data,
      meta: json.meta || null,
    };
  } catch (err) {
    console.error("Fetching Error:", err);
    return { data: [], meta: null };
  }
}
