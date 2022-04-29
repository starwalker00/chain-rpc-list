// Define a UI for global filtering
// Searchbar + tags

import { Container, Center, Box, Flex, InputGroup, InputLeftElement, InputRightElement, Input, Button, TableContainer, Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { Search2Icon, CloseIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import { useTable, useGlobalFilter, useAsyncDebounce, useExpanded, useSortBy, useFlexLayout } from 'react-table'
import { useState, useMemo, useCallback } from 'react'

const tags = ["evmos", "mainnet", "a"];


function Tag({ tag, onClick }) {
    return (
        <Box
            as='button'
            lineHeight='1.2'
            // transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
            // border='1px'
            // borderRadius='2px'
            // borderColor='#ccd0d5'
            fontSize='14px'
            fontWeight='semibold'
            backgroundColor='gray.100'
            color='black'
            _hover={{ backgroundColor: 'gray.200' }}
            _active={{
                backgroundColor: 'gray.300',
                transform: 'scale(0.98)',
                // borderColor: '#bec3c9',
            }}
            _focus={{
                // boxShadow:
                //     '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)',
                backgroundColor: 'gray.300',
            }}
            onClick={onClick}
            width={'full'}
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
                    // eslint-disable-next-line react/no-children-prop
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
                        borderRadius: '0',
                    }}
                />
                <InputRightElement
                    onClick={() => {
                        setValue('');
                        onChange('');
                    }}
                    _active={{
                        backgroundColor: 'gray.300',
                        transform: 'scale(0.98)',
                    }}
                    cursor='pointer'
                    // eslint-disable-next-line react/no-children-prop
                    children={<CloseIcon w={3} h={3} />}
                />
            </InputGroup>
            {/** Tags */}
            <Flex justifyContent="space-evenly" gap={2}>
                {
                    tags.map(tag =>
                        <Tag
                            key={tag}
                            tag={tag}
                            onClick={() => {
                                setValue(tag);
                                onChange(tag);
                            }}
                        />
                    )
                }
            </Flex>
        </Box>
    )
}