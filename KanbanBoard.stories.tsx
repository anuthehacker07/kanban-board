import React from "react";
import KanbanBoard from "./KanbanBoard";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof KanbanBoard> = {
  title: "Components/KanbanBoard",
  component: KanbanBoard,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

const glitterStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  padding: "2rem",
  background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  backgroundSize: "400% 400%",
  animation: "glitter 8s ease infinite",
};

/* Inline keyframes for background animation */
const Keyframes = () => (
  <style>{`@keyframes glitter {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }`}</style>
);

export const Default: Story = {
  render: () => (
    <div style={glitterStyle}>
      <Keyframes />
      <div style={{ width: "100%", maxWidth: 1200 }}>
        <KanbanBoard />
      </div>
    </div>
  ),
};
