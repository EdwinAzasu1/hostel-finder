import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

interface SearchFiltersProps {
  onSearch?: (query: string) => void;
  onPriceRangeChange?: (min: string, max: string) => void;
}

export default function SearchFilters({ onSearch, onPriceRangeChange }: SearchFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search hostels..."
          className="pl-10"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Price (GH₵)</Label>
          <Input
            type="number"
            placeholder="0"
            onChange={(e) => onPriceRangeChange?.(e.target.value, '')}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Price (GH₵)</Label>
          <Input
            type="number"
            placeholder="10000"
            onChange={(e) => onPriceRangeChange?.('', e.target.value)}
          />
        </div>
      </div>
      
      <Button variant="outline" className="w-full">
        <SlidersHorizontal className="mr-2" />
        More Filters
      </Button>
    </div>
  );
}