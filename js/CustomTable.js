import React from 'react';
import ResponsiveTable from 'material-ui-next-responsive-table'

export function IHRTable(props) {
    const {showPagination, data, columns, pageNumber, pageSize} = props;

    if (pageSize) {
        const [page, setPage] = React.useState(showPagination ? pageNumber : 0);
        const [rowsPerPage] = React.useState(pageSize);
        const handleChangePage = (event, newPage) => {
            setPage(newPage);
        };
        return (<ResponsiveTable
            columns={columns}
            data={data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
            noContentText={Liferay.Language.get('global.message.noContent')}

            showPagination={showPagination}
            page={page}
            rowsPerPage={rowsPerPage}
            count={data.length}
            onChangePage={handleChangePage}

        />)
    } else {
        const size = data.length;
        return (<ResponsiveTable
            columns={columns}
            data={data}
            noContentText={Liferay.Language.get('global.message.noContent')}
            page={size}
            rowsPerPage={size}
            count={size}
        />)
    }
}
