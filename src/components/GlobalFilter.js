// Define a UI for global filtering
// Searchbar + tags

import { Container, Center, Box, Flex, InputGroup, InputLeftElement, Input, Button, TableContainer, Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { Search2Icon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useGlobalFilter, useAsyncDebounce, useExpanded, useSortBy, useFlexLayout } from 'react-table'
import { useState, useMemo, useCallback } from 'react'

const tags = ["evmos", "mainnet", "a"];

function Tag({ tag }) {
    return (
        <Box
            width={'full'}
            border="1px solid black"
            textAlign="center"
            paddingX={2} paddingY={2}>
            {tag}
        </Box>
    )
}

export default function GlobalFilter({
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
        <Box border="1px solid teal">
            {/** SearchBar */}
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
            {/** Tags */}
            <Flex justifyContent="space-evenly" gap={2}>
                {
                    tags.map(tag => <Tag tag={tag} />)
                }
            </Flex>
        </Box>
    )
}