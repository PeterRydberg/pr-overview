import type { Slottable } from "../../types/slottable";

interface HeaderProps extends Slottable<"avatar"> {}

export const Header = ({ avatar }: HeaderProps) => {
  return (
    <header>
      <h1>Private header</h1>
      <>{avatar}</>
    </header>
  );
};
