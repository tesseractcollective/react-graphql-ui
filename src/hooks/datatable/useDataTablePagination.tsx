import { IUseInfiniteQueryManyResults } from '@tesseractcollective/react-graphql'
import { PrimitiveAtom, useAtom } from 'jotai'
import { DataTablePageParams, DataTableProps } from 'primereact/datatable'
import { Ripple } from 'primereact/ripple'
import React, { useEffect, useMemo, useState } from 'react'
import { UseDataTableQueryArgsAtom } from './useDataTable'

export interface DataTablePaginationProps<T> {
  paginator: DataTableProps['paginator']
  paginatorTemplate: DataTableProps['paginatorTemplate']
  rows: DataTableProps['rows']
  onPage: DataTableProps['onPage']
  totalRecords: number
  lazy: boolean
  first: number
  currentRows: T[]
  onRefresh?: () => void
}

export default function useDataTablePagination<T = any>(args: {
  queryManyState?: IUseInfiniteQueryManyResults<T>
  pageSize: number
  queryArgsAtom: PrimitiveAtom<UseDataTableQueryArgsAtom>
}): DataTablePaginationProps<T> {
  const [queryArgs, setQueryArgs] = useAtom(args.queryArgsAtom)

  const pageSize = args.pageSize

  useEffect(() => {
    if (queryArgs.pause) {
      setQueryArgs({
        pageSize,
      } as any)
    }
  }, [])

  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: pageSize,
    page: 0,
    totalRecords: 0,
  })

  const onPage = (event: DataTablePageParams) => {
    console.log(
      `~~~~~~~~~ onPage ~ event
      first: ${event.first}           page:${event.page}      
      pageCount:${event.pageCount}    rows:${event.rows}
~~~~~~~~~~~~~~~~~~~~~~~~~~~`
    )
    if (
      event.page >= lazyParams.page &&
      event.first + pageSize > (args.queryManyState?.items?.length || 0)
    ) {
      args.queryManyState?.loadNextPage()
    }
    setLazyParams({
      ...lazyParams,
      ...event,
    })
  }

  const onRefresh = () => {
    args.queryManyState?.refresh();
  };

  useEffect(() => {
    setLazyParams({
      ...lazyParams,
      totalRecords: args.queryManyState?.totalItems || 0,
    })
  }, [args.queryManyState?.totalItems])

  const template1 = {
    layout: 'PrevPageLink CurrentPageReport NextPageLink',
    FirstPageLink: (options: any) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <i className="pi pi-angle-double-left"></i>
          <Ripple />
        </button>
      )
    },
    PrevPageLink: (options: any) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <div>Previous</div>
          <Ripple />
        </button>
      )
    },
    NextPageLink: (options: any) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <div>Next</div>
          <Ripple />
        </button>
      )
    },
    LastPageLink: (options: any) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <i className="pi pi-angle-double-right"></i>
          <Ripple />
        </button>
      )
    },
    PageLinks: (options: any) => {
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        const className = { ...options.className, 'p-disabled': true }

        return (
          <span className={className} style={{ userSelect: 'none' }}>
            ...
          </span>
        )
      }

      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
        >
          {options.page + 1}
          <Ripple />
        </button>
      )
    },
    CurrentPageReport: (options: any) => {
      return (
        <span
          style={{
            color: 'var(--text-color)',
            userSelect: 'none',
            width: '120px',
            textAlign: 'center',
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      )
    },
  }

  const currentRows = useMemo(() => {
    const startIndex = lazyParams.first
    const endIndex = lazyParams.first + pageSize

    return args.queryManyState?.items.slice(startIndex, endIndex) ?? []
  }, [lazyParams, args.queryManyState?.items])

  return {
    paginator: true,
    //@ts-ignore
    paginatorTemplate: template1,
    rows: args.pageSize,
    onPage,
    totalRecords: lazyParams.totalRecords,
    lazy: true,
    loading: args.queryManyState?.queryState?.fetching,
    first: lazyParams.first,
    currentRows,
    onRefresh,
    // rowsPerPageOptions: [50],
  }
}
