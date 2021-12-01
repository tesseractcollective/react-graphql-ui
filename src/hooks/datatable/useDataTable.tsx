import {
  HasuraDataConfig,
  IUseInfiniteQueryMany,
  IUseInfiniteQueryManyResults,
  MutateState,
  useReactGraphql,
} from '@tesseractcollective/react-graphql';
import { atom, PrimitiveAtom } from 'jotai';
import { Button } from 'primereact/button';
import { Column, ColumnProps } from 'primereact/column';
import { DataTableProps } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import queryString from 'query-string';
import React, { ReactNode, useMemo, useState } from 'react';
import FlexForm, { IFlexFormProps } from '../../components/flexForm/FlexForm';
import useDataTableColumns, { ColumnFromConfig } from './useDataTableColumns';
import useDataTableOrderBy, {
  UseDataTableOrderby,
} from './useDataTableOrderBy';
import useDataTablePagination, {
  DataTablePaginationProps,
} from './useDataTablePagination';
import useDataTableWhere, { UseDataTableWhere } from './useDataTableWhere';

export interface UseDataTableQueryArgsAtom
  extends Partial<IUseInfiniteQueryMany> {}

export type ColumnFilterMatchModeTypeForEquality =
  | 'equals'
  | 'notEquals'
  | 'in'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte';
export type ColumnFilterMatchModeTypeForString =
  | 'startsWith'
  | 'contains'
  | 'endsWith'
  | 'equals'
  | 'notEquals'
  | 'in'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte';
export interface ColumnPropsForEquality extends ColumnProps {
  gqlScalarType?:
    | 'ID'
    | 'float8'
    | 'Boolean'
    | 'Int'
    | 'Float'
    | 'bigint'
    | 'jsonb'
    | 'timestamp'
    | 'timpestamptz'
    | 'uuid';
  filterMatchMode?: ColumnFilterMatchModeTypeForEquality;
}
export interface ColumnPropsForString extends ColumnProps {
  gqlScalarType?: 'String' | 'citext';
  filterMatchMode?: ColumnFilterMatchModeTypeForString;
}

export interface UseDataTableArgs<T> {
  gqlConfig: HasuraDataConfig;
  queryManyState?: IUseInfiniteQueryManyResults<T>;
  pageSize?: number;
  insert?: 'toolBarLeft' | 'toolBarRight' | 'manual';
  update?: boolean;
  delete?: boolean;
  upsert?: {
    upsertGqlConfig?: HasuraDataConfig;
    upsertFlexFormProps?: Partial<IFlexFormProps>;
  };
  /**
   * Override the key used to identify the item in the confirmation dialog
   */
  deleteMessageKey?: string;
  /**
   * Generated custom confirmation message using item information
   */
  deleteMessageGenerator?: (row?: any) => string;
  /** Overrides the primary key field name. (default name: id) Only useful if setIdInQueryOnClick is true.*/
  primaryKeyName?: string;
  queryArgsAtom?: PrimitiveAtom<UseDataTableQueryArgsAtom>;
  sortable?: boolean;
  filterable?: boolean;
  columnProps?: Record<string, ColumnPropsForEquality | ColumnPropsForString>;
  onRowClick?: (path: string) => void;
}

const backupAtom = atom({});

const defaultPageSize = 20;

export default function useDataTable<T = Record<string, any>>(
  args: UseDataTableArgs<T>
): {
  dataTableProps: Record<string, any>;
  columns: ColumnFromConfig[];
  paginationProps: DataTablePaginationProps<T>;
  orderByProps: UseDataTableOrderby;
  filterProps: UseDataTableWhere;
  toolbar: ReactNode;
  insertButton: ReactNode;
  actionColumn: ReactNode;
  dialogs: ReactNode[];
  selectedRow: any;
  setSelectedRow: (row?: any) => void;
  hideUpsertDialog: () => void;
  hideDeleteDialog: () => void;
} {
  const { gqlConfig, queryManyState } = args;
  const needsActionColumn = args.update || args.delete;
  const [selectedRow, setSelectedRow] = useState<T | undefined | null>();

  const pageSize = args.pageSize || defaultPageSize;

  const paginationProps = useDataTablePagination({
    queryManyState: queryManyState,
    pageSize: pageSize,
    queryArgsAtom: args.queryArgsAtom || backupAtom,
  });

  const orderByProps = useDataTableOrderBy({
    queryArgsAtom: args.queryArgsAtom || backupAtom,
  });
  const filterProps = useDataTableWhere({
    gqlConfig,
    queryArgsAtom: args.queryArgsAtom || backupAtom,
  });

  const tableProps = useMemo<Partial<DataTableProps>>(() => {
    let baseProps: Partial<DataTableProps> = {
      value: paginationProps.currentRows,
    };
    if (args.onRowClick) {
      baseProps = {
        ...baseProps,
        selectionMode: 'single',
        selection: selectedRow,
        onSelectionChange: (e) =>
          updateSelectRowInQuery(
            e.value[gqlConfig.primaryKey[0]],
            args.onRowClick
          ),
        dataKey: gqlConfig.primaryKey[0],
      };
    }
    return baseProps;
  }, [paginationProps.currentRows, selectedRow]);

  const columns = useDataTableColumns({
    gqlConfig,
    sortable: args.sortable,
    filterable: args.filterable,
    columnProps: args.columnProps,
  });

  //INSERT Logic
  const [showUpsertDialog, setShowUpsertDialog] = useState<null | 'insert' | 'update'>(null);

  const insertButton = useMemo(() => {
    if (!args.insert) {
      return;
    }
    return (
      <Button
        label="New"
        icon="pi pi-plus"
        className="p-button-success p-mr-2"
        onClick={() => setShowUpsertDialog('insert')}
      />
    );
  }, [args.insert]);

  const toolbarComponent = useMemo(() => {
    if (!args.insert || args.insert === 'manual') {
      return null;
    }
    if (args.insert === 'toolBarLeft') {
      return <Toolbar className="p-mb-4" left={insertButton}></Toolbar>;
    }
    if (args.insert === 'toolBarRight') {
      return <Toolbar className="p-mb-4" right={insertButton}></Toolbar>;
    }
  }, []);

  //actionColumn
  const onEdit = (rowData: any) => {
    setSelectedRow(rowData);
    setShowUpsertDialog('update');
  };
  const onDelete = (rowData: any) => {
    setSelectedRow(rowData);
    setShowDeleteDialog(true);
  };

  let deleteMutationState: MutateState;
  if (args.delete) {
    deleteMutationState = useReactGraphql(gqlConfig).useDelete({
      variables: {},
    });
  }
  const executeDeleteMutation = (row: any) =>
    deleteMutationState?.executeMutation?.(undefined, {
      [gqlConfig.primaryKey[0]]: row[gqlConfig.primaryKey[0]],
    });

  const actionColumnComponent = useMemo(() => {
    if (!needsActionColumn) {
      return null;
    }

    return (
      <Column
        className="w-24"
        body={(rowData: any) => {
          return (
            <React.Fragment>
              {args.update && (
                <span className={`${args.delete && args.update && 'mr-2'}`}>
                  <Button
                    icon="pi pi-pencil"
                    className={`p-button-rounded p-button-success`}
                    onClick={() => onEdit(rowData)}
                  />
                </span>
              )}
              {args.delete && (
                <span>
                  <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => onDelete(rowData)}
                  />
                </span>
              )}
            </React.Fragment>
          );
        }}
      ></Column>
    );
  }, [needsActionColumn]);

  //upsertDialog
  const upsertDialog = useMemo(() => {
    // Only include upsert dialog when updating or inserting is enabled
    if (!args?.update && !args?.insert) {
      return null;
    }

    return (
      <Dialog
        key="upsertDialog"
        visible={!!showUpsertDialog}
        style={{ width: '80%' }}
        header={selectedRow ? 'Edit' : 'New'}
        modal
        className="p-fluid"
        onHide={() => {
          setSelectedRow(undefined);
          setShowUpsertDialog(null);
        }}
      >
        <UpsertComponent
          gqlConfig={args.upsert?.upsertGqlConfig ?? args.gqlConfig}
          row={selectedRow}
          onSuccess={() => setShowUpsertDialog(null)}
          flexFormProps={{
            ...args.upsert?.upsertFlexFormProps,
            isNew: showUpsertDialog === 'insert'
          }}
        />
      </Dialog>
    );
  }, [needsActionColumn, selectedRow, showUpsertDialog, setShowUpsertDialog]);

  //deleteDialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteDialog = useMemo(() => {
    if (!args.delete || !selectedRow) {
      return null;
    }

    // use primaryKeyName if provided. Use the key from the config by default
    const pkName = args.primaryKeyName ?? gqlConfig.primaryKey[0];

    //Doing this weird row copy thing because otherwise TS things selectedRow is of type unknown
    const rowTyped: Record<string, any> = selectedRow;
    const selectRowPk = rowTyped[pkName];

    return (
      <Dialog
        key="deleteDialog"
        visible={showDeleteDialog && !!selectedRow}
        style={{ width: '450px' }}
        header="Confirm"
        modal
        footer={() => (
          <React.Fragment>
            <Button
              label="No"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => {
                setSelectedRow(undefined);
                setShowDeleteDialog(false);
              }}
            />
            <Button
              label="Yes"
              icon="pi pi-check"
              className="p-button-text"
              onClick={() => {
                //Delete item
                executeDeleteMutation?.(selectedRow);
                setSelectedRow(undefined);
                setShowDeleteDialog(false);
              }}
            />
          </React.Fragment>
        )}
        onHide={() => {
          setSelectedRow(undefined);
          setShowDeleteDialog(false);
        }}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle p-mr-3"
            style={{ fontSize: '2rem' }}
          />
          <span>
            Are you sure you want to delete{' '}
            <b>
              {args.deleteMessageGenerator
                ? args.deleteMessageGenerator(selectedRow)
                : selectRowPk}
            </b>
            ?
          </span>
        </div>
      </Dialog>
    );
  }, [
    args.delete,
    args.deleteMessageKey,
    args.deleteMessageGenerator,
    showDeleteDialog,
    selectedRow,
  ]);

  ///Order by
  return {
    dataTableProps: tableProps,
    columns,
    paginationProps,
    orderByProps,
    filterProps,
    toolbar: toolbarComponent,
    insertButton: insertButton,
    actionColumn: actionColumnComponent,
    dialogs: [upsertDialog, deleteDialog],
    selectedRow,
    setSelectedRow,
    hideUpsertDialog: () => {
      setSelectedRow(undefined);
      setShowUpsertDialog(null);
    },
    hideDeleteDialog: () => {
      setSelectedRow(undefined);
      setShowDeleteDialog(false);
    },
  };
}

type UpsertComponentProps = {
  gqlConfig: HasuraDataConfig;
  row: any;
  onSuccess: () => void;
  flexFormProps?: Partial<IFlexFormProps>;
};

function UpsertComponent({
  gqlConfig,
  row,
  onSuccess,
  flexFormProps,
}: UpsertComponentProps) {
  const api = useReactGraphql(gqlConfig);

  return (
    <FlexForm
      config={gqlConfig}
      api={api}
      isNew={!!row}
      onSuccess={onSuccess}
      {...flexFormProps}
    />
  );
}

function updateSelectRowInQuery(
  primaryKeyValue: string,
  onRowClick?: (path: string) => void,
  primaryKeyName = 'id'
) {
  const currentParams = queryString.parse(window.location.search);
  let nextParams: { [key: string]: any } = {};
  nextParams = { ...currentParams, [primaryKeyName]: primaryKeyValue };
  const queryStr = queryString.stringify(nextParams);
  if (onRowClick) {
    onRowClick(window.location.pathname + '?' + queryStr);
  }
}
