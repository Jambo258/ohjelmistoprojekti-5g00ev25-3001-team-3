import { useState, useCallback, useRef, useEffect } from 'react'

export interface sendRequestValues {
  url: URL
  method: string | 'GET'
  body: string | null
  headers: any
}

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any | null>(null)

  const arr: any[] = []
  const activeHttpRequests = useRef(arr) //create a reference hook

  const sendRequest = useCallback(
    async (url: RequestInfo | URL, method: any, body: any, headers: any) => {
      setIsLoading(true)
      const requestAbortController = new AbortController() //built into browsers
      activeHttpRequests.current.push(requestAbortController) //add the abort controller to our ref, doesnt change over render cycles
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: requestAbortController.signal
        })

        const data = await response.json()

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== requestAbortController
        )

        if (!response.ok) {
          throw new Error(data.name)
        }
        setIsLoading(false)
        return data
      } catch (error) {
        setError(error)
        setIsLoading(false)
        throw error //let the user know
      }
    },
    []
  )

  const clearError = () => {
    setError(null)
  }

  useEffect(() => {
    //We will use an empty useeffect to abort the requests
    return () => {
      //when the component unmounts. The empty function becomes an cleanup
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortController) =>
        abortController.abort()
      )
    }
  }, [])

  return { isLoading, error, sendRequest, clearError }
}
