"use client";

import { useEffect, useState } from "react";
import { fetchIdeas, Idea } from "@/lib/ideas";
import Image from "next/image";
import Link from "next/link";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const SORT_MODES = [
  { label: "Newest", value: "-published_at" },
  { label: "Oldest", value: "published_at" },
];

export default function IdeasList() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("-published_at");

  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalPages = Math.ceil(totalItems / pageSize);
  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  useEffect(() => {
    const loadIdeas = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const { data, meta } = await fetchIdeas({
          page: currentPage,
          size: pageSize,
          sort: sortBy,
        });

        setIdeas(data);
        setTotalItems(meta?.total || data.length);
      } catch (err: unknown) {
        setErrorMsg("Failed to load data. Please ty again");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, [currentPage, pageSize, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const SelectDropdown = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string | number;
    onChange: (val: string) => void;
    options: { label?: string; value: string | number }[];
  }) => (
    <label className="flex items-center gap-2">
      <span>{label}</span>
      <select
        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label || opt.value}
          </option>
        ))}
      </select>
    </label>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const maxVisible = 5;
    const pages = [];

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <div className="flex justify-center gap-2 mt-8 text-sm">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded hover:bg-gray-200 disabled:opacity-40"
        >
          Prev
        </button>

        {start > 1 && (
          <>
            <button onClick={() => handlePageChange(1)}>1</button>
            {start > 2 && <span>...</span>}
          </>
        )}

        {pages.map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-3 py-2 rounded ${
              currentPage === num
                ? "bg-orange-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span>...</span>}
            <button onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded hover:bg-gray-200 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4 text-sm">
        <span className="text-gray-600">
          Show {rangeStart} - {rangeEnd} from {totalItems}
        </span>
        <div className="flex items-center gap-4">
          <SelectDropdown
            label="Per halaman:"
            value={pageSize}
            onChange={(val) => {
              setPageSize(Number(val));
              setCurrentPage(1);
            }}
            options={PAGE_SIZE_OPTIONS.map((v) => ({ value: v }))}
          />
          <SelectDropdown
            label="Urutkan:"
            value={sortBy}
            onChange={(val) => {
              setSortBy(val);
              setCurrentPage(1);
            }}
            options={SORT_MODES}
          />
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500 py-10">Lagi ambil data...</p>
      )}

      {errorMsg && <p className="text-center text-red-500 py-10">{errorMsg}</p>}

      {!loading && !errorMsg && ideas.length === 0 && (
        <p className="text-center text-gray-500 py-10">No article found.</p>
      )}

      {!loading && !errorMsg && ideas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <Link
              key={idea.id}
              href={`/ideas/${idea.slug}`}
              className="group block bg-white rounded shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={idea.medium_image?.[0]?.url ?? "/placeholder.jpg"}
                  alt={idea.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(idea.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h3 className="text-md font-medium line-clamp-3 text-gray-800">
                  {idea.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination />
    </div>
  );
}
