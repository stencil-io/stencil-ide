import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSnackbar } from 'notistack';

import { Composer, StencilClient } from '../context';
import Burger from '@the-wrench-io/react-burger';
import { Box } from '@mui/material';



const PageEdit: React.FC<{ onClose: () => void, articleId: StencilClient.ArticleId }> = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { service, actions, site } = Composer.useComposer();
  const articleId = props.articleId;
  // const [articleId, setArticleId] = React.useState('');
  const [pageId, setPageId] = React.useState('');
  const [newLocale, setNewLocale] = React.useState('');

  const handleUpdate = () => {
    const entity: StencilClient.PageMutator = { locale: newLocale, pageId, content: site.pages[pageId].body.content, devMode: site.pages[pageId].body.devMode };
    service.update().pages([entity]).then(_success => {
      enqueueSnackbar(message, { variant: 'success' });
      props.onClose();
      actions.handleLoadSite();
    })
  }
  const message = <FormattedMessage id="snack.page.savedMessage" />
  const articlePages: StencilClient.Page[] = Object.values(site.pages).filter(p => p.body.article === articleId);
  const usedLocales: StencilClient.LocaleId[] = articlePages.map(articlePage => articlePage.body.locale)
  const unusedLocales: StencilClient.SiteLocale[] = Object.values(site.locales).filter(siteLocale => !usedLocales.includes(siteLocale.id));

  const valid = pageId && articleId && newLocale;
  return (
    <Burger.Dialog open={true} onClose={props.onClose}
      backgroundColor="uiElements.main" 
      title="pages.change"
      submit={{ title: "button.update", onClick: handleUpdate, disabled: !valid }}>

      <>
        <FormattedMessage id='pages.change.info' />
        <Burger.Select
          selected={pageId}
          onChange={setPageId}
          label='pages.edit.selectpage'
          items={articlePages.map((articlePage) => ({
            id: articlePage.id,
            value: site.locales[articlePage.body.locale].body.value
          }))}
        />
        <Burger.Select
          selected={newLocale}
          onChange={setNewLocale}
          label='pages.edit.selectTargetLocale'
          items={unusedLocales.map((unusedLocale) => ({
            id: unusedLocale.id,
            value: unusedLocale.body.value
          }))}
        />
      </>
    </Burger.Dialog>
  );
}

const PageEditDev: React.FC<{ onClose: () => void, articleId: StencilClient.ArticleId }> = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { service, actions, site } = Composer.useComposer();
  const articleId = props.articleId;

  const message = <FormattedMessage id="snack.page.savedMessage" />
  const articlePages: StencilClient.Page[] = Object.values(site.pages).filter(p => p.body.article === articleId);

  const [pageId, setPageId] = React.useState(articlePages[0].id);
  const [devMode, setDevMode] = React.useState(site.pages[pageId].body.devMode || false);

  React.useEffect(() => {
    setDevMode(site.pages[pageId].body.devMode || false);
  }, [pageId]);

  const handleUpdate = () => {
    const entity: StencilClient.PageMutator = { locale: site.pages[pageId].body.locale, pageId, content: site.pages[pageId].body.content, devMode };
    console.log(entity)
    service.update().pages([entity]).then(_success => {
      enqueueSnackbar(message, { variant: 'success' });
      props.onClose();
      actions.handleLoadSite();
    })
  }

  const valid = pageId && articleId;
  return (
    <Burger.Dialog open={true} onClose={props.onClose}
      backgroundColor="uiElements.main" 
      title="pages.change.devmode"
      submit={{ title: "button.update", onClick: handleUpdate, disabled: !valid }}>

      <>
        <FormattedMessage id='pages.change.devmode.info' />
        <Burger.Select
          selected={pageId}
          onChange={setPageId}
          label='pages.edit.selectpage'
          items={articlePages.map((articlePage) => ({
            id: articlePage.id,
            value: site.locales[articlePage.body.locale].body.value
          }))}
        />
        {pageId.length > 0 && 
        <Box maxWidth="50%" sx={{ ml: 1 }}>
          <Burger.Switch
            checked={devMode}
            helperText="pages.devmode.helper"
            label="pages.devmode"
            onChange={setDevMode}
          />
        </Box>}
      </>
    </Burger.Dialog>
  );
}

export { PageEdit, PageEditDev };