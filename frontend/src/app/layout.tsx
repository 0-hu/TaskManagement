import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: '업무일감 관리',
  description: '개인 및 부서 업무를 효율적으로 관리하는 시스템',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
