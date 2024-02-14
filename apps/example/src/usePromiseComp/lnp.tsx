import { useState } from "react"
import { filter, noFlickering, reduce, usePipe$, usePromise$ } from "react-loadnpipe"

async function load(wait: number = 3000) {
    return await new Promise<string>((resolve) => {
    setTimeout(() => {
        resolve('foo')
    }, wait)
})
}

let renderCount = 0

export default function LnpPromiseResolution() {
    const [promise, setPromise] = useState<Promise<string> | null>(null)
    const onLoad = () =>{ renderCount = 0; setPromise(load())}
    const data$ = usePromise$(promise);

    const count$ = usePipe$(data$, 
        noFlickering(), 
        data => data.length, 
        reduce((a: number, prev: number) => a + prev), 
        filter((a: number)=> a > 10)
    )
    
    const unwrapCount = count$.unwrapOr(0)
    return (
        <div>
        <div>LnpPromiseResolution {renderCount++}</div>
        {
            data$.match
            .skipped(() => <div>skipped</div>)
            .loading(() => <div>loading...</div>)
            .error((err) => <div>error: {err.message}</div>)
            .ok((data) => <div>{data}</div>)
        }
        {
            count$.match
            .notOk(() => <div>unknown count</div>)
            .ok((count) => <div>count: {count}</div>)
        }
        {
            unwrapCount
        }
        <button onClick={onLoad}>load</button>
        </div>
    )
}