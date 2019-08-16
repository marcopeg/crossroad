Empty Editor:

```js
<Editor
    inputStyle={{
        width: '100%',
        border: '0px solid #fff',
        outline: 'none',
    }}
/>
```

Editor with initial value:

```js
const r1 = React.createRef()
;
<>
    <Editor
        ref={r1}
        value={[
            {
                id: '10620d4b-5e17-45e1-ab6e-ec5775adefdf',
                createdAt: new Date('2019-07-16 07:55'),
                updatedAt: new Date('2019-07-16 07:55'),
                text: 'Paragraph 1',
            },
            {
                id: '41a30f01-6818-4ebc-b1a1-c5a7450833fd',
                createdAt: new Date('2019-07-16 07:56'),
                updatedAt: new Date('2019-07-16 07:56'),
                text: 'Paragraph 2 this is very long as I want to see how to play with the arrow keys',
            },
            {
                id: '8cf4ad86-3c41-41b0-b3ab-024a8644a676',
                createdAt: new Date('2019-07-16 07:54'),
                updatedAt: new Date('2019-07-16 07:54'),
                text: 'Paragraph 3',
            }
        ]} 
    />
    <button onClick={() => {
        console.log(r1.current.getContent())
    }}>Get text</button>
</>
```