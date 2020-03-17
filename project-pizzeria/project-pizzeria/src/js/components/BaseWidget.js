//import {select, templates} from '../settings.js';
//import AmountWidget from './AmountWidget.js';

class BaseWidget {
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
  }

  get value() {
    const thisWidget = this;

    return thisWidget.correctValue;
  }

  set value(value) {
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value);

    /* TO DO: Add validation */
    if (newValue != thisWidget.correctValue && thisWidget.isValid(newValue)) {

      thisWidget.correctValue = newValue;
      this.announce();
    }
    thisWidget.renderValue();
  }

  setValue(value) {
    const thisWidget = this;

    thisWidget.value = value;
  }

  parseValue(value){
    //const thisWidget = this;
    return parseInt(value);
  }

  isValid(value) {
    //const thisWidget = this;
    return !isNaN(value);
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }

}
export default BaseWidget;
