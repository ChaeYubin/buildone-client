import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from "@tanstack/react-query";

import { handleMutationError } from "@/utils/handle-mutation-error";

let browserQueryClient: QueryClient | undefined;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        shouldRedactErrors: () => false,
      },
      mutations: {
        retry: 1,
        onError: handleMutationError,
      },
    },
  });
}

// 단일 queryClient
export default function getQueryClient() {
  if (isServer) {
    // 서버에서는 매번 새로 QueryClient를 생성하여 반환 (캐싱 X)
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
