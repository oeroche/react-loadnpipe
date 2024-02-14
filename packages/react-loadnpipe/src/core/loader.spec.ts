import { LoaderStatusMapper, buildLoaderFromMatcher } from './loader'

describe('loader', () => {
  const asyncPatternDefault = {
    isLoading: false,
    isError: false,
    data: undefined
  }

  const asyncPatternMatcher: LoaderStatusMapper<
    typeof asyncPatternDefault,
    any
  > = {
    error: (v) => v.isError,
    loading: (v) => v.isLoading,
    ok: (v) => (!v.isError && !v.isLoading ? v.data : false),
    skipped: (v) => !v.isError && !v.isLoading && !v.data
  }

  it('should build a loader', () => {
    const asyncPattern: any = {
      ...asyncPatternDefault
    }

    const loader$ = buildLoaderFromMatcher(asyncPattern, asyncPatternMatcher)

    expect(loader$.status).toBe('skipped')
  })

  it('should update the loader according to matcher', () => {
    const asyncPattern: any = { ...asyncPatternDefault }
    const loader$ = buildLoaderFromMatcher(asyncPattern, asyncPatternMatcher)

    asyncPattern.isLoading = true
    loader$.update(asyncPattern)
    expect(loader$.status).toBe('loading')

    asyncPattern.isLoading = false
    asyncPattern.isError = true
    loader$.update(asyncPattern)
    expect(loader$.status).toBeInstanceOf(Error)

    asyncPattern.isError = false
    asyncPattern.data = 'data'
    loader$.update(asyncPattern)
    expect(loader$.status).toBe('ok')
  })

  describe('loader.match', () => {
    it('should match the loader', () => {
      const asyncPattern: any = { ...asyncPatternDefault }
      const loader$ = buildLoaderFromMatcher(asyncPattern, asyncPatternMatcher)
      const result = loader$.match.notOk(() => 'NOT_OK').ok((v) => v)

      expect(result).toBe('NOT_OK')

      asyncPattern.isLoading = true
      loader$.update(asyncPattern)
      const result2 = loader$.match.notOk(() => 'NOT_OK').ok(() => true)
      expect(result2).toBe('NOT_OK')

      asyncPattern.isLoading = false
      asyncPattern.isError = true
      loader$.update(asyncPattern)
      const result3 = loader$.match.notOk(() => 'NOT_OK').ok(() => true)
      expect(result3).toBe('NOT_OK')

      asyncPattern.isError = false
      asyncPattern.data = 'data'
      loader$.update(asyncPattern)
      const result4 = loader$.match.notOk(() => 'NOT_OK').ok(() => true)
      expect(result4).toBe(true)
    })
  })
})
