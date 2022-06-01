interface ResizeImageOptions {
  width: number;
  height: number;
  fit?: string;
}

export const resizeImage = (url: string, { width, height, fit = 'thumb' }: ResizeImageOptions) =>
  `${url}?w=${width}&h=${height}&fit=${fit}`;
