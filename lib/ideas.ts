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

    let apiUrl = `${BASE_URL}?${query}`;
    let response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (
      !response.ok ||
      !response.headers.get("content-type")?.includes("json")
    ) {
      apiUrl = `/api/proxy-ideas?${query}`;
      response = await fetch(apiUrl, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });
    }

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return {
      data: data.data || [],
      meta: data.meta || null,
    };
  } catch (err) {
    console.error("Fetch Error:", err);
    return { data: [], meta: null };
  }
}
