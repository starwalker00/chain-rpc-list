//@ts-nocheck
import { Layout, Navbar } from 'src/components/Layout'
import { Container, Box, Button, TableContainer, Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useGlobalFilter, useAsyncDebounce, useExpanded, useSortBy, useFlexLayout } from 'react-table'
import { useState, useMemo, useCallback } from 'react'
import 'regenerator-runtime/runtime'

const chainjsUrl = 'https://raw.githubusercontent.com/starwalker00/chain-rpc-list/main/data/rpcList.json';

// Define a default UI for global filtering
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
    // need to get all the columns even if we do not display them all directly,
    // because the data is needed to add to metamask
    const columns = useMemo(
        () => [
            {
                // Expander cell
                Header: () => null,
                id: 'expander',
                maxWidth: 10,
                Cell: ({ row }) => (
                    <chakra.span {...row.getToggleRowExpandedProps()} >
                        {row.isExpanded ? '👇' : '👉'}
                    </chakra.span >
                ),
            },
            {
                Header: 'Network Name',
                accessor: 'networkName',
                isVisible: true
            },
            {
                Header: 'Chain ID',
                accessor: 'chainID',
                isVisible: true
            },
            {
                Header: () => null,
                id: "addToMM",
                Cell: ({ row }) => (
                    <Button onClick={() => alert("Adding: \n" + JSON.stringify(row.values))}>
                        Add to Metamask
                    </Button>
                ),
            },
            {
                Header: 'rpcUrl',
                accessor: 'rpcUrl',
                isVisible: false
            },
            {
                Header: 'currencySymbol',
                accessor: 'currencySymbol',
                isVisible: false
            },
            {
                Header: 'blockExplorerUrl',
                accessor: 'blockExplorerUrl',
                isVisible: false
            },
            {
                Header: 'sourceUrl',
                accessor: 'sourceUrl',
                isVisible: false
            },
            {
                Header: 'isTestnet',
                accessor: 'isTestnet',
                isVisible: false
            }
        ],
        []
    )
    const data = useMemo(() => rpcs, [])

    // Create a function that will render our row sub components
    const renderRowSubComponent = useCallback(
        ({ row }) => (
            <pre
                style={{
                    fontSize: '10px',
                }}
            >
                <code>{JSON.stringify({ values: row.values }, null, 2)}</code>
            </pre>
        ),
        []
    )


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
        useTable({
            columns, data, initialState: { hiddenColumns: columns.filter(column => !column?.isVisible).map(column => column.accessor) }
        },
            useGlobalFilter, useSortBy, useFlexLayout, useExpanded);
    return (
        <Container maxW='container.xl'>
            <TableContainer>
                <Table {...getTableProps()} variant='striped' colorScheme='teal'>
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
                        {rows.map((row, idx) => {
                            prepareRow(row)
                            return (
                                <>
                                    <Tr {...row.getRowProps()}>
                                        {row.cells.map((cell) => (
                                            <Td {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
                                                {cell.render('Cell')}
                                            </Td>
                                        ))}
                                    </Tr>
                                    {row.isExpanded ? (
                                        <Tr>
                                            <Td colSpan={visibleColumns.length}>
                                                {renderRowSubComponent({ row })}
                                            </Td>
                                        </Tr>
                                    ) : null}
                                </>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
            <pre>
                <code>{JSON.stringify({ expanded: state.expanded }, null, 2)}</code>
            </pre>
        </Container>
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

    // fetch temporarily from github, but later, make it an external repo or internal resource or API ?
    const res = await fetch(chainjsUrl);
    const rpcs = await res.json();

    return {
        props: {
            rpcs,
        },
    }
}


export default List;
