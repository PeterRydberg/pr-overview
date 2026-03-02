import type { Slottable } from "../../types/slottable";
import styles from "./Header.module.css";

interface HeaderProps extends Slottable<"avatar" | "loginLogoutButton"> {}

export const Header = ({ avatar, loginLogoutButton }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <>{loginLogoutButton}</>
      <>{avatar}</>
    </header>
  );
};
