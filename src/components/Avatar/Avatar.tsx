import { useEffect, useRef } from "react";
import styles from "./Avatar.module.css";

interface AvatarProps {
  name: string;
  image: string;
}

export const Avatar = ({ name, image }: AvatarProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleVisible = () => {
    imgRef.current?.classList.add(styles.visible);
  };

  useEffect(() => {
    if (imgRef.current?.complete) handleVisible();
  }, []);

  return (
    <div className={styles.avatarWrapper}>
      {image ? (
        <img
          ref={imgRef}
          src={`${image}&size=32`}
          alt={`${name} profile`}
          width={32}
          height={32}
          onLoad={handleVisible}
          onError={handleVisible}
        />
      ) : null}
    </div>
  );
};
