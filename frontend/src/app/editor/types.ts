export type LayoutType = 'layout_hero' | 'layout_two' | 'layout_three' | 'layout_four' | 'layout_caption' | 'layout_tilted' | 'layout_collage';

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right';
  color: string;
  fontWeight?: string;
  fontStyle?: string;
}

export interface ImageBlock {
  id: string;
  src: string;
  caption?: string;
  textStyle?: TextStyle;
  filter?: string;
  brightness?: number;
  contrast?: number;
  rotation?: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Page {
  id: string;
  layout: LayoutType;
  images: (ImageBlock | null)[];
  background?: string;
}

export interface Scrapbook {
  title: string;
  theme: string;
  pages: Page[];
}

export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  textAlign: 'center',
  color: '#333333',
};
