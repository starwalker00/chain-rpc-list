//@ts-nochec
import { FullChainParameter, AddEthereumChainParameter } from "src/custom-types/metamask-params";
import Web3 from "web3";

export const namedConsoleLog = (variableName: string, variableValue: any) => {
    console.log(`${variableName}:::::`);
    console.log(variableValue);
};

export const truncateEthAddress = (address: string) => {
    const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

export const unflattenObject = (data: any) => {
    let result = {};
    for (let i in data) {
        let keys = i.split(".");
        keys.reduce((acc: any, value, index) => {
            return (
                acc[value] ||
                (acc[value] = isNaN(Number(keys[index + 1]))
                    ? keys.length - 1 === index
                        ? data[i]
                        : {}
                    : [])
            );
        }, result);
    }
    return result;
};

export const addToMetamask = (fullChainParameter: FullChainParameter) => {
    // if (!(account && account.address)) {
    //     stores.dispatcher.dispatch({ type: TRY_CONNECT_WALLET });
    //     return;
    // }

    // const params = {
    //     chainId: toHex(networkData.chainID), // A 0x-prefixed hexadecimal string
    //     chainName: networkData.networkName,
    //     nativeCurrency: {
    //         name: chain.nativeCurrency.name,
    //         symbol: chain.nativeCurrency.symbol, // 2-6 characters long
    //         decimals: chain.nativeCurrency.decimals,
    //     },
    //     rpcUrls: rpc ? [rpc] : chain.rpc,
    //     blockExplorerUrls: [
    //         chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url ? chain.explorers[0].url : chain.infoURL,
    //     ],
    // };
    console.log(fullChainParameter);
    let fullChainParameter_unflat = unflattenObject(fullChainParameter);
    const params = {
        chainId: Web3.utils.toHex(fullChainParameter.chainId), // A 0x-prefixed hexadecimal string
        chainName: fullChainParameter.chainName,
        nativeCurrency: {
            name: fullChainParameter.nativeCurrency.name,
            symbol: fullChainParameter.nativeCurrency.symbol, // 2-6 characters long
            decimals: fullChainParameter.nativeCurrency.decimals,
        },
        rpcUrls: fullChainParameter.rpcUrls,
        blockExplorerUrls: fullChainParameter?.blockExplorerUrls,
    };
    console.log(params);

    let hasBrowserWallet = typeof (window as any).ethereum !== 'undefined'
    console.log(hasBrowserWallet);

    if (hasBrowserWallet) {
        (window as any).ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params],
        })
            .then((result: any) => {
                console.log("added");
                console.log(result);
            })
            .catch((error: any) => {
                console.log("error");
                console.log(error);
            });
    } else {
        console.log("No Browser wallet found.")
    }

};