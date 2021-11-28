import React from 'react';
import { Box, Typography, TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { styled } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';
import TranslateIcon from '@mui/icons-material/Translate';

import { FormattedMessage, useIntl } from 'react-intl';

import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ConstructionIcon from '@mui/icons-material/Construction';

import StencilStyles from '../../styles';
import { Composer } from '../../context';


//color: theme.palette.explorerItem.dark,
//backgroundColor: theme.palette.explorer.main,
const TextFieldRoot = styled(TextField)<TextFieldProps>(({ theme }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(1),
  color: theme.palette.explorerItem.dark,
  backgroundColor: theme.palette.explorer.main,
  '& .MuiOutlinedInput-input': {
    color: theme.palette.explorerItem.main,
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.explorerItem.dark,
    },
  },
  '& .MuiFormLabel-root': {
    color: theme.palette.explorerItem.main,
  },
  '& .MuiFormHelperText-root': {
    color: theme.palette.explorerItem.main,
    marginLeft: 0
  }
}));

const findMainId = (values: string[]) => {
  const result = values.filter(id => !id.endsWith("-nested"));
  if (result.length) {
    return result[0];
  }
  return undefined;
}


const LinkItem: React.FC<{ view: Composer.LinkView, searchResult: Composer.SearchResult }> = ({ view }) => {
  return (
    <>
      <StencilStyles.TreeItem
        nodeId={view.link.id}
        labelText={view.link.body.value}
        labelcolor="link"
        labelIcon={LinkIcon}>
      </StencilStyles.TreeItem>
    </>)
}

const WorkflowItem: React.FC<{ view: Composer.WorkflowView, searchResult: Composer.SearchResult }> = ({ view }) => {
  return (
    <>
      <StencilStyles.TreeItem
        nodeId={view.workflow.id}
        labelText={view.workflow.body.value}
        labelcolor="workflow"
        labelIcon={view.workflow.body.devMode ? ConstructionIcon : AccountTreeOutlinedIcon}>
      </StencilStyles.TreeItem>
    </>)
}

const ArticleItem: React.FC<{ view: Composer.ArticleView, searchResult: Composer.SearchResult }> = ({ view, searchResult }) => {
  const items: React.ReactElement[] = [];

  let index = 1;
  for (const match of searchResult.matches) {
    if (match.type === 'ARTICLE_NAME') {
      items.push(<StencilStyles.TreeItem
        key={index++}
        nodeId={`${view.article.id}-nested`}
        labelText="article name was matched"
        labelcolor="article"
        labelIcon={TranslateIcon}>
      </StencilStyles.TreeItem>)
    } else {
      const pageView = view.pages.filter(p => p.page.id === match.id)[0]; 
      items.push(<StencilStyles.TreeItem
        key={index++}
        nodeId={`${pageView.page.id}-nested`}
        labelText={pageView.title}
        labelcolor="page"
        labelIcon={TranslateIcon}>
      </StencilStyles.TreeItem>)
    }
  }
  return (
    <StencilStyles.TreeItem
      nodeId={`${view.article.id}`}
      labelText={view.article.body.name}
      labelcolor="article"
      labelIcon={ArticleOutlinedIcon}>
      {items}
    </StencilStyles.TreeItem>
  )

}



const SearchExplorer: React.FC<{}> = () => {
  const { session } = Composer.useComposer();
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const intl = useIntl();
  const [searchString, setSearchString] = React.useState("");

  const articles = session.search.filterArticles(searchString)
    .map(result => (<ArticleItem key={result.source.id} view={session.getArticleView(result.source.id)} searchResult={result} />));

  const workflows = session.search.filterWorkflows(searchString)
    .map(result => (<WorkflowItem key={result.source.id} view={session.getWorkflowView(result.source.id)} searchResult={result} />));

  const links = session.search.filterLinks(searchString)
    .map(result => (<LinkItem key={result.source.id} view={session.getLinkView(result.source.id)} searchResult={result} />));


  return (
    <Box>
      <TextFieldRoot fullWidth
        variant="outlined"
        label={<FormattedMessage id="search.field.label" />}
        type="string"
        focused
        placeholder={intl.formatMessage({ id: "search.field.placeholder" })}
        value={searchString}
        onChange={({ target }) => setSearchString(target.value as any)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'explorerItem.dark' }} />
            </InputAdornment>
          ),
        }} />

      <Typography align="left"
        sx={{
          fontVariant: 'all-petite-caps',
          fontWeight: 'bold',
          color: 'explorerItem.main',
          ml: 1, mr: 1, mb: 1,
          borderBottom: '1px solid'
        }}>
        <FormattedMessage id="search.results.title" />
      </Typography>

      <TreeView expanded={expanded}
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        onNodeToggle={(_event: React.SyntheticEvent, nodeIds: string[]) => {
          const active = findMainId(expanded);
          const newId = findMainId(nodeIds.filter(n => n !== active));
          if (active !== newId && active && newId) {
            nodeIds.splice(nodeIds.indexOf(active), 1);
          }
          setExpanded(nodeIds);
        }}>

        {articles}
        {workflows}
        {links}
      </TreeView>
    </Box>
  );
}

export { SearchExplorer }

