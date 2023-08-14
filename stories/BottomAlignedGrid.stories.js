import "./bottom-aligned-grid.css";
import template from "./BottomAlignedGrid.hbs";
import TestData from "./TestData.json";
import { SearchComponent } from "./SearchComponent";
// More on how to set up stories at: https://storybook.js.org/docs/html/writing-stories/introduction
export default {
  title: 'Example/BottomAlignedGrid',
  tags: ['autodocs'],
  render: ({ label }) => {
    const items = TestData.response.resultPacket.results;
    return template({ items: items, page: 1, ssr: true });
  },
  argTypes: {},
};

export const Example = {
    args: {},
  };


