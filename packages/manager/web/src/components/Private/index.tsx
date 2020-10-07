import Head from 'next/head';
import React from 'react';

const Private: React.FC = () => (
  <Head>
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if (document.cookie && document.cookie.includes('access_token')) {
            window.location.href = "/app"
          } else {
            window.location.href = "/login"
          }
        `,
      }}
    />
  </Head>
);

export default Private;
