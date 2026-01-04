import React from "react";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
}