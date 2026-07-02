// Ambient module declarations for chart libraries without bundled types.

declare module 'react-simple-maps' {
  import type { ComponentType, ReactNode } from 'react';

  export const ComposableMap: ComponentType<Record<string, unknown>>;
  export const Geographies: ComponentType<{
    geography: string;
    children: (args: {
      geographies: Array<{ rsmKey: string; [key: string]: unknown }>;
    }) => ReactNode;
  }>;
  export const Geography: ComponentType<Record<string, unknown>>;
  export const Marker: ComponentType<Record<string, unknown>>;
  export const ZoomableGroup: ComponentType<Record<string, unknown>>;
}

declare module 'react-d3-cloud' {
  import type { ComponentType } from 'react';

  const WordCloud: ComponentType<Record<string, unknown>>;
  export default WordCloud;
}
