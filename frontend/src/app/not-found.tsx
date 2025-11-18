import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box className="flex min-h-screen items-center justify-center">
      <Box className="text-center">
        <Text weight="bold" className="mb-4 text-6xl">
          404
        </Text>
        <Text weight="bold" className="mb-2 text-2xl">
          페이지를 찾을 수 없습니다
        </Text>
        <Text color="subtle" className="mb-6">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </Text>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          홈으로 돌아가기
        </Link>
      </Box>
    </Box>
  );
}
