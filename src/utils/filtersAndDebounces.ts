import { OnChange, SetStateAction } from "@/types"

export const handleInputFilterUtil = (e: OnChange | null, setState: SetStateAction<any>) => {
  setState((prev: any) => ({ ...prev, filters: { ...prev.filters, search: e?.target?.value } }))
}

export const handleDateFilterUtil = (e: any, setState: SetStateAction<any>) => {
  setState((prev: any) => ({ ...prev, filters: { ...prev.filters, date: [e.selection] } }))
}
