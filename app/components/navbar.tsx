"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const navbarItems = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Ideas", href: "/ideas" },
  { label: "Careers", href: "/" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastY && currentY > 30) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastY(currentY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastY]);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50
        transition-transform duration-300
        backdrop-blur bg-orange-500 shadow-sm
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="relative h-[70px] max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        <a
          href="https://suitmedia.com/"
          className="transform scale-125 origin-left"
        >
          <Image
            src={"/images/logosuitmedia.png"}
            alt="Suitmedialogo"
            width={100}
            height={100}
            className="object-contain"
          />
        </a>

        <nav className="hidden md:flex gap-8 text-sm">
          {navbarItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <a
                key={item.href}
                href={item.href}
                className={`
                  hover:text-black transition-colors
                  ${
                    isActive ? "text-white font-normal underline" : "text-white"
                  }
                `}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <button
          aria-label="Toggle Menu"
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden text-white"
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4">
          <nav className="flex flex-col gap-2">
            {navbarItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`
                    py-2 border-b text-sm
                    ${
                      isActive
                        ? "text-white font-normal underline"
                        : "text-white"
                    }
                  `}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
