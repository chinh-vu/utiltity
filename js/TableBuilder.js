import React from 'react'
import {createColumns, createData} from './IHRTableConfigFactory';
import {IHRTable} from './IHRTable'
import moment from 'moment';

export function TableBuilder(props) {
    const {instructions, rawData, showPagination, pageNumber, pageSize, sortedColumn, isAscending} = props;

    let columns = createColumns(instructions);

    if (sortedColumn && sortedColumn['column'] && sortedColumn['dataType']) {
        const column = sortedColumn['column'];
        const columnType = sortedColumn['dataType'];

        let order = (!isAscending) ? 1 : -1;
        rawData.sort((a, b) => {
            if (a[column] === b[column])
                return 0;
            if (a[column] === undefined && b[column])
                return -1;
            else if (a[column] && b[column] === undefined)
                return 1;
            else {
                if (rawData && columnType === 'date') {
                    let date1 = moment(a[column]);
                    let date2 = moment(b[column]);
                    if (date1.isValid() && date2.isValid()) {
                        if (date1.isAfter(date2)) return order * (-1);
                        else if (date2.isAfter(date1)) return order;
                        return 0;
                    } else if (date1.isValid() && !date2.isValid()) {
                        return order * (-1);
                    } else if (!date1.isValid() && date2.isValid()) {
                        return order;
                    } else {
                        return 0;
                    }
                } else {
                    if (a[column] > b[column]) return order * (-1);
                    else if (a[column] < b[column]) return order;
                    else return 0;
                }
            }

        });
    }

    let data = createData(instructions, rawData);
    return (<CustomTable columns={columns}
                      data={data}
                      showPagination={data.length > pageSize}
                      pageNumber={pageNumber}
                      pageSize={pageSize}
    />)
}
