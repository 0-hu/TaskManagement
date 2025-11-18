import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { Input } from "@/components/atoms/input/input";
import { IconButton } from "@/components/atoms/icon-button/icon-button";
import { Button } from "@/components/atoms/button/button";
import { ProfileSwitcher } from "@/components/molecules/profile-switcher/profile-switcher";
import { Bell, Calendar, Filter, Plus, Search } from "lucide-react";

export function Header() {
  return (
    <Box className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
      <Box className="flex items-center gap-4">
        <Box className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
          <Filter className="h-5 w-5 text-neutral-500" />
        </Box>
        <Box>
          <Text weight="bold" className="text-lg">
            업무 개요
          </Text>
          <Text size="sm" color="subtle">
            부서/사용자 업무 현황을 확인하고 제어합니다.
          </Text>
        </Box>
      </Box>
      <Box className="flex flex-1 items-center justify-end gap-3">
        <Box className="relative w-72">
          <Box className="pointer-events-none absolute left-3 top-2.5 text-neutral-400">
            <Search className="h-4 w-4" />
          </Box>
          <Input placeholder="업무, 담당자, 태그 검색" className="pl-9" />
        </Box>
        <Button variant="ghost" className="flex items-center gap-2 bg-white">
          <Calendar className="h-4 w-4" />
          2025.11
        </Button>
        <IconButton icon={<Bell className="h-5 w-5" />} />
        <Button>
          <Plus className="h-4 w-4" />
          새 입력
        </Button>
        <ProfileSwitcher />
      </Box>
    </Box>
  );
}
