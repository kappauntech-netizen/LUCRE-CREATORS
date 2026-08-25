import { Search } from 'lucide-react';
import { Input } from './input';

export function SearchField(props: React.ComponentProps<typeof Input>) {
  return <label className="ui-search-field"><Search size={16} /><Input type="search" {...props} /></label>;
}
