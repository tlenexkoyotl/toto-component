import {html, LitElement} from 'lit-element';
import style from './toto-component-styles.js';

import '@polymer/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icons/editor-icons';
import '@polymer/paper-input/paper-input';
import '@polymer/paper-button';
import '@polymer/paper-toast';
import '@fooloomanzoo/color-picker/color-picker';

class TotoComponent extends LitElement {
  static get properties() {
    return {
      canvas: {type: HTMLElement},
      canvasContext: {type: CanvasRenderingContext2D},
      paint: {type: Boolean},
      coordinates: {type: Array},
      horizontalOffset: {type: Number},
      verticalOffset: {type: Number}
    };
  }

  static get styles() {
    return style;
  }

  constructor() {
    super();
    this.__createCanvas();
    this.__getCanvasContext();
    this.__addCanvasListeners();
  }

  __createCanvas() {
    this.canvas = document.createElement('canvas');

    this.canvas.setAttribute('width', 1000);
    this.canvas.setAttribute('height', 500);
  }

  __getCanvasContext() {
    this.canvasContext = this.canvas.getContext('2d');
    this.paint = false;
    this.coordinates = [];
    this.canvasContext.strokeStyle = '#000000';
    this.canvasContext.lineJoin = 'round';
    this.canvasContext.lineWidth = 1;
  }

  __onMouseDown() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.paint = true;
      this.__addClick(e.pageX - this.horizontalOffset, e.pageY - this.verticalOffset);
      this.__redraw();
    });
  }

  __onMouseMove() {
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.paint) {
        this.__addClick(e.pageX - this.horizontalOffset, e.pageY - this.verticalOffset, true);
        this.__redraw();
      }
    });
  }

  __onMouseUp() {
    this.canvas.addEventListener('mouseup', () => {
      this.paint = false;
    });
  }

  __onMouseLeave() {
    this.canvas.addEventListener('mouseleave', () => {
      this.paint = false;
    });
  }

  __addCanvasListeners() {
    this.__onMouseDown();
    this.__onMouseMove();
    this.__onMouseUp();
  }

  __addClick(x, y, dragging) {
    this.coordinates = [...this.coordinates, {
      x: x,
      y: y,
      dragging: dragging,
      color: this.canvasContext.strokeStyle,
      width: this.canvasContext.lineWidth
    }];
  }

  __deleteCoordinates() {
    this.__clearCanvas();

    this.coordinates = [];
  }

  __clearCanvas() {
    this.canvasContext.clearRect(0,
      0,
      this.canvasContext.canvas.width,
      this.canvasContext.canvas.height);
  }

  __erase() {
    this.canvasContext.strokeStyle = '#ffffff';

    this.shadowRoot.querySelector('color-picker').value = this.canvasContext.strokeStyle;
  }

  __getColor(e) {
    this.canvasContext.strokeStyle = e.currentTarget.value;
  }

  __getWidth(e) {
    if (parseInt(e.currentTarget.value) > 100)
      e.currentTarget.value = 100;

    if (parseInt(e.currentTarget.value) < 1)
      e.currentTarget.value = 1;

    this.canvasContext.lineWidth = e.currentTarget.value;
  }

  __redraw() {
    this.__clearCanvas();

    for (const index in this.coordinates) {
      this.canvasContext.beginPath();

      if (this.coordinates[index].dragging && index)
        this.canvasContext.moveTo(this.coordinates[index - 1].x, this.coordinates[index - 1].y);
      else
        this.canvasContext.moveTo(this.coordinates[index].x - 1, this.coordinates[index].y);

      this.canvasContext.lineTo(this.coordinates[index].x, this.coordinates[index].y);
      this.canvasContext.closePath();
      this.canvasContext.strokeStyle = this.coordinates[index].color;
      this.canvasContext.lineWidth = this.coordinates[index].width;
      this.canvasContext.stroke();
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this.toast = document.createElement('paper-toast');
    this.toastButton = document.createElement('paper-button');
    this.toastButton.innerHTML = 'Go';

    this.toastButton.addEventListener('click', () => {
      this.toast.toggle();

      this.horizontalOffset = this.canvas.getBoundingClientRect().left - 5;
      this.verticalOffset = this.canvas.getBoundingClientRect().top - 19;
    });
    this.toast.appendChild(this.toastButton);
    this.toast.setAttribute('duration', 0);

    this.toast.verticalAlign = 'middle';
    this.toast.horizontalAlign = 'center';
    this.toast.text = 'Welcome!!!';

    this.toast.open();
  }

  render() {
    return html`
        <h2>Toto huhu</h2>
        ${this.toast}
        <div id="toolbar" class="toolbar">
            <div>
              <paper-input type="number" 
                  min="1" 
                  max="100" 
                  maxlength=3 
                  @change="${this.__getWidth}"
                  value="${parseInt(this.canvasContext.lineWidth)}">
                  <iron-icon icon="line-style" slot="prefix"></iron-icon>
              </paper-input>
              <color-picker @input-picker-closed="${this.__getColor}"
              value="${this.canvasContext.strokeStyle}"
              autoconfirm></color-picker>
            </div>
            <div>
              <iron-icon @click="${this.__erase}" icon="create" class="eraser"></iron-icon>
            </div>
            <div>
              <iron-icon icon="delete-sweep" @click="${this.__deleteCoordinates}"></iron-icon>
            </div>
        </div>
        <div id="canvas" class="canvas-container">
            ${this.canvas}
        </div>
      `;
  }
}

window.customElements.define("toto-component", TotoComponent);
