import { Button } from '@chakra-ui/button'
import { FullChainParameter } from 'src/custom-types/metamask-params';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { useAsync } from "react-async";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text
} from '@chakra-ui/react'
import { Skeleton } from '@chakra-ui/skeleton';
import { useDisclosure } from '@chakra-ui/hooks';
interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}

export default function AddToMetamaskButton({ chainParameter }: any) {

    async function addToMetamask() {
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
    // An async function for testing our hook.
    // Will be successful 50% of the time.
    const myFunction = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const rnd = Math.random() * 10;
                rnd <= 5
                    ? resolve("Submitted successfully 🙌")
                    : reject("Oh no there was an error 😞");
            }, 2000);
        });
    };
    const [hasBrowserWallet, set_hasBrowserWallet] = useState(false);
    const [isLoading, set_isLoading] = useState(true);
    useEffect(() => {
        set_hasBrowserWallet(typeof (window as any).ethereum !== 'undefined')
        set_isLoading(false)
    }, []);
    // const { execute, status, value, error } = useAsync<null, ProviderRpcError>(addToMetamask, false);
    const { data, status, error, run } = useAsync({ deferFn: myFunction });
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
    console.log(status)
    const handleSubmit = (event: any) => {
        event.preventDefault()
        run()
    }
    if (isLoading)
        return <Skeleton>isLoading isLoading</Skeleton>
    else if (!hasBrowserWallet)
        return <Text>No Browser wallet found.</Text>
    else if (status === "pending" || status === "fulfilled" || status === "rejected") {
        console.log("modal")
        console.log(isOpen)
        const isClosable = status === "fulfilled" || status === "rejected";
        return (
            <Modal isCentered isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent>
                    {isClosable && <ModalCloseButton />}
                    <ModalBody pb={6}>
                        {status === "pending" && <Text>pending</Text>}
                        {status === "fulfilled" && <Text>done</Text>}
                        {status === "rejected" && <><Text>error</Text><Text>{error?.message}</Text></>}
                    </ModalBody>
                    <ModalFooter>
                        {isClosable && <Button onClick={onClose}>Close</Button>}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    }
    else
        return (
            // <form onSubmit={handleSubmit}>
            //     <button type="submit">sub</button>
            // </form>
            <Button onClick={run}>
                Add to Metamask
            </Button>
        )
}