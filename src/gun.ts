import Gun from 'gun';
import React from 'react';

export const gun = Gun({
  localStorage: true,
});
export const gunContext = React.createContext(gun);
