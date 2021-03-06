//@ts-nocheck
import { Layout, Navbar } from 'src/components/Layout'
import { Container, Switch, Center, useCheckbox, Checkbox, Box, Flex, InputGroup, InputLeftElement, Input, Button, TableContainer, Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useGlobalFilter, useAsyncDebounce, useExpanded, useSortBy, useFlexLayout, useFilters } from 'react-table'
import { useState, useEffect, useMemo, useCallback } from 'react'
import 'regenerator-runtime/runtime'
import GlobalFilter from 'src/components/GlobalFilter'
import RowSubComponent from 'src/components/RowSubComponent'
import { unflattenObject } from 'src/lib/helper'
import AddToMetamaskButton from 'src/components/AddToMetamaskButton'
import Test from 'src/components/Test'
const chainjsUrl = 'https://raw.githubusercontent.com/starwalker00/chain-rpc-list/main/data/rpcList.json';

function List({ rpcs }) {

    // custom filter function
    function filterShowTestnets(rows, id, filterValue) {
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
                accessor: 'chainName',
                isVisible: true,
                disableGlobalFilter: false,
            },
            {
                Header: 'Chain ID',
                accessor: 'chainId',
                isVisible: true,
                disableGlobalFilter: false,
            },
            {
                Header: () => null,
                id: "addToMM",
                Cell: ({ row }) => (
                    <>
                        <AddToMetamaskButton
                            chainParameter={unflattenObject(row.values)} /*flattened by react-table*/
                        />
                        <Button onClick={() => alert("Adding: \n" + JSON.stringify(row.values))}>
                            Alert
                        </Button>
                    </>
                ),
                disableGlobalFilter: false,
            },
            {
                Header: 'rpcUrls',
                accessor: 'rpcUrls',
                isVisible: false,
                disableGlobalFilter: true,
            },
            {
                Header: 'nativeCurrency.name',
                accessor: 'nativeCurrency.name',
                isVisible: false,
                disableGlobalFilter: true,
            },
            {
                Header: 'nativeCurrency.symbol',
                accessor: 'nativeCurrency.symbol',
                isVisible: false,
                disableGlobalFilter: true,
            },
            {
                Header: 'nativeCurrency.decimals',
                accessor: 'nativeCurrency.decimals',
                isVisible: false,
                disableGlobalFilter: true,
            },
            {
                Header: 'blockExplorerUrls',
                accessor: 'blockExplorerUrls',
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
                isVisible: false,
                disableGlobalFilter: true,
                filter: filterShowTestnets,
            }
        ],
        []
    )
    const data = useMemo(() => rpcs, [rpcs])

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
                columns, data,
                initialState: {
                    hiddenColumns: columns.filter(column => !column?.isVisible).map(column => column.accessor),
                    filters: [{ id: 'isTestnet', value: 0 }],
                },
            },
            useGlobalFilter, useFilters, useSortBy, useFlexLayout, useExpanded);
    return (
        <Container maxW='container.xl' centerContent>
            <Test />
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
                        {headerGroups.map((headerGroup, index) => (
                            <Tr key={index} {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <Th key={column.id}
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
                        {rows.map((row, idx) => {
                            prepareRow(row)
                            return (
                                <>
                                    <Tr {...row.getRowProps()}>
                                        {row.cells.map((cell, index) => (
                                            <Td key={index} {...cell.getCellProps()} isNumeric={cell.column.isNumeric}>
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
