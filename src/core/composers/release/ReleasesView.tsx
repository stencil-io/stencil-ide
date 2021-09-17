import React from 'react';
import {
  makeStyles, Avatar, Theme, Box, createStyles, Typography, IconButton, Table, TableBody, 
  TableCell, TableContainer, TableRow, TableHead
} from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import GetAppIcon from '@material-ui/icons/GetApp';
import { FormattedMessage, useIntl } from 'react-intl';

import { API, Ide } from '../../deps';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 650,
    },
    bold: {
      fontWeight: 'bold'
    },
    title: {
      margin: theme.spacing(1),
      color: theme.palette.text.primary
    },
    avatar: {
      alignSelf: "center",
      marginLeft: theme.spacing(1),
      backgroundColor: theme.palette.release.main,
      textTransform: 'uppercase'
    }
  }));

const useRowStyles = makeStyles((theme: Theme) =>
  createStyles({
    row: {
      '& > *': {
        padding: 0,
      },
    },
    expandRow: {
      width: "30px"
    },
    bold: {
      fontWeight: 'bold',
    },
    column: {
      width: '25%',
      fontWeight: 'bold',
      padding: 0
    },
    iconButton: {
      padding: 2,
      color: theme.palette.release.main,
      "&:hover, &.Mui-focusVisible": {
        backgroundColor: theme.palette.release.main,
        color: theme.palette.background.paper,
        "& .MuiSvgIcon-root": {
          color: theme.palette.background.paper,
        }
      }
    },
  }));


const ReleasesView: React.FC<{}> = () => {
  const classes = useStyles();
  const releases = Object.values(Ide.useSite().releases);
  const title = useIntl().formatMessage({ id: "releases" });

  return (
    <>
      <Box display="flex">
        <Avatar className={classes.avatar}>{title.substring(0, 2)}</Avatar>
        <Typography variant="h3" className={classes.title}><FormattedMessage id="releases" />: {releases.length}</Typography>
      </Box>

      <Typography variant="h3" className={classes.title}><FormattedMessage id="releases" /> </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.bold} align="left" colSpan={2}><FormattedMessage id="tag" /></TableCell>
              <TableCell className={classes.bold} align="left"><FormattedMessage id="created" /></TableCell>
              <TableCell className={classes.bold} align="left"><FormattedMessage id="release.composer.note" /></TableCell>
              <TableCell className={classes.bold} align="center"><FormattedMessage id="download" /></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {releases.map((release, index) => (<Row key={index} release={release} />))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}


const Row: React.FC<{ release: API.CMS.Release }> = ({ release }) => {
  const classes = useRowStyles();

  return (
    <>
      <TableRow key={release.id} hover className={classes.row}>
        <TableCell className={classes.expandRow}></TableCell>
        <TableCell align="left">{release.body.name}</TableCell>
        <TableCell align="left">{release.created}</TableCell>
        <TableCell align="left">{release.body.note}</TableCell>
        <TableCell align="center">
          <IconButton className={classes.iconButton}><GetAppIcon /> </IconButton>
        </TableCell>
      </TableRow>
    </>
  )
}

export { ReleasesView }




