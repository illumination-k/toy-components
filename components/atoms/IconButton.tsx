import React from "react";
import { apply, tw } from "twind";

type Props = {
  size?: number;
  iconClassName?: string;
  children: React.ReactElement;
};

type BaseButtonProps = Omit<React.ComponentProps<"button">, "children">;

export type IconButtonProps = BaseButtonProps & Props;

/**
 * children is some of icons like heroicons
 */
const IconButton = ({ className, children, iconClassName, size = 6, ...props }: IconButtonProps) => {
  const icon = React.cloneElement(children, { className: tw(apply(`h-${size} w-${size}`, iconClassName)) });

  return (
    <button className={tw(apply("focus:outline-none", className))} {...props}>
      {icon}
    </button>
  );
};

export default IconButton;
