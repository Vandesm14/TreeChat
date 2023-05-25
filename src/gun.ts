import Gun from 'gun';
import React from 'react';

export const gun = Gun({
  peers: ['http://mr.thedevbird.com:8080/gun'],
});
export const gunContext = React.createContext(gun);
