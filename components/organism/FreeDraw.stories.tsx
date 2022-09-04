import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";

import FreeDraw from "./FreeDraw";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Organisms/FreeDraw",
  component: FreeDraw,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof FreeDraw>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof FreeDraw> = (args) => <FreeDraw {...args}>Circle</FreeDraw>;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};
