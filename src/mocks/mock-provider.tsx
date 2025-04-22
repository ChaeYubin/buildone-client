/* eslint-disable no-console */

"use client";

import { Suspense, use } from "react";

const enableMocking =
  typeof window !== "undefined"
    ? import("./browser").then(async ({ worker }) => {
        if (process.env.NEXT_PUBLIC_MOCK_ENABLED !== "true") return;

        await worker.start({
          onUnhandledRequest: "bypass",
        });
        console.log(worker.listHandlers());
      })
    : Promise.resolve();

const MockWrapper = ({ children }: React.PropsWithChildren) => {
  use(enableMocking);
  return children;
};

export const MockProvider = ({ children }: React.PropsWithChildren) => (
  <Suspense fallback={null}>
    <MockWrapper>{children}</MockWrapper>
  </Suspense>
);
