import { HasuraDataConfig } from '@tesseractcollective/react-graphql'
import Case from 'case'
import _ from 'lodash'
import { Column, ColumnProps } from 'primereact/column'
import React, { ReactElement, useMemo } from 'react'

export interface ColumnFromConfig {
  key: string
  component: ReactElement
}

export default function useDataTableColumns(args: {
  gqlConfig: HasuraDataConfig
  sortable?: boolean
  filterable?: boolean
  columnProps?: Record<string, ColumnProps>
}): ColumnFromConfig[] {
  const { gqlConfig } = args

  const columns = useMemo(() => {
    const columnsArr: any[] = _.map(
      gqlConfig.fields?.fieldSimpleMap,
      (fieldOpts, key) => {
        let body
        if (fieldOpts.typeName === 'jsonb') {
          // if we're dealing with JSONB the column will break because it can't
          // render an object in a react component. So we'll prettyprint that for it
          body = (row: any) => JSON.stringify(row[fieldOpts.name], null, 2)
        }

        return {
          key,
          component: (
            <Column
              key={fieldOpts.name}
              field={fieldOpts.name}
              header={Case.sentence(fieldOpts.name)}
              sortable={args.sortable}
              filter={args.filterable}
              body={body}
              {...args.columnProps?.[fieldOpts.name]}
            />
          ),
        }
      }
    )
    return columnsArr
  }, [gqlConfig])

  return columns
}
