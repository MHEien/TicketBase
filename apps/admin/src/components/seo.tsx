import { HeadContent } from '@tanstack/react-router';
import * as React from 'react';

type SEOProps = {
  title?: string;
  description?: string;
};

export const SEO = (props: SEOProps) => {
  const title = props.title ? `${props.title} | Reka.js` : `Reka.js`;

  return (
    <HeadContent>
      <title>{title}</title>
      <meta name="og:title" content={title} />
      {props.description && (
        <React.Fragment>
          <meta name="og:description" content={props.description} />
          <meta name="description" content={props.description} />
        </React.Fragment>
      )}
    </HeadContent>
  );
};