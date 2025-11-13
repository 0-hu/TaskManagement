'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar } from '@/components/atoms/avatar';
import { User, Settings as SettingsIcon, Bell, Users, LucideIcon } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  interface Tab {
    id: string;
    label: string;
    icon: LucideIcon;
  }

  const tabs: Tab[] = [
    { id: 'profile', label: '프로필 설정', icon: User },
    { id: 'account', label: '계정 설정', icon: SettingsIcon },
    { id: 'notifications', label: '알림 설정', icon: Bell },
    { id: 'department', label: '부서 관리', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ui-text">설정</h1>
        <p className="text-sm text-ui-textSecondary mt-1">
          계정 및 시스템 설정을 관리하세요
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow-card border border-ui-border overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-ui-primary text-white'
                      : 'text-ui-text hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-ui-text">프로필 설정</h2>

                <div className="flex items-center gap-6">
                  <Avatar name={user?.name || 'User'} size="xl" />
                  <div>
                    <button className="px-4 py-2 text-sm bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all mb-2 font-medium">
                      사진 변경
                    </button>
                    <p className="text-xs text-ui-textSecondary">
                      JPG, PNG 파일 (최대 2MB)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ui-text mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ui-text mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ui-text mb-2">
                      전화번호
                    </label>
                    <input
                      type="tel"
                      placeholder="010-1234-5678"
                      className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ui-text mb-2">
                      부서
                    </label>
                    <select className="w-full px-4 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-primary">
                      <option>개발팀</option>
                      <option>디자인팀</option>
                      <option>마케팅팀</option>
                      <option>기획팀</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button className="px-6 py-2 bg-ui-primary text-white rounded-lg hover:bg-blue-700">
                      저장
                    </button>
                    <button className="px-6 py-2 border border-ui-border text-ui-text rounded-lg hover:bg-gray-50">
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-ui-text">계정 설정</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ui-text mb-2">
                      현재 비밀번호
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ui-text mb-2">
                      새 비밀번호
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ui-text mb-2">
                      비밀번호 확인
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary transition-all"
                    />
                  </div>

                  <button className="px-6 py-2 bg-ui-primary text-white rounded-lg hover:bg-blue-700">
                    비밀번호 변경
                  </button>
                </div>

                <hr className="my-6" />

                <div>
                  <h3 className="text-base font-semibold text-ui-text mb-4">계정 삭제</h3>
                  <p className="text-sm text-ui-textSecondary mb-4">
                    계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
                  </p>
                  <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    계정 삭제
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-ui-text">알림 설정</h2>

                <div className="space-y-4">
                  {[
                    { label: '업무 할당 알림', desc: '새로운 업무가 할당되면 알림을 받습니다' },
                    { label: '마감일 알림', desc: '업무 마감일 1일 전에 알림을 받습니다' },
                    { label: '댓글 알림', desc: '내 업무에 댓글이 달리면 알림을 받습니다' },
                    { label: '제출 요청 알림', desc: '업무 제출 요청이 오면 알림을 받습니다' },
                    { label: '승인/반려 알림', desc: '제출한 업무가 승인/반려되면 알림을 받습니다' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-ui-border last:border-0">
                      <div>
                        <div className="text-sm font-medium text-ui-text">{item.label}</div>
                        <div className="text-xs text-ui-textSecondary mt-1">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <button className="px-6 py-2 bg-ui-primary text-white rounded-lg hover:bg-blue-700">
                  저장
                </button>
              </div>
            )}

            {activeTab === 'department' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-ui-text">부서 관리</h2>
                  <button className="px-4 py-2 text-sm bg-ui-primary text-white rounded-lg hover:bg-blue-700">
                    + 부서 추가
                  </button>
                </div>

                <div className="space-y-3">
                  {['개발팀', '디자인팀', '마케팅팀', '기획팀', '운영팀'].map((dept, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-ui-border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-ui-primary rounded-lg flex items-center justify-center text-white font-semibold">
                          {dept.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-ui-text">{dept}</div>
                          <div className="text-xs text-ui-textSecondary">
                            {Math.floor(Math.random() * 15) + 5}명의 멤버
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm text-ui-primary hover:bg-blue-50 rounded">
                          편집
                        </button>
                        <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
