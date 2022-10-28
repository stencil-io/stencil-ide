import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

interface Release {
    id: string;
    body: {
        name: string;
        note?: string;
        created: string;
        data?: string;
    };
}

interface ReleasesTableProps {
    releases: Release[];
    tableRowComponent: React.FC<{
        release: Release;
    }>;
}


const ReleasesTable: React.FC<ReleasesTableProps> = ({ releases, tableRowComponent: TableRowComponent }) => {

    type sortOptions = 'name' | 'created' ;
    type sortDirections = 'asc' | 'desc';
    const [sort, setSort] = React.useState<sortOptions>('name');
    const [direction, setDirection] = React.useState<sortDirections>('desc');

    const sortByParam = (param: sortOptions, dir: sortDirections) => {
        switch (param) {
            case 'name':
                releases.sort((a, b) => {
                    const nameA = a.body.name;
                    const nameB = b.body.name;
                    return (dir === 'asc') ? (nameA.localeCompare(nameB)) : (nameB.localeCompare(nameA));
                });
                break;
            case 'created':
                releases.sort((a, b) =>{
                    const dateA = new Date(a.body.created);
                    const dateB = new Date(b.body.created);
                    console.log(dateA)
                    return (dir === 'asc') ? (dateA.getTime() - dateB.getTime()) : (dateB.getTime() - dateA.getTime());
                });
                break;
            default:
                break;
        }
    };

    const sortByName = () => {
        setSort('name');
        setDirection((direction === 'asc') ? 'desc' : 'asc');
    }

    const sortByCreated = () => {
        setSort('created');
        setDirection((direction === 'asc') ? 'desc' : 'asc');
    }

    sortByParam(sort, direction);

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ p: 1 }}>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            <TableSortLabel active={sort === 'name'} direction={direction} onClick={() => sortByName()}>
                                <FormattedMessage id="releases.view.tag" />
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            <TableSortLabel active={sort === 'created'} direction={direction} onClick={() => sortByCreated()}>
                                <FormattedMessage id="releases.view.created" />
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}><FormattedMessage id="releases.view.note" /></TableCell>
                        <TableCell align="center"><FormattedMessage id="releases.view.download" /></TableCell>
                        <TableCell align="right" sx={{ width: "30px" }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {releases.map((release, index) => (<TableRowComponent key={index} release={release} />))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

declare namespace ReleasesTableBurger {
    export type { Release, ReleasesTableProps };
    export { ReleasesTable };
}
export { ReleasesTableBurger };
