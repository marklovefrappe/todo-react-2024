export function calculatePagination(
  page: number,
  itemsPerPage: number | undefined = 10
) {
  const limit = itemsPerPage;
  const offset = (page - 1) * itemsPerPage;

  return { limit, offset };
}
