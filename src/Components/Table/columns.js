/* *     name , team name, position, statType, marketSuspended, low, high
 *     Davis, LAL,        SF,      points,     0 ,             20    30   
 */
import { ColumnFilter } from "./ColumnFilter";

export const COLUMNS = [
    {
        Header: 'No.',
        Footer: 'No.',
        accessor: 'number',
        Filter: <div />
    },
    {
        Header: 'Name',
        Footer: 'Name',
        accessor: 'name',
        Filter: <div />
    },
    {
        Header: 'Team Name',
        Footer: 'Team Name',
        accessor: 'teamName',
        Filter: <div />
    },{
        Header: 'Position',
        Footer: 'Position',
        accessor: 'position',
        Filter: ColumnFilter,
        disableGlobalFilter: true,
    },{
        Header: 'Stat Type',
        Footer: 'Stat Type',
        accessor: 'statType',
        Filter: ColumnFilter,
        disableGlobalFilter: true,
    },{
        Header: 'Market Status',
        Footer: 'Market Status',
        accessor: 'marketSuspended',
        Filter: <div />,
        disableGlobalFilter: true,
    },{
        Header: 'Low',
        Footer: 'Low',
        accessor: 'low',
        Filter: <div />,
        disableGlobalFilter: true,
    },
    {
        Header: 'High',
        Footer: 'High',
        accessor: 'high',
        Filter: <div />,
        disableGlobalFilter: true,
    },
    {
        Header: 'Change Market Status',
        Footer: 'Change Market Status',
        accessor: 'updateStatus',
        Filter: <div /> ,
        disableGlobalFilter: true,
    }
]