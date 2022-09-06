import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { apply, tw } from "twind";

export type DialogTitleProps = {
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
} & React.PropsWithChildren;

export const DialogTitle = ({ className, as = "h2", children }: DialogTitleProps) => {
  return (
    <HeadlessDialog.Title
      as={as}
      className={tw(
        apply("text-lg font-medium leading-6 text-gray-900", className),
      )}
    >
      {children}
    </HeadlessDialog.Title>
  );
};

export type DialogProps = {
  isOpen: boolean;
  toggle: () => void;
  baseClassName?: string;
  panelClassName?: string;
} & React.PropsWithChildren;

const Dialog = ({
  isOpen,
  baseClassName,
  panelClassName,
  toggle,
  children,
}: DialogProps) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <HeadlessDialog
          as="div"
          className={tw(apply("relative z-10", baseClassName))}
          onClose={toggle}
        >
          <Transition.Child
            as={Fragment}
            enter={tw("ease-out duration-300")}
            enterFrom={tw("opacity-0")}
            enterTo={tw("opacity-100")}
            leave={tw("ease-in duration-200")}
            leaveFrom={tw("opacity-100")}
            leaveTo={tw("opacity-0")}
          >
            <div className={tw("fixed inset-0 bg-black bg-opacity-25")} />
          </Transition.Child>

          <div className={tw("fixed inset-0 overflow-y-auto")}>
            <div className={tw("flex min-h-full items-center justify-center p-4 text-center")}>
              <Transition.Child
                as={Fragment}
                enter={tw("ease-out duration-300")}
                enterFrom={tw("opacity-0 scale-95")}
                enterTo={tw("opacity-100 scale-100")}
                leave={tw("ease-in duration-200")}
                leaveFrom={tw("opacity-100 scale-100")}
                leaveTo={tw("opacity-0 scale-95")}
              >
                <HeadlessDialog.Panel
                  className={tw(
                    apply(
                      "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all",
                    ),
                    panelClassName,
                  )}
                >
                  {children}
                </HeadlessDialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </HeadlessDialog>
      </Transition>
    </>
  );
};

export default Dialog;
