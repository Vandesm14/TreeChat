import Gun from 'gun';
import React from 'react';

const GunURL = `${window.location.protocol}//${window.location.hostname}:8080/gun`;

console.log(`Connecting to ${GunURL}`);

export const gunConfig = {
  peers: [GunURL],
  localStorage: false,
};

export const gun = Gun(gunConfig);

// @ts-expect-error: I can do what I want
window.gun = gun;

export const gunContext = React.createContext(gun);
