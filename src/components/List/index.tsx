import type { NextPageWithLayout } from 'src/custom-types/page'
import type { ReactElement } from 'react'
import { Layout, Navbar } from 'src/components/Layout'
import { Center, Heading } from '@chakra-ui/react'

const List: NextPageWithLayout = () => {
    return (
        <>
            <Center>
                <Heading>List</Heading>
            </Center>
        </>
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

export default List
