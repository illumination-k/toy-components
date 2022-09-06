import React from "react";
import { apply, tw } from "twind";

export type ChipProps = React.ComponentProps<"div">;

export const Chip = ({ className, children, ...props }: ChipProps) => {
  return (
    <div
      className={tw(
        apply(
          "flex align-center",
          "text-gray-500 text-sm font-semibold",
          "px-4 py-2 rounded-full bg-gray-200 w-max active:bg-gray-300 transition duration-300 ease",
          className,
        ),
      )}
      {...props}
    >
      {children}
    </div>
  );
};
