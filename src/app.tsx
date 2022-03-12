import { render, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const App = () => {
  return (
    <h1>Hello World!</h1>
  );
};

render(<App />, document.body);