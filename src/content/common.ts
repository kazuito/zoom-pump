export function getScreenSize() {
  return {
    w: window.innerWidth,
    h: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
  };
}
