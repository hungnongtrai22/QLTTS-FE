// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const aValue = a[orderBy];
  const bValue = b[orderBy];

  // Nếu là kiểu ngày ISO string → convert sang timestamp để so sánh
  const aTime =
    typeof aValue === 'string' && Date.parse(aValue) ? new Date(aValue).getTime() : aValue;
  const bTime =
    typeof bValue === 'string' && Date.parse(bValue) ? new Date(bValue).getTime() : bValue;

  if (bTime < aTime) return -1;
  if (bTime > aTime) return 1;
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
