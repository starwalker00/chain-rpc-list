//@ts-nocheck
import { Layout, Navbar } from 'src/components/Layout'
import { Container, Switch, Center, useCheckbox, Checkbox, Box, Flex, InputGroup, InputLeftElement, Input, Button, TableContainer, Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { Search2Icon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useGlobalFilter, useAsyncDebounce, useExpanded, useSortBy, useFlexLayout, useFilters } from 'react-table'
import { useState, useMemo, useCallback } from 'react'
import 'regenerator-runtime/runtime'
import GlobalFilter from 'src/components/GlobalFilter'
import RowSubComponent from 'src/components/RowSubComponent'

const chainjsUrl = 'https://raw.githubusercontent.com/starwalker00/chain-rpc-list/main/data/rpcList.json';

function List({ rpcs }) {
    // Define a default UI for filtering
    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length

        return (
            <input
                value={filterValue || ''}
                onChange={e => {
                    setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
                }}
                placeholder={`Search ${count} records...`}
            />
        )
    }
    const defaultColumn = useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    )
    // This is a custom filter UI for selecting
    // a unique option from a list
    function SelectColumnFilter({
        column: { filterValue, setFilter, preFilteredRows, id },
    }) {
        console.log(filterValue)
        return (
            <>
                {/* <Button onClick={() => setFilter(1)}>all</Button>
                <Button onClick={() => setFilter(0)}>no tests</Button> */}
                {/* <Button onClick={() => setFilter(0)}>no tests</Button> */}
                <Checkbox onChange={() => setFilter(!filterValue)}>show testnets</Checkbox>
            </>
        )
    }
    // Define a custom filter filter function!
    function filterGreaterThan(rows, id, filterValue) {
        console.log("filterGreaterThan")
        console.log(filterValue)
        return rows.filter(row => {
            const rowValue = row.values[id]
            return rowValue <= filterValue
        })
    }

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
                isVisible: true,
                disableGlobalFilter: false,
            },
            {
                Header: 'Chain ID',
                accessor: 'chainID',
                isVisible: true,
                disableGlobalFilter: false,
            },
            {
                Header: () => null,
                id: "addToMM",
                Cell: ({ row }) => (
                    <Button onClick={() => alert("Adding: \n" + JSON.stringify(row.values))}>
                        Add to Metamask
                    </Button>
                ),
                disableGlobalFilter: false,
            },
            {
                Header: 'rpcUrl',
                accessor: 'rpcUrl',
                isVisible: false,
                disableGlobalFilter: true,
            },
            {
                Header: 'currencySymbol',
                accessor: 'currencySymbol',
                isVisible: false,
                disableGlobalFilter: true,
            },
            {
                Header: 'blockExplorerUrl',
                accessor: 'blockExplorerUrl',
                isVisible: false,
                disableGlobalFilter: true,
            },
            {
                Header: 'sourceUrl',
                accessor: 'sourceUrl',
                isVisible: false,
                disableGlobalFilter: true,
            },
            {
                Header: 'isTestnet',
                accessor: 'isTestnet',
                isVisible: true,
                disableGlobalFilter: true,
                Filter: SelectColumnFilter,
                filter: filterGreaterThan,
            }
        ],
        []
    )
    const data = useMemo(() => rpcs, [])

    // function that will render our row sub components
    const renderRowSubComponent = useCallback(
        ({ row }) => (<RowSubComponent row={row} />),
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
        setGlobalFilter,
        setFilter } =
        useTable(
            {
                columns, data, defaultColumn,
                initialState: {
                    hiddenColumns: columns.filter(column => !column?.isVisible).map(column => column.accessor),
                    filters: [
                        {
                            id: 'isTestnet',
                            value: 0,
                        },
                    ],
                },
                // manualFilters: true
            },
            useGlobalFilter, useFilters, useSortBy, useFlexLayout, useExpanded);
    return (
        <Container maxW='container.xl' centerContent>
            <Box>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            </Box>

            <Checkbox onChange={(e) => { setFilter('isTestnet', e.target.checked) }}>show testnets</Checkbox>

            <TableContainer alignSelf="stretch">
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
                                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                                    </Th>
                                ))}
                            </Tr>
                        ))}
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
