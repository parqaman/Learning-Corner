import { Box } from '@chakra-ui/react';
import { AppHeader, AppHeaderProps } from './AppHeader';
import { Page, PageProps } from './Page';

export type BaseLayoutProps = AppHeaderProps & PageProps;

export const BaseLayout = ({ headerRightMenu, ...pageProps }: BaseLayoutProps) => {
  return (
    <Box bg={'#F0F2F5'} minHeight={'100vh'}>
      <AppHeader headerRightMenu={headerRightMenu} />
      <Page {...pageProps} />
    </Box>
  );
};
