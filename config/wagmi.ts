import { http, createConfig } from 'wagmi';
import { flowTestnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [flowTestnet],
  connectors: [injected()],
  transports: {
    [flowTestnet.id]: http(),
  },
});
