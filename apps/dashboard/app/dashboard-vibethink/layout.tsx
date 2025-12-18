import React from "react";

export default function DashboardVibeThinkLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="@container/main p-4 xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto">
      {children}
    </div>
  );
}

