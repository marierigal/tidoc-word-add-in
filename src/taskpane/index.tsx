import {
  Body1,
  type BrandVariants,
  createLightTheme,
  Divider,
  FluentProvider,
  MessageBar,
  MessageBarBody,
  Text,
  type Theme,
  Title1,
  Title2,
  Title3,
  tokens,
} from '@fluentui/react-components';
import { MDXProvider } from '@mdx-js/react';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';

/* global document, Office, module, require, HTMLElement */

const rootElement: HTMLElement | null = document.getElementById('container');
const root = rootElement ? createRoot(rootElement) : undefined;

const tidocTheme: BrandVariants = {
  10: '#020403',
  20: '#101c18',
  30: '#152e28',
  40: '#193c33',
  50: '#1b4a3e',
  60: '#1d584a',
  70: '#1f6757',
  80: '#1f7663',
  90: '#1f8670',
  100: '#1e957d',
  110: '#1ca68a',
  120: '#18b698',
  130: '#55c2a8',
  140: '#7bcfb8',
  150: '#9ddbc9',
  160: '#bde6da',
};
const tidocLightTheme: Theme = {
  ...createLightTheme(tidocTheme),
};

const mdxComponents = {
  h1: (props: any) => <Title1 as="h1" block {...props} />,
  h2: (props: any) => <Title2 as="h2" block {...props} />,
  h3: (props: any) => <Title3 as="h3" block {...props} />,
  h4: (props: any) => <Text as="h4" weight="bold" size={500} block {...props} />,
  h5: (props: any) => <Text as="h5" weight="bold" size={400} block {...props} />,
  h6: (props: any) => <Text as="h6" weight="bold" size={300} block {...props} />,
  p: (props: any) => <Body1 as="p" block {...props} />,
  code: (props: any) => (
    <code
      style={{
        fontFamily: tokens.fontFamilyMonospace,
        backgroundColor: tokens.colorNeutralBackground3,
        padding: '2px 4px',
        borderRadius: tokens.borderRadiusSmall,
      }}
      {...props}
    />
  ),
  // Turns your "> **Hint**: ..." blockquotes into proper Fluent callouts
  blockquote: (props: any) => (
    <MessageBar intent="info">
      <MessageBarBody>{props.children}</MessageBarBody>
    </MessageBar>
  ),
  hr: (props: any) => <Divider {...props} />,
};

/* Render application after Office initializes */
Office.onReady(() => {
  root?.render(
    <FluentProvider theme={tidocLightTheme}>
      <MDXProvider components={mdxComponents}>
        <App />
      </MDXProvider>
    </FluentProvider>
  );
});

if ((module as any).hot) {
  (module as any).hot.accept('./components/App', () => {
    /* eslint-disable-next-line @typescript-eslint/no-require-imports */
    const NextApp = require('./components/App').default;
    root?.render(NextApp);
  });
}
