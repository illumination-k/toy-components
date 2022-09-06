import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import MultiCombobox from "./MultiCombobox";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Molecules/MultiCombobox",
  component: MultiCombobox,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof MultiCombobox>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MultiCombobox> = (args) => <MultiCombobox {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  options: [
    { label: "one", value: "1" },
    { label: "two", value: "2" },
    { label: "apple", value: "apple" },
  ],
  onChange: (value) => console.log(value),
};
