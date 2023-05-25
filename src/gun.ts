import Gun from 'gun';
import React from 'react';

const GunURL = `${window.location.protocol}//${window.location.hostname}:8080/gun`;

console.log(`Connecting to ${GunURL}`);

export const gun = Gun({
  peers: [GunURL],
});
export const gunContext = React.createContext(gun);
