import { Button } from '@chakra-ui/button'
import { FullChainParameter } from 'src/custom-types/metamask-params';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { useAsync } from 'src/hooks/useAsync'
export default function AddToMetamaskButton({ chainParameter }: any) {

    function addToMetamask() {
        const params = {
            chainId: Web3.utils.toHex(chainParameter.chainId), // A 0x-prefixed hexadecimal string
            chainName: chainParameter.chainName,
            nativeCurrency: {
                name: chainParameter.nativeCurrency.name,
                symbol: chainParameter.nativeCurrency.symbol, // 2-6 characters long
                decimals: chainParameter.nativeCurrency.decimals,
            },
            rpcUrls: chainParameter.rpcUrls,
            blockExplorerUrls: chainParameter?.blockExplorerUrls,
        };
        return (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params],
        })
    };

    const [hasBrowserWallet, set_hasBrowserWallet] = useState(false);
    const [isLoading, set_isLoading] = useState(true);
    useEffect(() => {
        set_hasBrowserWallet(typeof (window as any).ethereum !== 'undefined')
        set_isLoading(false)
    }, []);
    const { execute, status, value, error } = useAsync(addToMetamask, false);
    console.log(value)
    if (isLoading)
        return <span>isLoading</span>
    else if (!hasBrowserWallet)
        return <span>No Browser wallet found.</span>
    else
        return (
            <button onClick={execute} disabled={status === "pending"}>
                {status !== "pending" ? "Click me" : "Loading..."}
            </button>
            // <Button onClick={() => addToMetamask(chainParameter)}>
            //     Add to Metamask
            // </Button>
        )
}