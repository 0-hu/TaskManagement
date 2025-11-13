import { Avatar } from '@/components/atoms/avatar';

interface UserInfoProps {
  name: string;
  avatar?: string;
  role?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UserInfo({ name, avatar, role, size = 'md' }: UserInfoProps) {
  const avatarSize = size === 'sm' ? 'xs' : size === 'lg' ? 'lg' : 'sm';

  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} src={avatar} size={avatarSize} />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-ui-text">{name}</span>
        {role && (
          <span className="text-xs text-ui-textSecondary">{role}</span>
        )}
      </div>
    </div>
  );
}
