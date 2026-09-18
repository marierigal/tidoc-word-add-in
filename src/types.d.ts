declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const MDXComponent: ComponentType;
  // @ts-expect-error same name
  export default MDXComponent;
}
