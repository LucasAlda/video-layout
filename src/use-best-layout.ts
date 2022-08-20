import { useCallback, useState } from "react";

export type Layout = {
  cols: number;
  rows: number;
};

const ASPECT_RATIO = 16 / 9;

// returns the video width relative to the container width (0 < videoWidth < 1)
const getVideoWidth = (layout: Layout, width: number, height: number) => {
  // layout is wider   =>  width is the limited direction and height has extra room
  // layout is taller  =>  height is the limited direction and width has extra room

  return Math.min(width / layout.cols, height / layout.rows * ASPECT_RATIO);
};

// gets one of the two layouts depending on passed function, one of which is guaranteed to be the optimal one
const getLayout = (
  numOfVideos: number,
  containerWidth: number,
  containerHeight: number,
  func: Math["ceil"] | Math["floor"]
) => {
  const containerAspectRatio =  containerWidth/containerHeight;
  const cols = func(
    Math.sqrt((numOfVideos * containerAspectRatio) / ASPECT_RATIO)
  );

  const rows = Math.ceil(numOfVideos / cols);

  const width = getVideoWidth({ cols, rows }, containerWidth, containerHeight);

  return { layout: { cols, rows }, maxWidth: width };
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
      if (!numOfVideos) return [null, null];

      const maxColumnsLayout = getLayout(numOfVideos, width, height, Math.ceil);
      const minColumnsLayout = getLayout(numOfVideos, width, height, Math.floor);

      let bestLayoutParams = maxColumnsLayout;
      if (maxColumnsLayout.maxWidth < minColumnsLayout.maxWidth) bestLayoutParams = minColumnsLayout;

      setLayout(bestLayoutParams.layout);
      setVideoWidth(bestLayoutParams.maxWidth);
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
