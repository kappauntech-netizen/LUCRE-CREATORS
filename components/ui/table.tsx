import { cn } from '@/lib/utils';

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) { return <div className="ui-table-wrap"><table className={cn('ui-table', className)} {...props} /></div>; }
export function TableHeader(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <thead {...props} />; }
export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) { return <tbody {...props} />; }
export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) { return <tr className={cn('ui-table-row', className)} {...props} />; }
export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) { return <th className={cn('ui-table-head', className)} {...props} />; }
export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) { return <td className={cn('ui-table-cell', className)} {...props} />; }
