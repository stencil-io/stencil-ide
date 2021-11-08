import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';
import { Theme } from "@mui/material/styles";
import Table from '@mui/material/Table';
import TableBody from '@mui/material//TableBody';
import TableCell from '@mui/material//TableCell';
import TableContainer from '@mui/material//TableContainer';
import TableHead from '@mui/material//TableHead';
import TableRow from '@mui/material//TableRow';
import Paper from '@mui/material//Paper';
import { FormattedMessage } from 'react-intl';

import { StencilClient } from '../context';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      minWidth: 650,
    },
    bold: {
      fontWeight: 'bold',
    },
    tableCell: {
      paddingTop: 0,
      paddingBottom: 0
    }
  }));



interface ArticleTableProps {
  site: StencilClient.Site,
  article: StencilClient.Article
}

const ArticleTable: React.FC<ArticleTableProps> = ({ site, article }) => {
  const classes = useStyles();
  const links: StencilClient.Link[] = Object.values(site.links).filter(link => link.body.articles.includes(article.id));

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" >
        <TableHead>
          <TableRow>
            <TableCell className={classes.bold} align="left"><FormattedMessage id="article.composer.parent"/></TableCell>
            <TableCell className={classes.bold} align="left"><FormattedMessage id="order"/></TableCell>
            <TableCell className={classes.bold} align="left"><FormattedMessage id="article.name"/></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map((link, index) => (
            <TableRow hover key={index}>
              <TableCell className={classes.tableCell} align="left">{article.body.parentId}</TableCell>
              <TableCell className={classes.tableCell} align="left">{article.body.order}</TableCell>
              <TableCell className={classes.tableCell} align="left">{article.body.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer >
  );
}

export { ArticleTable }




