import { Cross2Icon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import { DEFAULT_LOCALE, getTranslations } from "../../i18n/utils";
import { signOut } from "../../lib/auth/authClient.ts";
import { Avatar } from "../Avatar/Avatar";
import styles from "./UserPopover.module.css";

interface UserPopoverProps {
  name: string;
  image: string;
  locale?: string;
}

export const UserPopover = ({ name, image, locale }: UserPopoverProps) => {
  const t = getTranslations(locale);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={styles.iconButton} aria-label={t("header.logout")}>
          <Avatar name={name} image={image} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className={styles.popoverContent} sideOffset={5} collisionPadding={20}>
          <button
            className={styles.logoutButton}
            onClick={() =>
              signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = `/${window.__locale ?? DEFAULT_LOCALE}/login`;
                  },
                },
              })
            }
          >
            {t("header.logout")}
          </button>

          <Popover.Close className={styles.popoverClose} aria-label="Close">
            <Cross2Icon />
          </Popover.Close>
          <Popover.Arrow className={styles.popoverArrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
