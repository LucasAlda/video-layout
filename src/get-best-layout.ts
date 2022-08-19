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
const getVideoWidth = (layout: Layout, aspectRatio: number) => {
  const layoutAspectRatio = getAspectRatio(layout);

  const height = 1;
  const width = 1 * aspectRatio;

  // layout is wider   =>  width is the limited direction and height has extra room
  // layout is taller  =>  height is the limited direction and width has extra room
  let videoWidth = 0;
  if (layoutAspectRatio > aspectRatio) {
    videoWidth = width / layout.cols;
  } else {
    const videoHeight = height / layout.rows;
    videoWidth = videoHeight * ASPECT_RATIO;
  }

  return videoWidth / aspectRatio;
};

// check all layouts and keep the one that gets the longest width
export const getBestLayout = (
  numOfVideos: number,
  containerAspectRatio: number
): [Layout, number] | [null, null] => {
  const viableLayouts = getViableLayouts(numOfVideos);

  let bestLayout = viableLayouts[0];
  if (!bestLayout) return [null, null];

  let biggestVideoWidth = getVideoWidth(bestLayout, containerAspectRatio);

  viableLayouts.forEach((layout) => {
    const videoWidth = getVideoWidth(layout, containerAspectRatio);

    if (videoWidth > biggestVideoWidth) {
      biggestVideoWidth = videoWidth;
      bestLayout = layout;
    }
  });

  console.log(biggestVideoWidth);

  return [bestLayout, biggestVideoWidth];
};
