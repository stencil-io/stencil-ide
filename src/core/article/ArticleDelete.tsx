import React from 'react';
import { DialogContentText } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { Composer, StencilClient } from '../context';
import { StyledDialog } from '../styles/StyledDialog';


interface ArticleDeleteProps {
  articleId: StencilClient.ArticleId;
  onClose: () => void;
}

const ArticleDelete: React.FC<ArticleDeleteProps> = ({ articleId, onClose }) => {
  const { service, actions } = Composer.useComposer();

  const handleDelete = () => {
    service.delete().article(articleId).then(_success => {
      onClose();
      actions.handleLoadSite();
    });
  }

  return (
    <StyledDialog open={true} onClose={onClose} 
      color="article.main" title="article.delete.title"
      submit={{ title: "button.delete", onClick: handleDelete, disabled: false }}>
      <DialogContentText>
        <FormattedMessage id="article.delete" />
      </DialogContentText>
    </StyledDialog>);
};
export { ArticleDelete };
