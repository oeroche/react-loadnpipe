import React from 'react';
const { default: whyDidYouRender } = await import('@welldone-software/why-did-you-render');

if (import.meta.env.MODE === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any
  whyDidYouRender(React as any, {
    trackAllPureComponents: true,
    trackHooks: true,
  });
}