'use client';

import { useParams as useNextParams, useRouter } from 'next/navigation';

export function useNavigate() {
  const router = useRouter();

  return (href: string) => {
    router.push(href);
  };
}

export function useParams<T extends Record<string, string> = Record<string, string>>() {
  const params = useNextParams();

  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  ) as T;
}
