// from https://docs.metamask.io/guide/rpc-api.html#wallet-addethereumchain
export interface AddEthereumChainParameter {
    chainId: string; // A 0x-prefixed hexadecimal string
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string; // 2-6 characters long
        decimals: 18;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    // iconUrls?: string[]; // Currently ignored.
}

export interface FullChainParameter extends AddEthereumChainParameter {
    sourceUrl: string;
    isTestnet: number;
}