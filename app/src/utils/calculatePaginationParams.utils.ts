export const calculatePaginationData = (
  totalItems: number,
  page: number,
  perPage: number,
): {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
} => {
  const totalPages: number = Math.ceil(totalItems / perPage);
  const hasPrevPage: boolean = page > 1;
  const hasNextPage: boolean = page < totalPages;

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    hasPrevPage,
    hasNextPage,
  };
};
