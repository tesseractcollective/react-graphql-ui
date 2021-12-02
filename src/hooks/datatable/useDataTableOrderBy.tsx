import { PrimitiveAtom, useAtom } from 'jotai';
import { DataTableSortModeType, DataTableSortOrderType, DataTableSortParams } from 'primereact/datatable';
import { useState } from 'react';
import { UseDataTableQueryArgsAtom } from './useDataTable';
import _ from 'lodash'
export interface UseDataTableOrderby {
  sortable: boolean;
  sortMode: DataTableSortModeType;
  onSort: (event: DataTableSortParams) => void;
  sortField?: string;
  sortOrder?: DataTableSortOrderType;
}

const reactPrimeSortOrderToHasuraMap: Record<string, string> = {
  '1': 'asc_nulls_last',
  '-1': 'desc_nulls_last',
};

//Need to add sortable to your columns <Column field="..." sortable />
export default function useDataTableOrderBy(args: { queryArgsAtom: PrimitiveAtom<UseDataTableQueryArgsAtom> }): UseDataTableOrderby {
  const [queryArgs, setQueryArgs] = useAtom(args.queryArgsAtom);
  const [lastSortEvent, setLastSortEvent] = useState<DataTableSortParams>();

  const onSort = (event: DataTableSortParams) => {
    if (!event.sortOrder) {
      setQueryArgs({
        ...queryArgs,
        orderBy: undefined,
      });
      setLastSortEvent(event);
      return;
    }

    const hasuraSortDirection = reactPrimeSortOrderToHasuraMap[event.sortOrder + ''];

    const orderByObj = _.set({}, event.sortField, hasuraSortDirection);

    setQueryArgs({
      ...queryArgs,
      orderBy: [orderByObj],
    });
    setLastSortEvent(event);
  };

  return {
    onSort,
    sortable: true,
    sortMode: 'single' as DataTableSortModeType,
    sortField: lastSortEvent?.sortField,
    sortOrder: lastSortEvent?.sortOrder,
  };
}
