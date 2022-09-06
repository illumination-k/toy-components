import React from "react";
import { apply, tw } from "twind";

export type CircleButtonProps = React.ComponentProps<"button">;

const CircleButton = ({ className, children, ...props }: CircleButtonProps) => {
  return (
    <button
      className={tw(
        apply(
          "font-bold font-sans rounded-full w-16 h-16 text-white bg-blue-600",
          {
            hover: "bg-blue-500",
            focus: "outline-none ring ring-blue-300",
          },
          className,
        ),
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default CircleButton;
