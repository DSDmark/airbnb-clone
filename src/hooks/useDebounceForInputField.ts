import { DEBOUNCE_DELAY_VALUE } from "@/constants"
import { SetStateAction } from "@/types"
import { useEffect } from "react"
import { useDebounce } from "use-debounce"

function useDebounceWithInputField(state: any, setState: SetStateAction<any>, flag: string = "search"): any {
  let newState: any

  switch (flag) {
    case "date":
      newState = state.filters.date[0]
      break
    default:
      newState = state.filters.search
  }

  const [debouncedValue] = useDebounce(newState, DEBOUNCE_DELAY_VALUE)

  useEffect(() => {
    setState((prev: any) => ({ ...prev, filters: { ...prev.filters, page: 0 } }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, setState])

  return [debouncedValue]
}

export default useDebounceWithInputField
