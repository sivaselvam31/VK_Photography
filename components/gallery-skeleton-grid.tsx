"use client";

import Masonry from "react-masonry-css";

type Props = {
  breakpointColumns: Record<string | number, number>;
};

export function GallerySkeletonGrid({ breakpointColumns }: Props) {
  const heights = [
    "h-64",
    "h-80",
    "h-96",
    "h-72",
    "h-80",
    "h-64",
    "h-96",
    "h-72",
  ];

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex w-auto -ml-4 md:-ml-6"
      columnClassName="pl-4 md:pl-6 bg-clip-padding"
    >
      {heights.map((h, i) => (
        <div
          key={i}
          className={`mb-4 md:mb-6 rounded-xl bg-muted/60 animate-pulse ${h}`}
        />
      ))}
    </Masonry>
  );
}

