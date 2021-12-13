import React from 'react';
import { useTheme } from '@mui/styles';
import {
  Card, CardHeader, CardActions, CardContent, Theme,
  Typography, Box, Divider
} from '@mui/material';

import { FormattedMessage, useIntl } from 'react-intl';
import StencilStyles from './styles';

import { ArticleComposer } from './article';
import { LinkComposer } from './link';
import { WorkflowComposer } from './workflow';
import { LocaleComposer } from './locale';
import { ReleaseComposer } from './release';
import { NewPage } from './page';
import { MigrationComposer } from './migration';
import { TemplateComposer } from './template';

import { Composer, StencilClient, Layout } from './context';


interface CardData {
  type: CardType;
  title: string;
  desc: string;
  buttonCreate: string;
  buttonViewAll?: string;
  buttonTertiary?: string;
  color: string;
  onView?: () => void;
  composer: (handleClose: () => void) => React.ReactChild;
  //viewer: (() => void) => xxx;
}

type CardType = "release" | "article" | "page" | "link" | "workflow" | "locale" | "migration" | "templates";

const createCards: (site: StencilClient.Site, theme: Theme, layout: Layout.Session.ContextType) => CardData[] = (_site, theme, layout) => ([
  {
    composer: (handleClose) => (<ArticleComposer onClose={handleClose} />),
    onView: () => layout.actions.handleTabAdd({ id: 'articles', label: "Articles" }),
    title: "activities.article.title",
    desc: "activities.article.desc",
    color: theme.palette.article?.main,
    type: "article",
    buttonCreate: "article.create",
    buttonViewAll: undefined
  },
  {
    composer: (handleClose) => (<NewPage onClose={handleClose} />),
    onView: () => console.log("nothing to see here"),
    title: "activities.page.title",
    desc: "activities.page.desc",
    color: theme.palette.page?.main,
    type: "page",
    buttonCreate: "page.create",
    buttonViewAll: undefined
  },
  {
    composer: (handleClose) => (<LinkComposer onClose={handleClose} />),
    onView: () => layout.actions.handleTabAdd({ id: 'links', label: "Links" }),
    title: "activities.link.title",
    desc: "activities.link.desc",
    color: theme.palette.link?.main,
    type: "link",
    buttonCreate: "link.create",
    buttonViewAll: undefined
  },

  {
    composer: (handleClose) => (<WorkflowComposer onClose={handleClose} />),
    onView: () => layout.actions.handleTabAdd({ id: 'workflows', label: "Workflows" }),
    title: "services",
    desc: "services.desc",
    color: theme.palette.workflow?.main,
    type: "workflow",
    buttonCreate: "services.create",
    buttonViewAll: undefined
  },

  {
    composer: (handleClose) => (<LocaleComposer onClose={handleClose} />),
    onView: () => layout.actions.handleTabAdd({ id: 'locales', label: "Locales" }),
    title: "activities.locale.title",
    desc: "activities.locale.desc",
    color: theme.palette.locale?.main,
    type: "locale",
    buttonCreate: "locale.create",
    buttonViewAll: "button.view.all.locales"
  },

  {
    composer: (handleClose) => (<ReleaseComposer onClose={handleClose} />),
    onView: () => layout.actions.handleTabAdd({ id: 'releases', label: "Releases" }),
    title: "activities.release.title",
    desc: "activities.release.desc",
    color: theme.palette.release?.main,
    type: "release",
    buttonCreate: "release.create",
    buttonViewAll: "button.view.all.releases",
    buttonTertiary: "button.releasegraph"
  },
  {
    composer: (handleClose) => <TemplateComposer onClose={handleClose}/>,
    onView: () => layout.actions.handleTabAdd({ id: 'templates', label: "Templates" }),
    title: "activities.templates.title",
    desc: "activities.templates.desc",
    color: theme.palette.release?.main,
    type: "templates",
    buttonCreate: "template.create",
    buttonViewAll: "button.view.all.templates"
  },
  {
    composer: (handleClose) => <MigrationComposer onClose={handleClose} />,
    onView: undefined,
    title: "activities.migration.title",
    desc: "activities.migration.desc",
    color: theme.palette.release?.main,
    type: "migration",
    buttonCreate: "migration.create",
    buttonViewAll: undefined
  },

]);

const ActivitiesViewItem: React.FC<{ data: CardData, onCreate: () => void }> = (props) => {
  const title = useIntl().formatMessage({ id: props.data.title })
  const layout = Composer.useLayout();
  return (

    <Card sx={{
      margin: 3,
      width: '20vw',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <CardHeader sx={{ p: 1, backgroundColor: "table.main" }}
        title={
          <Box display="flex"
            sx={{
              justifyContent: 'center',
            }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', p: 1 }}>{title}</Typography>
          </Box>
        }
      />

      <CardContent sx={{ flexGrow: 1, p: 2, height: 'fit-content' }}>
        <Typography color="mainContent.contrastText" variant="body2"><FormattedMessage id={props.data.desc} /></Typography>
      </CardContent>
      <Divider />
      
      <CardActions sx={{ alignSelf: "flex-end" }}>
        <Box display="flex">
          {props.data.buttonViewAll && props.data.onView ? <StencilStyles.SecondaryButton onClick={props.data.onView} label={props.data.buttonViewAll} /> : <Box />}
          {props.data.buttonTertiary && props.data.onView ?
            <StencilStyles.SecondaryButton label="button.releasegraph" onClick={() => layout.actions.handleTabAdd({ id: 'graph', label: "Release Graph" })}
              sx={{
                color: "uiElements.main",
                alignSelf: 'center',
              }} /> : null}
          <StencilStyles.PrimaryButton onClick={props.onCreate} label={props.data.buttonCreate} />
        </Box>
      </CardActions>
    </Card>
  )
}


//card view for all CREATE views
const ActivitiesView: React.FC<{}> = () => {
  const theme = useTheme();
  const layout = Composer.useLayout();
  const { site } = Composer.useComposer();

  const [open, setOpen] = React.useState<number>();
  const handleClose = () => setOpen(undefined);
  const cards = React.useMemo(() => createCards(site, theme, layout), [site, theme, layout]);

  return (
    <>
      <Typography variant="h3" fontWeight="bold" sx={{ p: 1, m: 1 }}><FormattedMessage id={"activities.title"} />
        <Typography variant="body2" sx={{pt: 1}}><FormattedMessage id={"activities.desc"} /></Typography>
      </Typography>
      <Box sx={{
        margin: 1,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',

      }}>
        {open === undefined ? null : (cards[open].composer(handleClose))}
        {cards.map((card, index) => (<ActivitiesViewItem key={index} data={card} onCreate={() => setOpen(index)} />))}
      </Box>

    </>
  );
}

export { ActivitiesView }
