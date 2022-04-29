//@ts-nocheck
import { Layout, Navbar } from 'src/components/Layout'
import { Container, Center, Box, Flex, InputGroup, InputLeftElement, Input, Button, TableContainer, Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { Search2Icon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
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
    let arr = ["evmos", "mainnet", "a"];
    return (
        <Box border="1px solid teal">
            <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                    children={<Search2Icon />}
                />
                <Input
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
            </InputGroup>
            <Flex justifyContent="space-evenly" gap={2}>
                {
                    arr.map(tag => <Box width={'full'} border="1px solid black" textAlign="center" paddingX={2} paddingY={2}>{tag}</Box>)
                }
            </Flex>
        </Box>
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
                isVisible: false,
                disableGlobalFilter: true,
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
        <Container maxW='container.xl' centerContent>
            <Box>
                <GlobalFilter
                    preGlobalFilteredRows={preGlobalFilteredRows}
                    globalFilter={state.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            </Box>
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
