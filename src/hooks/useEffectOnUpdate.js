import { useEffect, useRef } from 'react'

export function useEffectOnUpdate(func, dependencies) {
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
        } else {
            func()
        }
    }, dependencies)
}