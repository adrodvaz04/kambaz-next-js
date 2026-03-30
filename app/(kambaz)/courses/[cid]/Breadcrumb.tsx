"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Chathura } from "next/font/google";
export default function Breadcrumb({
  courseName,
}: {
  courseName: string | undefined;
}) {
  const pathname = usePathname();
  return (
    <span>
      {courseName || 'Unnamed Course'} &gt;{" "}
      {pathname
        .split("/")
        .pop()
        ?.replace(/^./, (char) => char.toUpperCase())}
    </span>
  );
}
