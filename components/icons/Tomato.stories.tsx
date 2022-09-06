import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import Tomato from "./Tomato";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Icons/Tomato",
  component: Tomato,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Tomato>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Tomato> = (args) => <Tomato {...args}>Tomato</Tomato>;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};
