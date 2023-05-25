import { gunContext } from '../gun';
import { BreadcrumbProps, Icon } from '@blueprintjs/core';
import { Breadcrumbs2 } from '@blueprintjs/popover2';
import React from 'react';
import { MessageSchema } from '../../shared/messages';
import { useAtom } from 'jotai';
import { chatListPathAtom } from '../atoms';

function Path({ path }: { path: MessageSchema['id'][] }) {
  const gun = React.useContext(gunContext);
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbProps[]>([]);
  const [pathAtom, setPathAtom] = useAtom(chatListPathAtom);

  React.useEffect(() => {
    setBreadcrumbs(
      path
        .slice()
        .map((_, i, arr) => arr.slice(0, i + 1).join('/'))
        .map((el) => {
          return {
            text: el.split('/').reverse()[0],
            icon: 'folder-close',
            onClick: () => {
              setPathAtom([el]);
            },
          };
        })
    );
  }, [gun, path]);

  return (
    <Breadcrumbs2
      items={breadcrumbs}
      currentBreadcrumbRenderer={(props) => (
        <span>
          <Icon icon="folder-open" /> {props.text}
        </span>
      )}
    />
  );
}

export default Path;
