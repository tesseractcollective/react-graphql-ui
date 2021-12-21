import React, { useEffect, useCallback } from 'react';
import { ReactGraphqlUIContext } from '../../context/ReactGraphqlUIContext';
import { HasuraDataConfig } from '@tesseractcollective/react-graphql';
import { PrimitiveAtom, useAtom } from 'jotai';
import { DataTableFilterMatchModeType, DataTableFilterParams } from 'primereact/datatable';
import { useContext, useMemo, useState } from 'react';
import { UseDataTableArgs, UseDataTableQueryArgsAtom } from './useDataTable';
import useDebounce from '../useDebounce';
import { InputText } from 'primereact/inputtext';

const reactPrimeFilterMatchModeToHasuraStringOpration: Record<DataTableFilterMatchModeType, string> = {
  contains: '_like',
  equals: '_eq',
  endsWith: '_like',
  gt: '_gt',
  lt: '_lt',
  gte: '_gte',
  lte: '_lte',
  in: '_in',
  notEquals: '_neq',
  startsWith: '_like',
  custom: '_like',
};
const reactPrimeFilterMatchModeToHasuraEqualityOpration: Record<DataTableFilterMatchModeType, string> = {
  contains: '_eq',
  equals: '_eq',
  endsWith: '_eq',
  gt: '_gt',
  lt: '_lt',
  gte: '_gte',
  lte: '_lte',
  in: '_in',
  notEquals: '_neq',
  startsWith: '_eq',
  custom: '_eq',
};

//Need to add sortable to your columns <Column field="..." sortable />
export default function useDataTableWhere<T>(args: {
  queryArgsAtom: PrimitiveAtom<UseDataTableQueryArgsAtom>;
  gqlConfig?: HasuraDataConfig;
  dataTableArgs?: UseDataTableArgs<T>;
}): UseDataTableWhere<T> {
  const [queryArgs, setQueryArgs] = useAtom(args.queryArgsAtom);
  const [lastEvent, setLastEvent] = useState<DataTableFilterParams>();

  const [searchText, setSearchText] = useState<string>();
  const [where, setWhere] = useState<Record<string, any>>();

  const rgUIContext = useContext<any>(ReactGraphqlUIContext);

  const onFilter = (event: DataTableFilterParams) => {
    setLastEvent(event);

    if (args.dataTableArgs?.toolbar?.whereBuilder) {
      const _where = args.dataTableArgs?.toolbar?.whereBuilder(searchText);
      setWhere(_where);
      return;
    } 
    
    const columnNames = Object.keys(event.filters);

    const whereClause = columnNames.reduce((whereC, columnName) => {
      const fieldScalarType = args.gqlConfig?.fields?.fieldSimpleMap?.[columnName]?.typeName || '';

      const isStringBasedSearch = ['String', 'citext'].includes(fieldScalarType);
      const matchMode = event.filters[columnName].matchMode;
      
      const operationStr = isStringBasedSearch
        ? reactPrimeFilterMatchModeToHasuraStringOpration[matchMode]
        : reactPrimeFilterMatchModeToHasuraEqualityOpration[matchMode];

      return {
        ...whereC,
        [columnName]: {
          [operationStr]: `${isStringBasedSearch && ['contains', 'endsWith'].includes(matchMode) ? '%' : ''}${event.filters[columnName].value}${
            isStringBasedSearch && ['contains', 'startsWith'].includes(matchMode) ? '%' : ''
          }`,
        },
      };
    }, {});

    setQueryArgs({
      ...queryArgs,
      where: whereClause,
    });
  };

  const searchIsInToolbar = args.dataTableArgs?.toolbar?.left === 'searchInput' || args.dataTableArgs?.toolbar?.right === 'searchInput';

  const searchInput = useMemo(() => {
    if (!searchIsInToolbar) {
      return null;
    }

    const SearchInputComponent = rgUIContext.defaultComponents?.['SearchInput'] || InputText;

    return (
      <SearchInputComponent
        value={searchText}
        onChange={(e: any) => setSearchText(e.target.value)}
        placeholder={args.dataTableArgs?.toolbar?.searchPlaceholder || 'Search'}
      />
    );
  }, [args.dataTableArgs?.toolbar?.left, args.dataTableArgs?.toolbar?.right]);

  const callback = useCallback(() => {
    if (searchText) {
      if (args.dataTableArgs?.toolbar?.whereBuilder) {
        const _where = args.dataTableArgs?.toolbar?.whereBuilder(searchText);
        setWhere(_where);
      } else {
        console.error(
          'useDataTable:useDataTableWhere:' +
            args.gqlConfig?.typename +
            ': To use the SeachInput in the toolbar or standalone, you must include the toolbar.whereBuilder arg in your useDataTable options.',
        );
      }
    } else {
      setWhere({});
    }
  }, [searchText]);

  const resetDebounce = useDebounce(callback, args.dataTableArgs?.toolbar?.debounceMS || 300);

  useEffect(() => {
    resetDebounce();
  }, [searchText]);

  useEffect(() => {
    if (where || queryArgs.where) {
      setQueryArgs({
        ...queryArgs,
        where,
      });
    }
  }, [where]);

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
