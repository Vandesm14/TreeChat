import { gunContext } from '../gun';
import { BreadcrumbProps, Icon } from '@blueprintjs/core';
import { Breadcrumbs2 } from '@blueprintjs/popover2';
import React from 'react';
import { MessageSchema, traverse } from '../../shared/messages';
import { useAtom } from 'jotai';
import { chatListPathAtom } from '../atoms';

function Path({ path }: { path: MessageSchema['id'][] }) {
  const gun = React.useContext(gunContext);
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbProps[]>([]);
  const [pathAtom, setPathAtom] = useAtom(chatListPathAtom);

  React.useEffect(() => {
    const newBreadcrumbs: [BreadcrumbProps, string][] = path
      .slice()
      .map((_, i, arr) => arr.slice(0, i + 1).join('/'))
      .map((el) => {
        return [
          {
            text: el.split('/').reverse()[0],
            icon: 'document',
            onClick: () => {
              setPathAtom(el.split('/'));
            },
          },
          el,
        ];
      });

    newBreadcrumbs.slice(1).forEach(([breadcrumb, path], i) => {
      traverse(gun, path.split('/')).once<MessageSchema>((message) => {
        if (!message || path.length <= 1) return;

        setBreadcrumbs((prev) =>
          prev.map((el, j) =>
            j === i + 1
              ? {
                  ...el,
                  text: message.text,
                }
              : el
          )
        );
      });
    });

    setBreadcrumbs(newBreadcrumbs.map((el) => el[0]));
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
