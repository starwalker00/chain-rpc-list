//@ts-nocheck
import { Layout, Navbar } from 'src/components/Layout'
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useGlobalFilter, useAsyncDebounce, useSortBy } from 'react-table'
import { useState, useMemo } from 'react'
import 'regenerator-runtime/runtime'

const chainjsUrl = 'https://raw.githubusercontent.com/starwalker00/chain-rpc-list/main/data/rpcList.json';

// Define a default UI for filtering
function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)

    return (
        <span>
            Search:{' '}
            <input
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`${count} records...`}
                style={{
                    fontSize: '1.1rem',
                    border: '0',
                }}
            />
        </span>
    )
}

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

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter } =
        useTable({ columns, data }, useGlobalFilter, useSortBy)
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
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
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
