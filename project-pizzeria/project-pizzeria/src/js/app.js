import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';


const app = {

  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    //console.log('idFromHash', idFromHash);

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks) {
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute*/
        const id = clickedElement.getAttribute('href').replace ('#', '');
        /* run thisApp.activatePage */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    //add class "active" to matching pages, remove non-matching
    for(let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    //add class "active" to matching links, remove non-matching
    for(let link of thisApp.navLinks) {
      link.classList.toggle (
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function() {
    const thisApp = this;
    //console.log('thisApp.data', thisApp.data);
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initData: function() {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        //console.log('parsedResponse', parsedResponse);

        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });
    //console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  init: function() {
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initData();
    thisApp.initCart();
    thisApp.initPages();
    //thisApp.initMenu();
    thisApp.initBooking();
    thisApp.initCarousel();
  },

  initCart: function() {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event) {
      app.cart.add(event.detail.product);
    });
  },

  initBooking: function() {
    const thisApp = this;

    const bookingWidget = document.querySelector(select.containerOf.booking);

    thisApp.booking = new Booking(bookingWidget);

  },

  initCarousel() {
    let slideIndex = 0;

    function showSlides() {
      const slides = document.querySelectorAll('.slide');
      const dots = document.querySelectorAll('.carousel-dot');
      //console.log(slides);
      //console.log(dots);
      for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
      }
      slideIndex++;
      //console.log(slideIndex);
      if (slideIndex > slides.length) {
        slideIndex = 1;
      }
      //console.log(slideIndex);
      for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
      }
      slides[slideIndex - 1].classList.add('active');
      dots[slideIndex - 1].classList.add('active');

      setTimeout(showSlides, 3000);
    }
    showSlides();
  }

};
app.init();
