import type { User } from "better-auth";

interface AvatarProps {
  user: User | null;
}

export const Avatar = ({ user }: AvatarProps) => {
  return user?.image ? <img src={user.image} alt={user.name} /> : null;
};
