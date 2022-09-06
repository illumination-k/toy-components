import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import { tw } from "twind";
import Dialog, { DialogTitle } from "./Dialog";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Molecules/Dialog",
  component: Dialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Dialog>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Dialog> = (args) => {
  const [isOpen, setOpen] = React.useState(true);

  const toggle = () => setOpen(!isOpen);

  return (
    <>
      <div className={tw("fixed inset-0 flex items-center justify-center")}>
        <button
          onClick={toggle}
          className={tw(
            "rounded-md bg-blue-500 bg-opacity-20 px-4 py-2 text-sm font-medium text-black hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
          )}
        >
          Open HeadlessDialog
        </button>
        <Dialog {...args} isOpen={isOpen} toggle={toggle}>
          <>
            <DialogTitle
              as="h3"
              className={tw("text-lg font-medium leading-6 text-gray-900")}
            >
              Payment successful
            </DialogTitle>
            <div className={tw("mt-2")}>
              <p className={tw("text-sm text-gray-500")}>
                Your payment has been successfully submitted. We’ve sent you an email with all of the details of your
                order.
              </p>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className={tw(
                  "inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                )}
                onClick={toggle}
              >
                Got it, thanks!
              </button>
            </div>
          </>
        </Dialog>
      </div>
    </>
  );
};

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};
