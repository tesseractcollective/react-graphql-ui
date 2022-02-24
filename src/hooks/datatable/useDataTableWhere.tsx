import React, { useEffect, useCallback } from "react";
import { ReactGraphqlUIContext } from "../../context/ReactGraphqlUIContext";
import { HasuraDataConfig } from "@tesseractcollective/react-graphql";
import { PrimitiveAtom, useAtom } from "jotai";
import {
  DataTableFilterMatchModeType,
  DataTableFilterParams,
  DataTableFilterMetaData,
  DataTableOperatorFilterMetaData,
} from "primereact/datatable";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useContext, useMemo, useState } from "react";
import { UseDataTableArgs, UseDataTableQueryArgsAtom } from "./useDataTable";
import useDebounce from "../useDebounce";
import { InputText } from "primereact/inputtext";

const reactPrimeFilterMatchModeToHasuraStringOpration: Record<
  DataTableFilterMatchModeType,
  string
> = {
  contains: "_like",
  equals: "_eq",
  endsWith: "_like",
  gt: "_gt",
  lt: "_lt",
  gte: "_gte",
  lte: "_lte",
  in: "_in",
  notEquals: "_neq",
  startsWith: "_like",
  custom: "_like",
  notContains: "_nlike",
  between: "_like",
  dateIs: "_like",
  dateIsNot: "_nlike",
  dateBefore: "_lte",
  dateAfter: "_gte",
};
const reactPrimeFilterMatchModeToHasuraEqualityOpration: Record<
  DataTableFilterMatchModeType,
  string
> = {
  contains: "_eq",
  equals: "_eq",
  endsWith: "_eq",
  gt: "_gt",
  lt: "_lt",
  gte: "_gte",
  lte: "_lte",
  in: "_in",
  notEquals: "_neq",
  startsWith: "_eq",
  custom: "_eq",
  notContains: "_neq",
  between: "_like",
  dateIs: "_like",
  dateIsNot: "_nlike",
  dateBefore: "_lte",
  dateAfter: "_gte",
};

const reactPrimeFilterMatchModeToHasuraEqualityObject: Record<
  DataTableFilterMatchModeType,
  Function
> = {
  contains: (value: any) =>
    typeof value == "string" ? { _ilike: `%${value}%` } : { _eq: value },
  equals: (value: any) => ({ _eq: value }),
  endsWith: (value: any) =>
    typeof value == "string" ? { _ilike: `%${value}` } : { _eq: value },
  gt: (value: any) => ({ _gt: value }),
  lt: (value: any) => ({ _lt: value }),
  gte: (value: any) => ({ _gte: value }),
  lte: (value: any) => ({ _lte: value }),
  in: (value: any) => ({ _in: value }),
  notEquals: (value: any) => ({ _neq: value }),
  startsWith: (value: any) =>
    typeof value == "string" ? { _ilike: `${value}%` } : { _eq: value },
  custom: (value: any) => ({ _ilike: value }),
  notContains: (value: any) =>
    typeof value == "string" ? { _nilike: `%${value}%` } : { _neq: value },
  between: (value: any) => ({ _ilike: value }),
  dateIs: (value: Date) => ({
    _gte: value,
    _lt: new Date(value.getTime() + 86400000),
  }),
  dateIsNot: (value: Date) => ({
    _lt: value,
    _gte: new Date(value.getTime() + 86400000),
  }),
  dateBefore: (value: Date) => ({ _lt: value }),
  dateAfter: (value: Date) => ({ _gt: value }),
};

const buildNestedObject = (keyArray: Array<string>, value: any) =>
  keyArray.reverse().reduce(function (o, s) {
    return { [s]: o };
  }, value);

//Need to add sortable to your columns <Column field="..." sortable />
export default function useDataTableWhere<T>(args: {
  queryArgsAtom: PrimitiveAtom<UseDataTableQueryArgsAtom>;
  gqlConfig?: HasuraDataConfig;
  dataTableArgs?: UseDataTableArgs<T>;
  queryArgsWhere?: Record<string, any>;
  filterable?: boolean | Array<string>;
  initFilters?: DataTableFilterMetaData;
}): UseDataTableWhere<T> {
  const [queryArgs, setQueryArgs] = useAtom(args.queryArgsAtom);
  const [lastEvent, setLastEvent] = useState<DataTableFilterParams | undefined>(
    () => {
      if (args.initFilters) return { filters: args.initFilters };
      if (Array.isArray(args.filterable))
        return {
          filters: args.filterable.reduce(
            (prev, columnName) => ({
              ...prev,
              [columnName]: {
                operator: FilterOperator.AND,
                constraints: [
                  {
                    value: null,
                    matchMode: FilterMatchMode.STARTS_WITH,
                  },
                ],
              },
            }),
            {}
          ),
        };
      return undefined;
    }
  );

  const [searchText, setSearchText] = useState<string>();
  const [searchbarWhere, setSearchbarWhere] = useState<Record<string, any>>();
  const [filtersWhere, setFiltersWhere] = useState<Record<string, any>>();

  const rgUIContext = useContext<any>(ReactGraphqlUIContext);

  const onFilter = (event: DataTableFilterParams) => {
    setLastEvent(event);

    if (args.dataTableArgs?.toolbar?.whereBuilder) {
      const _where = args.dataTableArgs?.toolbar?.whereBuilder(
        searchText,
        event
      );
      setSearchbarWhere(_where);
    }
    if (args.filterable) {
      const columnNames = Object.keys(event.filters);

      const whereClause = columnNames.reduce((whereC, columnName) => {
        if ("matchMode" in event.filters[columnName]) {
          const fieldScalarType =
            args.gqlConfig?.fields?.fieldSimpleMap?.[columnName]?.typeName ||
            "";

          const isStringBasedSearch = ["String", "citext"].includes(
            fieldScalarType
          );
          const columnFilter = event.filters[
            columnName
          ] as DataTableFilterMetaData;
          const matchMode = columnFilter.matchMode;

          const operationStr = isStringBasedSearch
            ? reactPrimeFilterMatchModeToHasuraStringOpration[matchMode]
            : reactPrimeFilterMatchModeToHasuraEqualityOpration[matchMode];

          return {
            _and: [
              whereC,
              {
                [columnName]: {
                  [operationStr]: `${
                    isStringBasedSearch &&
                    ["contains", "endsWith", "notContains"].includes(matchMode)
                      ? "%"
                      : ""
                  }${columnFilter.value}${
                    isStringBasedSearch &&
                    ["contains", "startsWith", "notContains"].includes(
                      matchMode
                    )
                      ? "%"
                      : ""
                  }`,
                },
              },
            ],
          };
        } else {
          const columnFilter = event.filters[
            columnName
          ] as DataTableOperatorFilterMetaData;

          return {
            _and: [
              whereC,
              {
                [`_${columnFilter.operator}`]: columnFilter.constraints.map(
                  (constraint) =>
                    constraint.value
                      ? buildNestedObject(
                          columnName.split("."),
                          reactPrimeFilterMatchModeToHasuraEqualityObject[
                            constraint.matchMode
                          ](constraint.value)
                        )
                      : {}
                ),
              },
            ],
          };
        }
      }, {});
      setFiltersWhere(whereClause)
    }
  };

  const searchIsInToolbar =
    args.dataTableArgs?.toolbar?.left === "searchInput" ||
    args.dataTableArgs?.toolbar?.right === "searchInput";

  const searchInput = useMemo(() => {
    if (!searchIsInToolbar) {
      return null;
    }

    const SearchInputComponent =
      rgUIContext.defaultComponents?.["SearchInput"] || InputText;

    return (
      <SearchInputComponent
        value={searchText}
        onChange={(e: any) => setSearchText(e.target.value)}
        placeholder={args.dataTableArgs?.toolbar?.searchPlaceholder || "Search"}
      />
    );
  }, [args.dataTableArgs?.toolbar?.left, args.dataTableArgs?.toolbar?.right]);

  const callback = useCallback(() => {
    if (searchText) {
      if (args.dataTableArgs?.toolbar?.whereBuilder) {
        const _where = args.dataTableArgs?.toolbar?.whereBuilder(searchText);
        setSearchbarWhere(_where);
      } else {
        console.error(
          "useDataTable:useDataTableWhere:" +
            args.gqlConfig?.typename +
            ": To use the SeachInput in the toolbar or standalone, you must include the toolbar.whereBuilder arg in your useDataTable options."
        );
      }
    } else {
      setSearchbarWhere({});
    }
  }, [searchText]);

  const resetDebounce = useDebounce(
    callback,
    args.dataTableArgs?.toolbar?.debounceMS || 300
  );

  useEffect(() => {
    resetDebounce();
  }, [searchText]);

  useEffect(() => {
    if (searchbarWhere || filtersWhere || queryArgs.where) {
      setQueryArgs({
        ...queryArgs,
        where: { _and: [searchbarWhere || {} , filtersWhere || {} , args.queryArgsWhere || {}] },
      });
    }
  }, [searchbarWhere,filtersWhere]);

  return {
    onFilter,
    filters: lastEvent?.filters,
    searchInput,
    searchText,
    setSearchText,
  };
}

export interface UseDataTableWhere<T> {
  onFilter: (event: DataTableFilterParams) => void;
  filters: any;
  searchInput: JSX.Element | null;
  searchText: string | undefined;
  setSearchText: React.Dispatch<React.SetStateAction<string | undefined>>;
}
