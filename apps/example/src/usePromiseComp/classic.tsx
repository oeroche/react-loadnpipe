import { useEffect, useState } from 'react'


async function load(wait: number = 3000) {
    return await new Promise<string>((resolve) => {
    setTimeout(() => {
        resolve('foo')
    }, wait)
})
}

let renderCount = 0
export default function ClassicPromiseResolution() {
    
    const [{isLoading, isSkipped, data, error}, setLoader] = useState<{
        isLoading: boolean,
        isSkipped: boolean,
        data: string | null,
        error: any | null
    
    }>({
        isLoading: false,
        isSkipped: false,
        data: null,
        error: null
    })


    const onLoad = async () => {
        renderCount = 0
        try {
            setLoader(l => ({...l, isLoading: true}))
            const data = await load();
            setLoader(() => ({error: null, data,  isLoading: false, isSkipped: false}))
        } catch (e) {
            setLoader(l => ({...l, isLoading: false, error: e}))
        }
    }

    useEffect(() => {
        if(data) {
            console.log(data)
        }
    }, [data])

    let count = data ? data.length : 0

  return (
    <div>
    <div>ClassicPromiseResolution {renderCount++}</div>
    {isLoading && <div>loading...</div>}
    {isSkipped && <div>skipped</div>}
    {error && <div>{error.message}</div>}
    {data && <div>{data}</div>}
    <button onClick={onLoad}>load</button>
    </div>
  )
}