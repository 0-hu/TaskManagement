"use client";

import { useState, useEffect } from "react";
import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { Avatar } from "@/components/atoms/avatar/avatar";
import { MOCK_USERS, getCurrentUserId, setCurrentUserId, type User } from "@/lib/mock-data";
import { ChevronDown } from "lucide-react";

export function ProfileSwitcher() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userId = getCurrentUserId();
    const user = MOCK_USERS.find(u => u.id === userId);
    setCurrentUser(user || MOCK_USERS[0]);
  }, []);

  const handleUserSwitch = (userId: string) => {
    setCurrentUserId(userId);
    const user = MOCK_USERS.find(u => u.id === userId);
    setCurrentUser(user || MOCK_USERS[0]);
    setIsOpen(false);
    // 페이지 새로고침하여 데이터 업데이트
    window.location.reload();
  };

  if (!currentUser) return null;

  return (
    <Box className="relative">
      <Box
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white p-2 hover:bg-neutral-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar name={currentUser.name} imageUrl={currentUser.avatar} size="sm" />
        <Box className="flex-1">
          <Text weight="semibold" size="sm">{currentUser.name}</Text>
          <Text size="xs" color="subtle">{currentUser.position}</Text>
        </Box>
        <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Box>

      {isOpen && (
        <Box className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-neutral-200 bg-white shadow-lg">
          <Box className="p-2">
            <Text size="xs" color="subtle" weight="semibold" className="px-3 py-2">
              프로필 전환
            </Text>
            {MOCK_USERS.map((user) => (
              <Box
                key={user.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 hover:bg-neutral-50 ${
                  user.id === currentUser.id ? "bg-blue-50" : ""
                }`}
                onClick={() => handleUserSwitch(user.id)}
              >
                <Avatar name={user.name} imageUrl={user.avatar} size="sm" />
                <Box className="flex-1">
                  <Text weight="semibold" size="sm">{user.name}</Text>
                  <Text size="xs" color="subtle">
                    {user.department} · {user.position}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
