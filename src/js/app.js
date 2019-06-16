window.onload = function() {

    class Contacts {
        constructor() {
            this.input = document.querySelectorAll('.inputmask');

            this.init();
        }

        init() {
            this.setMask();
        }

        setMask() {
            const masks = new Inputmask("+7 (\\919)-9999999");
            Array.from(this.input).forEach(input => {
                masks.mask(input);
            });
        }
    }

    class Header {
        constructor() {
            this.headerHeight = [];
            this.body = document.body;
            this.header = document.querySelector('.header');
            this.miniMenu = this.header.querySelector('.header__menu-mini');
            this.menuWrapper = this.header.querySelector('.header__menu-wrapper');
            this.burger = this.header.querySelector('.header__burger');
            this.close = this.header.querySelector('.header__close');
            this.continuousElements = document.getElementsByClassName('hash-block');
            this.up = this.header.querySelector('.header__link:first-of-type');
            this.links = this.header.querySelectorAll('.header__link:not(:first-of-type)');
            this.companyElement = this.body.querySelector('.company');
            this.init();
        }

        init() {
            window.addEventListener('scroll', this.setHeaderMini.bind(this));
            this.burger.addEventListener('click', this.openMenu.bind(this));
            this.close.addEventListener('click', this.closeMenu.bind(this));
            this.setHeaderMini();
            this.setActiveMenu();
            this.up.addEventListener('click', this.scrollTop);

            Array.from(this.links).forEach(link => {
               link.addEventListener('click', this.animateScroll);
            });
        }

        animateScroll(e) {
            e.preventDefault();
            const href = e.currentTarget.getAttribute('href');

            $('html, body').animate({
                scrollTop: `${$(href).offset().top}px`
            }, 700);
        }

        scrollTop(e) {
            e.preventDefault();
            $('body,html').animate({scrollTop:0}, 700);
        }

        setActiveMenu() {
            const links = this.header.querySelectorAll('.header__link:not(.header__link_top)');
            Array.from(this.continuousElements).forEach(item =>{
                this.point = new Waypoint({
                    element: item,
                    offset: 20,
                    handler: function(direction) {
                        let hash = this.element.id;

                        Array.from(links).forEach(link => {
                            const url = link.getAttribute('href');
                            if (url === `#${hash}`) {
                                link.classList.add('header__link_bold');
                                switch(direction) {
                                    case 'down':
                                        link.classList.add('header__link_active');
                                        break;
                                    case 'up':
                                        link.classList.remove('header__link_active');
                                        break;
                                    default:
                                        break;
                                }
                            } else {
                                link.classList.remove('header__link_bold');
                            }
                        })
                    }
                });
            });
        }

        openMenu() {
            this.miniMenu.classList.add('header__menu-mini_open');
            this.menuWrapper.classList.add('header__menu-wrapper_open');
        }

        closeMenu() {
            this.miniMenu.classList.remove('header__menu-mini_open');
            this.menuWrapper.classList.remove('header__menu-wrapper_open');
        }

        setHeaderMini() {
            this.headerHeight.push(this.header.offsetHeight);
            const screenHeight = this.companyElement.getBoundingClientRect().height + this.headerHeight[0];

            if (this.getScroll() > screenHeight) {
                this.body.style.marginTop = `${this.headerHeight[0]}px`;
                this.header.classList.add('header_scroll');
            } else {
                this.headerHeight = [];
                this.body.style.marginTop = 0;
                this.header.classList.remove('header_scroll');
            }
        }

        getScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return scrollTop;
        }
    };

    class Map {
        constructor() {
            this.init()
        }

        init() {
            this.initialMap();
        }

        initialMap() {
            const map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 52.726978, lng: 41.447103},
                zoom: 16,
                draggable: false,
                disableDefaultUI: true,
                scrollwheel: false,
                styles: [
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#e9e9e9"
                            },
                            {
                                "lightness": 17
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#f5f5f5"
                            },
                            {
                                "lightness": 20
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            },
                            {
                                "lightness": 17
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            },
                            {
                                "lightness": 29
                            },
                            {
                                "weight": 0.2
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            },
                            {
                                "lightness": 18
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            },
                            {
                                "lightness": 16
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#f5f5f5"
                            },
                            {
                                "lightness": 21
                            }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#dedede"
                            },
                            {
                                "lightness": 21
                            }
                        ]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "color": "#ffffff"
                            },
                            {
                                "lightness": 16
                            }
                        ]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "saturation": 36
                            },
                            {
                                "color": "#333333"
                            },
                            {
                                "lightness": 40
                            }
                        ]
                    },
                    {
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#f2f2f2"
                            },
                            {
                                "lightness": 19
                            }
                        ]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#fefefe"
                            },
                            {
                                "lightness": 20
                            }
                        ]
                    },
                    {
                        "featureType": "administrative",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "color": "#fefefe"
                            },
                            {
                                "lightness": 17
                            },
                            {
                                "weight": 1.2
                            }
                        ]
                    }
                ]
            });

            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(52.726978, 41.447103),
                map: map,
                icon: {
                    url: 'img/marker.png',
                    scaledSize: new google.maps.Size(87, 109)
                }
            });
        }
    };

    class Input {
        constructor() {
            this.inputs = document.querySelectorAll('.input-box__input:not(.inputmask)');
            if (this.inputs.length > 0) this.init();
        }

        init() {

            Array.from(this.inputs).forEach(input => {
               input.addEventListener('input', this.getValue);
                this.getInitailValue(input);
            });
        }

        getInitailValue(input) {
            if (input.value !== '') {
                input.classList.add('input-box__input_value');
            } else {
                input.classList.remove('input-box__input_value');
            }
        }

        getValue(e) {
            const input = e.target;

            if (input.value !== '') {
                input.classList.add('input-box__input_value');
            } else {
                input.classList.remove('input-box__input_value');
            }
        }
    };

    class Popup {
        constructor() {
            this.popup = document.querySelector('.popup');
            this.close = this.popup.querySelector('.popup__close');
            if (this.popup) this.init();
        }

        init() {
            this.close.addEventListener('click', this.closePopup.bind(this));
        }

        closePopup() {
            this.popup.classList.add('popup_close');
        }
    };

    class Button {
        constructor() {
            this.buttons = document.querySelectorAll('.button_pay');
            this.buttonsMap = document.querySelectorAll('.button_map');
            if (this.buttons.length > 0 || this.buttonsMap.length > 0) this.init();
        }

        init() {
            Array.from(this.buttons).forEach(button => {
                button.addEventListener('click', this.viewPopup);
            });

            Array.from(this.buttonsMap).forEach(button => {
                button.addEventListener('click', this.scrollToMap);
            });
        }

        scrollToMap(e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: `${$('#map').offset().top}px`
            }, 700);
        }

        viewPopup(e) {
            e.preventDefault();
            const popup = document.querySelector('.popup');

            if (popup.classList.contains('popup_close')) {
                popup.classList.remove('popup_close');
            }
        }
    };

    const popup = new Popup;
    const input = new Input;
    const map = new Map;
    const header = new Header;
    const contacts = new Contacts;
    const button = new Button;
};