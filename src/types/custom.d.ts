import type { IProjectDetails, ParentAccountDetails } from "@/api/types/common";
import type { SOCKET_DATA_TYPES } from "@/constants";
import { ReactNode } from "react";

import type { Slug } from "./nextTypes";

// export type Role = "Master" | "Distributor" | "Coach" | "Referent"
// export type ProjectType =
//   | "SEI_ADULT"
//   | "SEI_YOUTH"
//   | "SEI_360"
//   | "VS_LVS"
//   | "VS_OVS"
//   | "VS_TVS"
//   | "BOOK"
//   | "SEI_PROFILER"
//   | "SEI_PROFILER_YV"
//   | "SEI_ADULT_V4"
//   | "SEI_PROFILER_V4"
//   | "SEI_P_YOUTH"
//   | "SEI_ADULT_NUS"
//   | "SEQ_ADULT"
//   | "SEI_TSI"

// export type PaginationData = {
//   currentPage: number
//   firstPageUrl: string
//   from: number
//   lastPage: number
//   lastPageUrl: string
//   nextPageUrl: string
//   path: string
//   // perPage: number
//   prevPageUrl: string | null
//   to: number
//   total: number
// }

// interfaces definition
export interface IChildrenProps {
  children: ReactNode;
}
export interface ISelectWithSearch {
  id?: number | string | null;
  value: string | number;
  label: string;
}

export interface ITableBaseState<T> {
  pagination?: PaginationData;
  rows?: T[];
  selectAllTableEntries?: boolean;
  pagination?: PaginationData;
  filters?: {
    page?: number;
    search?: string | Slug;
    pagePerItm?: number;
    date?: DateRange[];
    flag1?: boolean;
    selectFilter?: ISelectWithSearch;
    isSelectedAll?: boolean;
    selectedAll?: number[];
    [key: string]: any;
  };
}

export type DateRange = {
  startDate: Date | string;
  endDate: Date | string;
  key: string;
};

export type t = (e: string) => string;

export type Filters = {
  type?: string;
  page?: number;
  search?: string;
  pagePerItm?: number;
  to?: string;
  from?: string;
  limit?: number;
};
