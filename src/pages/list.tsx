//@ts-nocheck
import { Layout, Navbar } from 'src/components/Layout'

const chainjsUrl = 'https://raw.githubusercontent.com/starwalker00/chain-rpc-list/main/data/rpcList.json';

function List({ rpcs }) {
    return (
        <ul>
            {rpcs.map((rpc) => (
                <li>{rpc.networkName}</li>
            ))}
        </ul>
    )
}

List.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <Navbar />
            {page}
        </Layout>
    )
}

export async function getStaticProps() {

    // fetch temporarily from github, but later, make it an external repo ?
    const res = await fetch(chainjsUrl);
    const rpcs = await res.json();

    return {
        props: {
            rpcs,
        },
    }
}


export default List;
