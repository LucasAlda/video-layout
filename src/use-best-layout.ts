import { useCallback, useState } from "react";

export type Layout = {
  cols: number;
  rows: number;
};

const ASPECT_RATIO = 16 / 9;

// layouts from one column to "numOfVideos" columns with their needed rows
const getViableLayouts = (numOfVideos: number): Layout[] => {
  return Array(numOfVideos)
    .fill(null)
    .map((_, i) => {
      return { cols: i + 1, rows: Math.ceil(numOfVideos / (i + 1)) };
    });
};

const getAspectRatio = (layout: Layout) =>
  (layout.cols / layout.rows) * ASPECT_RATIO;

// returns the video width relative to the container width (0 < videoWidth < 1)
const getVideoWidth = (layout: Layout, width: number, height: number) => {
  const layoutAspectRatio = getAspectRatio(layout);

  const containerAspectRatio = width / height;

  // layout is wider   =>  width is the limited direction and height has extra room
  // layout is taller  =>  height is the limited direction and width has extra room
  let videoWidth = 0;
  if (layoutAspectRatio > containerAspectRatio) {
    videoWidth = width / layout.cols;
  } else {
    const videoHeight = height / layout.rows;
    videoWidth = videoHeight * ASPECT_RATIO;
  }

  return videoWidth;
};

type Props = {
  width: number;
  height: number;
  numOfVideos: number;
};

export const useBestLayout = () => {
  const [layout, setLayout] = useState<Layout | null>(null);
  const [videoWidth, setVideoWidth] = useState<number | null>(null);
  const [isLayoutValid, setLayoutValidity] = useState(false);

  const calculateLayout = useCallback(
    ({ numOfVideos, width, height }: Props) => {
      const viableLayouts = getViableLayouts(numOfVideos);

      let bestLayout = viableLayouts[0];
      if (!bestLayout) return [null, null];

      let biggestVideoWidth = getVideoWidth(bestLayout, width, height);

      viableLayouts.forEach((layout) => {
        const videoWidth = getVideoWidth(layout, width, height);

        if (videoWidth > biggestVideoWidth) {
          biggestVideoWidth = videoWidth;
          bestLayout = layout;
        }
      });

      setLayout(bestLayout);
      setVideoWidth(biggestVideoWidth);
      setLayoutValidity(true);
    },
    []
  );

  // use for big layout shifts (e.g. when the sidebar is opened)
  // don't use for small layout shifts (e.g. when the window is resized)
  const invalidate = () => setLayoutValidity(false);

  return {
    isLayoutValid,
    invalidate,
    calculateLayout,
    layout,
    videoWidth,
  };
};
