//@ts-nocheck
import { Layout, Navbar } from 'src/components/Layout'
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useSortBy } from 'react-table'
import { useMemo } from 'react'

const chainjsUrl = 'https://raw.githubusercontent.com/starwalker00/chain-rpc-list/main/data/rpcList.json';

function List({ rpcs }) {
    // return (
    //     <ul>
    //         {rpcs.map((rpc) => (
    //             <li>{rpc.networkName}</li>
    //         ))}
    //     </ul>
    // )
    const columns = useMemo(
        () => [
            {
                Header: 'Network Name',
                accessor: 'networkName',
            },
            {
                Header: 'Chain ID',
                accessor: 'chainID',
            }
        ],
        []
    )
    const data = useMemo(() => rpcs, [])

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data }, useSortBy)
    return (
        <Table {...getTableProps()}>
            <Thead>
                {headerGroups.map((headerGroup) => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <Th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                isNumeric={column.isNumeric}
                            >
                                {column.render('Header')}
                                <chakra.span pl='4'>
                                    {column.isSorted ? (
                                        column.isSortedDesc ? (
                                            <TriangleDownIcon aria-label='sorted descending' />
                                        ) : (
                                            <TriangleUpIcon aria-label='sorted ascending' />
                                        )
                                    ) : null}
                                </chakra.span>
                            </Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row)
                    return (
                        <Tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                                    {cell.render('Cell')}
                                </Td>
                            ))}
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
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
