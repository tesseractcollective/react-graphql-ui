import { HasuraDataConfig } from '@tesseractcollective/react-graphql'
import { PrimitiveAtom, useAtom } from 'jotai'
import {
  DataTableFilterMatchModeType,
  DataTableFilterParams
} from 'primereact/datatable'
import { useState } from 'react'
import { UseDataTableQueryArgsAtom } from './useDataTable'

export interface UseDataTableWhere {
  onFilter: (event: DataTableFilterParams) => void
  filters: any
}

const reactPrimeFilterMatchModeToHasuraStringOpration: Record<
  DataTableFilterMatchModeType,
  string
> = {
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
}
const reactPrimeFilterMatchModeToHasuraEqualityOpration: Record<
  DataTableFilterMatchModeType,
  string
> = {
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
}

//Need to add sortable to your columns <Column field="..." sortable />
export default function useDataTableWhere(args: {
  queryArgsAtom: PrimitiveAtom<UseDataTableQueryArgsAtom>
  gqlConfig?: HasuraDataConfig
}) {
  const [queryArgs, setQueryArgs] = useAtom(args.queryArgsAtom)
  const [lastEvent, setLastEvent] = useState<DataTableFilterParams>()

  const onFilter = (event: DataTableFilterParams) => {
    const columnNames = Object.keys(event.filters)

    const whereClause = columnNames.reduce((where, columnName) => {
      const fieldScalarType =
        args.gqlConfig?.fields?.fieldSimpleMap?.[columnName]?.typeName || '';

      const isStringBasedSearch = ['String', 'citext'].includes(fieldScalarType);

      const matchMode = event.filters[columnName].matchMode
      const operationStr = isStringBasedSearch
        ? reactPrimeFilterMatchModeToHasuraStringOpration[matchMode]
        : reactPrimeFilterMatchModeToHasuraEqualityOpration[matchMode];

      return {
        ...where,
        [columnName]: {
          [operationStr]: `${
            isStringBasedSearch && ['contains', 'endsWith'].includes(matchMode) ? '%' : ''
          }${event.filters[columnName].value}${
            isStringBasedSearch && ['contains', 'startsWith'].includes(matchMode) ? '%' : ''
          }`,
        },
      }
    }, {})

    setQueryArgs({
      ...queryArgs,
      where: whereClause,
    })
    setLastEvent(event)
  }

  return {
    onFilter,
    filters: lastEvent?.filters,
  }
}
