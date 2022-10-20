import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {MantineProvider} from "@mantine/core";

function MyApp({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient();

  return <QueryClientProvider client={queryClient}>
    <MantineProvider withGlobalStyles withNormalizeCSS
                     theme={
      {
        colorScheme: 'dark',
        components: {
          Input: {
            styles: (theme) => ({
              input: { borderColor: theme.colors.cyan[theme.fn.primaryShade()] },
            }),
          },
        },
      }
    }
    >
      <Component {...pageProps} />
    </MantineProvider>
  </QueryClientProvider>
}

export default MyApp
