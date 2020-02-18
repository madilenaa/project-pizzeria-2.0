/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };
  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
    }

    renderInMenu() {
      const thisProduct = this;

      /* generate HTML based on template*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      /* create element using utils.createElementFromHTML*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /* add element do menu*/
      menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    }

    initAccordion() {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      console.log(clickableTrigger);

      /* START: click event listener to trigger */
      clickableTrigger.addEventListener('click', function(event) {
        console.log('clicked');

        /* prevent default action for event */
        event.preventDefault();

        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');

        /* find all active products */
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
        console.log('active Products:', activeProducts);

        /* START LOOP: for each active product */
        for (let activeProduct of activeProducts){

          /* START: if the active product isn't the element of thisProduct */
          if (activeProduct != thisProduct.element) {
            /* remove class active for the active product */
            activeProduct.classList.remove('active');
            /* END: if the active product isn't the element of thisProduct */
          }
        /* END LOOP: for each active product */
        }
      /* END: click event listener to trigger */
      });
    }

    initOrderForm(){
      const thisProduct = this;
      console.log('initOrderForm:', thisProduct);

      thisProduct.form.addEventListener('submit', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for(let input of thisProduct.formInputs) {
        input.addEventListener('change', function() {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event) {
        event.preventDefault();
        thisProduct.processOrder();
      });
      console.log('initOrderForm:', thisProduct);
    }

    processOrder() {
      const thisProduct = this;
      console.log('processOrder:', thisProduct);

      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);

      // wrote to variable price default price from thisProduct.data.price
      let price = thisProduct.data.price;
      console.log('price:', price);

      // start loop for params
      for (let paramId in thisProduct.data.params) {
        const param = thisProduct.data.params[paramId];
        console.log('param:', param);

        //start loop for every options param
        for (let optionId in param.options) {
          const option = param.options[optionId];
          console.log('option:', option);

          // if option ISN'T default, price is up
          if (formData.hasOwnProperty(paramId) && formData[paramId].includes(optionId) && !option.default) {
            price = price + param.options[optionId].price;
          }
          // if option IS default and ISN'T check, price is down (else if!)
          else if (!(formData.hasOwnProperty(paramId) && formData[paramId].includes(optionId)) && option.default) {
            price = price - param.options[optionId].price;
          }

          // make constant where are elements
          const optionImages = thisProduct.imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
          console.log('images:', optionImages );

          //if option is "check"  - add classNames.menuProduct.imageVisible
          if (formData.hasOwnProperty(paramId) && formData[paramId].includes(optionId)) {
            for (let images of optionImages) {
              images.classList.add(classNames.menuProduct.imageVisible);
            }
          }
          // if option isn't "check" - remove classNames.menuProduct.imageVisible
          else {
            for (let images of optionImages) {
              images.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
        }
      }
      //value variable price to thisProduct.priceElem
      thisProduct.priceElem.innerHTML = price;
    }
  }

  const app = {
    initMenu: function() {
      const thisApp = this;
      console.log('thisApp.data', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();

    },
  };

  app.init();
}
