'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar } from '@/components/atoms/avatar';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    department: '개발팀',
    position: '팀원',
    bio: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('파일 크기는 2MB 이하여야 합니다.');
        return;
      }

      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 호출하여 프로필 업데이트
    alert('프로필이 업데이트되었습니다!');
  };

  const stats = [
    { label: '완료한 업무', value: 45, color: 'bg-green-500' },
    { label: '진행중 업무', value: 8, color: 'bg-blue-500' },
    { label: '평균 완료 시간', value: '2.3일', color: 'bg-purple-500' },
    { label: '완료율', value: '85%', color: 'bg-yellow-500' },
  ];

  const recentActivities = [
    { action: '월간 보고서 작성 완료', time: '2시간 전', type: 'completed' },
    { action: 'UI 디자인 리뷰 댓글 작성', time: '5시간 전', type: 'comment' },
    { action: 'API 최적화 작업 시작', time: '1일 전', type: 'started' },
    { action: '팀 미팅 참석', time: '1일 전', type: 'meeting' },
    { action: '코드 리뷰 완료', time: '2일 전', type: 'review' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ui-text">마이페이지</h1>
        <p className="text-sm text-ui-textSecondary mt-1">
          내 프로필과 활동을 관리하세요
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="relative mb-4">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-ui-primary"
                  />
                ) : (
                  <Avatar name={user?.name || 'User'} size="xl" className="w-32 h-32 text-3xl" />
                )}
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-ui-primary text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>

              {isUploading && (
                <div className="text-sm text-ui-textSecondary mb-2">
                  업로드 중...
                </div>
              )}

              <h2 className="text-xl font-bold text-ui-text mb-1">
                {formData.name}
              </h2>
              <p className="text-sm text-ui-textSecondary mb-1">
                {formData.email}
              </p>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
                {user?.role || 'USER'}
              </span>

              <div className="w-full space-y-3">
                <div className="flex items-center gap-2 text-sm text-ui-textSecondary">
                  <span>🏢</span>
                  <span>{formData.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ui-textSecondary">
                  <span>💼</span>
                  <span>{formData.position}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-ui-textSecondary">
                  <span>📅</span>
                  <span>가입일: 2025.01.15</span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-ui-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
                프로필 사진 제거
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border mt-4">
            <h3 className="text-lg font-bold text-ui-text mb-4">나의 통계</h3>
            <div className="space-y-3">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-ui-textSecondary">{stat.label}</span>
                  <span className="text-sm font-semibold text-ui-text">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form & Activities */}
        <div className="col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
            <h3 className="text-lg font-bold text-ui-text mb-6">프로필 정보</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ui-text mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ui-text mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ui-text mb-2">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="010-1234-5678"
                    className="w-full px-4 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ui-text mb-2">
                    부서
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-primary"
                  >
                    <option>개발팀</option>
                    <option>디자인팀</option>
                    <option>마케팅팀</option>
                    <option>기획팀</option>
                    <option>운영팀</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ui-text mb-2">
                  직책
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ui-text mb-2">
                  자기소개
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="간단한 자기소개를 입력하세요..."
                  className="w-full px-4 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-primary resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-ui-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  저장하기
                </button>
                <button
                  type="button"
                  className="px-6 py-2 border border-ui-border text-ui-text rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-ui-text">최근 활동</h3>
              <button className="text-sm text-ui-primary hover:underline">
                전체보기 →
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b border-ui-border last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'completed' ? 'bg-green-500' :
                    activity.type === 'comment' ? 'bg-blue-500' :
                    activity.type === 'started' ? 'bg-yellow-500' :
                    activity.type === 'meeting' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-ui-text font-medium">
                      {activity.action}
                    </p>
                    <p className="text-xs text-ui-textSecondary mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
            <h3 className="text-lg font-bold text-ui-text mb-4">스킬 & 관심사</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'Node.js', 'PostgreSQL', 'Git', 'Figma'].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-gray-100 text-ui-text text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
              <button className="px-3 py-1.5 border-2 border-dashed border-ui-border text-ui-textSecondary text-sm rounded-full hover:border-ui-primary hover:text-ui-primary transition-colors">
                + 추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
