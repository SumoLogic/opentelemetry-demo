// Copyright The OpenTelemetry Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Script from 'next/script'; // eslint-disable-line no-unused-vars

const { ENV_PLATFORM, WEB_OTEL_SERVICE_NAME, PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT, 
  PUBLIC_SUMO_LOGIC_RUM_SERVICE_NAME, PUBLIC_SUMO_LOGIC_RUM_URL, PUBLIC_SUMO_LOGIC_RUM_APPLICATION_NAME, 
  PUBLIC_SUMO_LOGIC_RUM_RESOURCE_ATTRIBUTES, SUMO_LOGIC_RUM_ENABLED } = process.env;

const envString = `
window.ENV = {
  NEXT_PUBLIC_PLATFORM: '${ENV_PLATFORM}',
  NEXT_PUBLIC_OTEL_SERVICE_NAME: '${WEB_OTEL_SERVICE_NAME}',
  NEXT_PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: '${PUBLIC_OTEL_EXPORTER_OTLP_TRACES_ENDPOINT}',
  NEXT_PUBLIC_SUMO_LOGIC_RUM_SERVICE_NAME: '${PUBLIC_SUMO_LOGIC_RUM_SERVICE_NAME}',
  NEXT_PUBLIC_SUMO_LOGIC_RUM_URL: '${PUBLIC_SUMO_LOGIC_RUM_URL}',
  NEXT_PUBLIC_SUMO_LOGIC_RUM_APPLICATION_NAME: '${PUBLIC_SUMO_LOGIC_RUM_APPLICATION_NAME}',
  NEXT_PUBLIC_SUMO_LOGIC_RUM_RESOURCE_ATTRIBUTES: '${PUBLIC_SUMO_LOGIC_RUM_RESOURCE_ATTRIBUTES}',
  NEXT_SUMO_LOGIC_RUM_ENABLED: '${SUMO_LOGIC_RUM_ENABLED}'
};
`;

export default class MyDocument extends Document<{ envString: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [initialProps.styles, sheet.getStyleElement()],
        envString,
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    if (SUMO_LOGIC_RUM_ENABLED === 'true') {
      return (
        <Html>
          <Head>
            <Script
                src="https://rum.sumologic.com/sumologic-rum.js"
                strategy="beforeInteractive"
                id="get-rum-script"
                type="text/javascript"
            />
            <Script
              id="initialize-rum-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                window.sumoLogicOpenTelemetryRum &&
                window.sumoLogicOpenTelemetryRum.initialize({
                  collectionSourceUrl: "${PUBLIC_SUMO_LOGIC_RUM_URL}",
                  serviceName: "${PUBLIC_SUMO_LOGIC_RUM_SERVICE_NAME}",
                  applicationName: "${PUBLIC_SUMO_LOGIC_RUM_APPLICATION_NAME}",
                  samplingProbability: 1,
                  maxExportBatchSize: 100,
                  bufferTimeout: 4000,
                  defaultAttributes: ${PUBLIC_SUMO_LOGIC_RUM_RESOURCE_ATTRIBUTES},
                  collectErrors: true,
                  dropSingleUserInteractionTraces: false
                });
                `,
              }}
            />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link
              href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
              rel="stylesheet"
            />
            <title>OTel demo</title>
          </Head>
          <body>
            <Main />
            <script dangerouslySetInnerHTML={{ __html: this.props.envString }}></script>
            <NextScript />
          </body>
        </Html>
      );
    } else {
      return (
        <Html>
          <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link
              href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
              rel="stylesheet"
            />
            <title>OTel demo</title>
          </Head>
          <body>
            <Main />
            <script dangerouslySetInnerHTML={{ __html: this.props.envString }}></script>
            <NextScript />
          </body>
        </Html>
      );
    }
  }
}
