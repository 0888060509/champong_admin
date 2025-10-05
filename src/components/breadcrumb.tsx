'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const toTitleCase = (str: string) => {
    return str
      .replace(/-/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
  };

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex">
      <ol className="flex items-center gap-2 text-sm">
        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const isLast = index === segments.length - 1;
          const title = toTitleCase(segment);

          return (
            <Fragment key={href}>
              <li>
                <Link
                  href={href}
                  className={`font-medium ${
                    isLast
                      ? 'text-foreground pointer-events-none'
                      : 'text-muted-foreground transition-colors hover:text-foreground'
                  }`}
                >
                  {title}
                </Link>
              </li>
              {!isLast && (
                <li>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
