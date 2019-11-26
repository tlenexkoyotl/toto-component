import { css } from 'lit-element';

export default css`
:host {
  display: inline-block;
  box-sizing: border-box;
}

:host([hidden]), [hidden] {
  display: none !important;
}

*, *:before, *:after {
  box-sizing: inherit;
  font-family: inherit;
}

canvas {
  border: 10px;
  box-shadow: 10px 10px 5px #757575;
  cursor: url('/assets/pencil.png'), auto;
}

paper-input {
  width: 80px;
}

paper-toast {
  font-size: 80px;
  text-align: center;
  vertical-align: middle;
  width: 800px;
  height: 300px;
}

.eraser {
  color: #ff0000;
}

.toolbar {
  display: inline;
}
`;
