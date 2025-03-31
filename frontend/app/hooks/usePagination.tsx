import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Filter from "../../interfaces/FilterInterface";

export function usePagination() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Retrieves the current page number from the URL
  const queryPage = searchParams.get("page");
  const currentPage = queryPage ? parseInt(queryPage) : 1;

  // Updates URL search params without reloading the page
  function updateSearchParams(params: Filter) {
    const updatedParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value) updatedParams.set(key, value);
      else updatedParams.delete(key);
    });

    router.replace(`${pathname}?${updatedParams.toString()}`);
  }

  return { currentPage, updateSearchParams };
}
