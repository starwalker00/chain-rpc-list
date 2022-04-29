// Define a UI for displayng every information if expanded below each row

export default function RowSubComponent({ row }) {
    return (
        <pre
            style={{
                fontSize: '10px',
            }}
        >
            <code>{JSON.stringify({ values: row.values }, null, 2)}</code>
        </pre>
    )
}