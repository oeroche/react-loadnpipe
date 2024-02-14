# React LoadnPipe

A monadic primitive to handle asynchronous data loading in React and a collection of hooks to allow better data flows in your application.

# Motivation

Hide async dataflow management behind a powerful primitive in order to reduce bugs and improve readability of your code.
Stop cheking `loading` or `isError` booleans everytime, just load your data and pipe it!

# The loader monad

A loader encapsulate a piece of data and can hace 4 state:

- ok: the data is available
- error: an error occurred
- loading: the data is being loaded
- skipped: the loading is not executed

To build a loader you can use the use$ loader.

# Usage

## Installation

```bash
pnpm install react-loadnpipe
```

or yarn or npm or whatever

## use$

Transform async data source into a loader.

```tsx
const Component = () => {
    const { data, loading, error } = useFetch(url)
    const data$ = use$({ data, error, loading}, {
        ok: x => x.data,
        error x => x.error,
        loading => x.loading
    })

    const dataLength$ = usePipe$(data$, data => data.length)

    return (
        <div>
            {
                data.match
                    .ok(length => <div>length</div>)
                    .loading(() => <div>loading</div>)
                    .error((e => <div>error: {e.message}<div>))
                    .skipped(() => null)
            ``
        </div>
    )
}
```

The use$ hook is intended to be used to implement your own custom hooks.

For example with apollo's `useQuery` we can derive a loader version `useQuery$`:

```tsx
function useQuery$<
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>
) {
  const queryObject = useQuery(query, options);
  const loader = use$(queryObject, {
    loading(v) {
      return v.loading;
    },
    error(v) {
      return v.error ? v.error : fals``;
    },
    ok(v) {
      return v;
    },
    skipped(v) {
      return !v.called;
    },
  });

  return [loader, queryObject] as const;
}
```

## usePipe$

the usePipe is a hook that let use easily apply transformations and operation to our loaders:

```tsx
const data$ = use$(whatever);
const modifiedData$ = usePipe$(
  data$,
  (x) => x.toString(),
  (x) => x.length(),
  x + 2
); // modifiedData$ is now a loader of number
```

the pipe operator will only run it's given functions once data$ is loaded.

To apply functions in other case (data$ is in error or loading state for exemple):

```tsx
const data$ = use$(whatever)
const modifiedData$ = usePipe$(data$,
    {
        ok: x => x.toString(),
        loading () => 'loading',
        error: () => 'error',
        skipped: () => 'skipped'
    }
    x => x.length(),
    x+2
)
```

Non ok states (error, loading and skipped) will be remaped to ok states.

The package comes also with operators that performs some complicated task for you such as `noFlickering`, `reduce`, `inspect`, `tap`.

## react hooks equivalents

To handle data flow while forgetting about the loader states the package provides replacements for react internal hooks.

### useEffect$

when using loaders you can use the useEffect$ hook instead of useEffect. Effect will be triggered once the loader is in ok state.

```jsx
var foo = "bar";

useEffect$(loader$, () => {
  console.log("effect");
});

useEffect$(
  loader$,
  () => {
    // triggered when loader is ok and the foo variable changes
    console.log(foo);
  },
  [foo]
);
```

### useCallback$

TODO: write doc

### useMemo$

TODO: write doc
