import { TableRow, TableCell } from "@/components/ui/compat";

const WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-1/3", "w-4/5"];

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <TableRow key={i}>
          {Array.from({ length: columns }, (_, j) => (
            <TableCell key={j}>
              <div className={`h-4 bg-default-200 rounded animate-pulse ${WIDTHS[(i + j) % WIDTHS.length]}`} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
