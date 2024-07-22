"use client";

import { useRouter } from "next/navigation";
import { forwardRef, useEffect } from "react";

interface KeyboardLinkProps extends React.HTMLAttributes<HTMLSpanElement> {
  keyName: KeyboardEvent["key"];
  href: string;
}

export const KeyboardLink = forwardRef(function KeyboardLink(
  { keyName, href, ...props }: KeyboardLinkProps,
  ref: React.ForwardedRef<HTMLSpanElement>,
) {
  const router = useRouter();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === keyName) {
        router.push(href);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [keyName, router, href]);

  return <span ref={ref} {...props} />;
});
