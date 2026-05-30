"use client";

import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSidebar } from "./UserSidebarClientWrapper";

interface UserHeaderProps {
  pageTitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function UserHeader({ pageTitle, breadcrumbs }: UserHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-white border-b sticky top-0 z-40 w-full">
      <div className="max-w-full mx-auto p-4 flex flex-col space-y-1">
        <div className="flex flex-row items-center justify-between">
          {/* Hamburger (mobile) */}
          <div className="sm:hidden inline-flex">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex sm:flex-row flex-col justify-between items-center w-full px-2">
            <div className="flex sm:flex-row flex-col justify-center items-center sm:justify-start sm:space-x-8">
              {pageTitle && (
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {pageTitle}
                </h1>
              )}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="overflow-x-auto">
                  <Breadcrumb>
                    <BreadcrumbList>
                      {breadcrumbs.map((item, i) => (
                        <React.Fragment key={item.label}>
                          <BreadcrumbItem>
                            {item.href ? (
                              <BreadcrumbLink asChild>
                                <Link href={item.href}>{item.label}</Link>
                              </BreadcrumbLink>
                            ) : (
                              <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                          </BreadcrumbItem>
                          {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                        </React.Fragment>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
