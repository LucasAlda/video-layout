import { useCallback, useState } from "react";

export type Layout = {
  cols: number;
  rows: number;
  limitation: "width" | "height";
  childWidth: number;
};

type Props = {
  width: number;
  height: number;
  numOfVideos: number;
};

const ASPECT_RATIO = 16 / 9;

const getAspectRatio = (cols: number, rows: number) =>
  (cols / rows) * ASPECT_RATIO;

const getBestLayout = ({ numOfVideos, width, height }: Props) => {
  const containerAspectRatio = width / height;
  let bestLayout = null;

  for (let cols = 1; cols <= numOfVideos; cols++) {
    const rows = Math.ceil(numOfVideos / cols);
    const limitation =
      getAspectRatio(cols, rows) > containerAspectRatio ? "width" : "height";
    const childWidth =
      limitation === "width" ? width / cols : (height / rows) * ASPECT_RATIO;

    const layout: Layout = { cols, rows, limitation, childWidth };

    if (bestLayout === null || childWidth > bestLayout.childWidth)
      bestLayout = layout;
  }

  return bestLayout;
};

export const useBestLayout = () => {
  const [layout, setLayout] = useState<Layout | null>(null);

  const calculateLayout = useCallback((props: Props) => {
    const bestLayout = getBestLayout(props);

    if (!bestLayout) return;
    setLayout(bestLayout);
  }, []);

  // use for big layout shifts (e.g. when the sidebar is opened)
  // don't use for small layout shifts (e.g. when the window is resized)

  return {
    calculateLayout,
    layout,
  };
};
