interface AvatarProps {
  user: import("better-auth").User | null;
}

export const Avatar = ({ user }: AvatarProps) => {
  return user?.image ? <img src={user.image} alt={user.name} /> : null;
};
