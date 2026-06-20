// GitHub Pages の basePath を考慮して、画像など静的アセットのパスを補正する。
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const withBasePath = (path: string): string => {
  if (/^https?:\/\//.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
};

export const BASE_PATH_VALUE = BASE_PATH;
