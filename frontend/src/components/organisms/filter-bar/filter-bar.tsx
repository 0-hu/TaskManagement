import { Box } from "@/components/atoms/box/box";
import { FilterChip } from "@/components/molecules/filter-chip/filter-chip";
import { Button } from "@/components/atoms/button/button";

type FilterBarProps = {
  activeCategory?: string;
};

const CATEGORIES = ["전체", "개인 업무", "부서 업무", "내 업무"];
const PERIODS = ["1주", "2주", "1개월", "3개월", "6개월"];

export function FilterBar({ activeCategory = "전체" }: FilterBarProps) {
  return (
    <Box className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3">
      <Box className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((category) => (
          <FilterChip key={category} label={category} active={activeCategory === category} />
        ))}
        <FilterChip label="우선순위" />
        <FilterChip label="기간 2025.10 - 2025.11" />
        <FilterChip label="태그" />
      </Box>
      <Box className="flex items-center gap-2">
        {PERIODS.map((period) => (
          <FilterChip key={period} label={period} active={period === "1개월"} />
        ))}
        <Button variant="solid" size="md">
          적용
        </Button>
      </Box>
    </Box>
  );
}
