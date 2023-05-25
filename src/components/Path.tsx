import { GunDataNode, GunSchema, IGunInstance } from 'gun/types';
import { gunContext } from '../gun';
import React from 'react';
import { MessageSchema } from '../../shared/messages';

function findParent<T extends GunSchema>(
  gun: IGunInstance,
  id: string
): Promise<GunDataNode<T>> {
  return new Promise((res) =>
    gun
      .get('messages')
      .get(id)
      .back()
      .once<T>((val) => res(val))
  );
}

function find<T extends GunSchema>(
  gun: IGunInstance,
  id: string
): Promise<GunDataNode<T>> {
  return new Promise((res) =>
    gun
      .get('messages')
      .get(id)
      .once<T>((val) => res(val))
  );
}

/** Takes a message ID and returns a "/" separated path of it's location */
async function getBackPath(gun: IGunInstance, id: string) {
  const path = [id];

  let i = 0;
  let back = await find<MessageSchema>(gun, id);

  console.log('initial id', id);
  console.log('initial back', back);

  return '...';

  const MAX_ITERATIONS = 10;

  while (back && i < MAX_ITERATIONS) {
    if (i > MAX_ITERATIONS || back.id === 'root') break;

    console.log({ back, backId: back.id, path, id });

    if (back.id) path.push(back.id);
    back = await findParent<MessageSchema>(gun, back.id);

    i++;
  }

  return path.reverse().join('/');
}

function Path({ id }: { id: string }) {
  const gun = React.useContext(gunContext);
  const [path, setPath] = React.useState('');

  React.useEffect(() => {
    // getBackPath(gun, id).then((path) => setPath(path));
  }, [gun, id]);

  return <span>{id}</span>;
}

export default Path;
