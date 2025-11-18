"use client";

import { useEffect } from "react";
import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { Button } from "@/components/atoms/button/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box className="flex min-h-screen items-center justify-center">
      <Box className="text-center">
        <Text weight="bold" className="mb-4 text-2xl">
          문제가 발생했습니다
        </Text>
        <Text color="subtle" className="mb-6">
          {error.message || "알 수 없는 오류가 발생했습니다."}
        </Text>
        <Button onClick={reset}>다시 시도</Button>
      </Box>
    </Box>
  );
}
