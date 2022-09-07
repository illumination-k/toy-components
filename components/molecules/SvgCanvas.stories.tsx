import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Layer, Rect } from "react-konva";

import SvgCanvas from "./SvgCanvas";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Molecules/SvgCanvas",
  component: SvgCanvas,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof SvgCanvas>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SvgCanvas> = (args) => <SvgCanvas {...args}></SvgCanvas>;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};
