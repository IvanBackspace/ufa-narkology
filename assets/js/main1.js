Fancybox.bind("[data-fancybox]", {
    // Your custom options
});

// animation 
const animationItems = document.querySelectorAll('.animation-item');
if (animationItems.length > 0) {
    function onEntry(e) {
        e.forEach(e => {
            e.isIntersecting && e.target.classList.add("animation-active")
        }
        )
    }
    let options = {
        threshold: [.5]
    }, observer = new IntersectionObserver(onEntry, options)
    for (let e of animationItems)
        observer.observe(e);
}
// end animation

/* hide header */
let scrollWidthFunc = () => {
    let scrollWidth = window.innerWidth - document.body.clientWidth;
    document.querySelector('html').style.paddingRight = scrollWidth + 'px';
    if (window.innerWidth <= 1024) {
        document.querySelector('header').style.paddingRight = scrollWidth + 'px';
    }
}

// scroll-top
const scrollTop = document.querySelector('.scroll-top');
if (scrollTop) {
    scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTop.classList.remove('hidden');
        } else {
            scrollTop.classList.add('hidden');
        }
    });

    if (window.scrollY > 300) {
        scrollTop.classList.add('scroll-top--visible');
    } else {
        scrollTop.classList.add('hidden');
    }
}


document.addEventListener("DOMContentLoaded", function () {
    /* burger menu */
    const burgerMenu = document.querySelector('.burger');
    if (burgerMenu) {
        const headerMobile = document.querySelector('.header__bottom');
        burgerMenu.addEventListener("click", () => {
            if (burgerMenu.classList.contains('active')) {
                document.body.classList.remove('burger-lock');
            }
            else {
                document.body.classList.add('burger-lock');
            }
            headerMobile.classList.toggle("active");
            burgerMenu.classList.toggle("active");

            document.querySelector('html').classList.toggle('burger-lock');
        });
    }
    /* end burger menu */


    /* mobile menu */
    // Функция пересчёта полной высоты (с учётом вложенных списков)
    function getFullHeight(element) {
        let clone = element.cloneNode(true);
        clone.style.maxHeight = "none";
        clone.style.height = "auto";
        clone.style.opacity = "0";
        clone.style.position = "absolute";
        clone.style.pointerEvents = "none";
        document.body.appendChild(clone);
        let height = clone.scrollHeight;
        document.body.removeChild(clone);
        return height;
    }

    const navButtons = document.querySelectorAll(".header__nav-item");
    // Первый уровень аккордеона
    navButtons.forEach(btn => {
        const sublist = btn.querySelector(".header__nav-sublist");
        const arrow = btn.querySelector(".header__nav-arrow");

        arrow?.addEventListener("click", (e) => {
            if (window.innerWidth >= 1024) return;
            if (sublist.contains(e.target)) return;

            btn.classList.toggle("active");

            if (btn.classList.contains("active")) {
                sublist.style.maxHeight = getFullHeight(sublist) + "px";
            } else {
                sublist.style.maxHeight = null;
            }
        });

        // Второй уровень аккордеона
        const arrows = sublist?.querySelectorAll(".header__nav-arrow");
        arrows?.forEach(arrow => {
            const link = arrow.previousElementSibling;
            const subsublist = arrow.nextElementSibling;

            arrow.addEventListener("click", (e) => {
                e.stopPropagation();
                arrow.classList.toggle("active");
                link.classList.toggle("active");

                if (arrow.classList.contains("active")) {
                    subsublist.style.maxHeight = subsublist.scrollHeight + "px";
                } else {
                    subsublist.style.maxHeight = null;
                }
                // пересчитать высоту родителя с учётом всех элементов
                sublist.style.maxHeight = getFullHeight(sublist) + "px";
            });
        });
    });
    /* end mobile menu */
    // Popups
    function popupClose(popupActive) {
        popupActive.classList.remove('open');
        setTimeout(() => {
            if (!popupActive.classList.contains('open')) {
                popupActive.classList.remove('active');
            }
        }, 400);
        document.body.classList.remove('lock');
        document.querySelector('html').classList.remove('lock');
        document.querySelector('header').removeAttribute('style');
        document.querySelector('html').style.paddingRight = 0;
    }
    const popupOpenBtns = document.querySelectorAll('.popup-btn');
    const popups = document.querySelectorAll('.popup');
    const originalTitlePopup2 = document.querySelector('.original-title').innerHTML;
    const closePopupBtns = document.querySelectorAll('.close-popup-btn');
    closePopupBtns.forEach(function (el) {
        el.addEventListener('click', function (e) {
            popupClose(e.target.closest('.popup'));
        });
    });
    popupOpenBtns.forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            const path = e.currentTarget.dataset.path;
            const currentPopup = document.querySelector(`[data-target="${path}"]`);
            if (currentPopup) {
                popups.forEach(function (popup) {
                    popupClose(popup);
                    popup.addEventListener('click', function (e) {
                        if (!e.target.closest('.popup__content')) {
                            popupClose(e.target.closest('.popup'));
                        }
                    });
                });
                currentPopup.classList.add('active');
                setTimeout(() => {
                    currentPopup.classList.add('open');
                }, 10);
                if (currentPopup.getAttribute('data-target') == 'popup-change') {

                    let originaTitle = currentPopup.querySelector('.original-title');
                    if (el.classList.contains('change-item__btn')) {

                        if (el.classList.contains('doctor__btn-js')) {
                            let currentItem = el.closest('.change-item');
                            let currentTitile = currentItem.querySelector('.change-item__title');
                            originaTitle.innerHTML = 'Записаться на приём к врачу: ' + currentTitile.innerHTML
                        }
                        else {
                            if (el.classList.contains('change-item__btn_current')) {
                                originaTitle.textContent = el.textContent;
                            }
                            else {
                                let currentItem = el.closest('.change-item');
                                let currentTitile = currentItem.querySelector('.change-item__title');
                                originaTitle.innerHTML = currentTitile.innerHTML
                            }
                        }
                    }
                    else {
                        originaTitle.innerHTML = originalTitlePopup2;
                    }
                }

                if (currentPopup.getAttribute('data-target') == 'popup-jobs') {
                    let currentItems = el.closest('.jobs__items')
                    let originalText = currentPopup.querySelector('.jobs__inner_original');
                    if (originalText && currentItems.querySelector('.jobs__inner')) {
                        originalText.innerHTML = currentItems.querySelector('.jobs__inner').innerHTML;
                    }
                }
                e.stopPropagation();
                scrollWidthFunc();
                document.querySelector('html').classList.add('lock');
            }
        });
    });
    // end popups
    /* yandex map */
    const map = document.querySelectorAll('#map');
    if (map.length > 0) {
        function onEntryMap(e) {
            e.forEach(e => {
                e.isIntersecting && loadMap() && initMap();
            })
        }
        let options = {
            threshold: [0.5],
        },
            observer = new IntersectionObserver(onEntryMap, options)
        for (let e of map) observer.observe(e)
    }

    function loadMap() {
        if (!document.querySelector('[src="https://api-maps.yandex.ru/2.1/?lang=ru_RU"]')) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
            script.onload = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }
    }

    function initMap() {
        const mapPlaceholder = document.getElementById('map-placeholder');
        if (mapPlaceholder) {
            mapPlaceholder.remove();
        }

        ymaps.ready(function () {
            const myMap = new ymaps.Map('map', {
                center: [47.231129, 39.728721],
                zoom: 13,
                controls: []
            });

            const myPlacemark = new ymaps.Placemark(
                [47.231129, 39.728721],
                {
                    hintContent: 'Ростов-на-Дону, ул. Красноармейская, д. 227',
                    balloonContent: 'Ростов-на-Дону, ул. Красноармейская, д. 227'
                },
                {
                    iconLayout: 'default#image',
                    iconImageHref: 'assets/img/icons/map-pin.png',  //заменить на свою иконку
                    iconImageSize: [40, 40],
                    iconImageOffset: [-20, -20],
                }
            );

            myMap.geoObjects.add(myPlacemark);
            myMap.behaviors.disable(['scrollZoom']);
        });
    }
    /* end yandex map */
    /*  search */
    const inputSearch = document.querySelectorAll('input[type=search]')
    if (inputSearch.length > 0) {
        inputSearch.forEach(elem => {
            const wrapper = elem.closest('.search-wrapper')
            if (wrapper) {

                const searchResultBlock = wrapper.querySelector('.popup__search-result')
                const popularCitiesBlock = wrapper.querySelector('.popup__search')
                const noResultsMessage = searchResultBlock.querySelector('.no-results-message')

                function search() {
                    let filter = elem.value.toUpperCase()
                    let ul = wrapper.querySelectorAll('.search-list')
                    let totalResults = 0

                    ul.forEach(item => {
                        let li = item.getElementsByTagName('li')
                        for (let i = 0; i < li.length; i++) {
                            let a = li[i].querySelector('.search-name')
                            if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                                li[i].classList.remove('none')
                                totalResults++
                                console.log('sdd');
                            } else {
                                li[i].classList.add('none')
                            }
                        }
                    })
                    noResultsMessage.classList.toggle('none', totalResults > 0);

                    if (elem.value.trim() === '') {
                        searchResultBlock.classList.add('none')
                        popularCitiesBlock.classList.remove('none')
                    } else {
                        searchResultBlock.classList.remove('none')
                        popularCitiesBlock.classList.add('none')
                    }
                }
                elem.addEventListener('input', search)

                document.addEventListener('click', (event) => {
                    if (!wrapper.contains(event.target)) {
                        searchResultBlock.classList.add('none')
                    }
                })
            }
        })
    }
    /*  end search  */
    /* navigation */
    const articleNavigation = document.querySelector(".navigation");
    if (articleNavigation) {
        const jsScrollBlockList = document.querySelectorAll(
            ".text-block h1, .text-block h2, .text-block h3, .text-block h4"
        );

        if (jsScrollBlockList.length > 0) {
            for (let i = 0; i < jsScrollBlockList.length; i += 1) {
                const jsScrollBlock = jsScrollBlockList[i];
                const titleBlock = jsScrollBlock.textContent;
                const articleNavigationList =
                    document.querySelector(".navigation__list");
                const articleNavigationItem = document.createElement("li");
                const articleNavigationLink = document.createElement("a");
                if (jsScrollBlock.tagName == "H1") {
                    articleNavigationItem.classList.add("nav-title-h1");
                }
                articleNavigationItem.classList.add("navigation__item");
                if (jsScrollBlock.tagName == "H2") {
                    articleNavigationItem.classList.add("nav-title-h2");
                } else if (jsScrollBlock.tagName == "H3") {
                    articleNavigationItem.classList.add("nav-title-h3");
                } else if (jsScrollBlock.tagName == "H4") {
                    articleNavigationItem.classList.add("nav-title-h4");
                } else if (jsScrollBlock.tagName == "H5") {
                    articleNavigationItem.classList.add("nav-title-h5");
                } else if (jsScrollBlock.tagName == "H6") {
                    articleNavigationItem.classList.add("nav-title-h6");
                }
                articleNavigationLink.classList.add("navigation__link");
                jsScrollBlock.setAttribute("id", `${i}`);
                articleNavigationLink.setAttribute("href", `$${i}`);
                articleNavigationLink.textContent = " " + titleBlock;
                articleNavigationItem.append(articleNavigationLink);
                articleNavigationList.append(articleNavigationItem);
            }
            document.querySelectorAll('a[href^="$"').forEach((link) => {
                link.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let href = this.getAttribute("href").substring(1);
                    const scrollTarget = document.getElementById(href);
                    const topOffset = 140;
                    const elementPosition = scrollTarget.getBoundingClientRect().top;
                    const offsetPosition = elementPosition - topOffset;
                    window.scrollBy({
                        top: offsetPosition,
                        behavior: "smooth",
                    });
                });
            });
        } else {
            if (articleNavigation.querySelector(".navigation")) {
                articleNavigation.querySelector(".navigation").remove();
            }
        }

        const headers = document.querySelectorAll('.nav-title-h2');
        const content = articleNavigation.querySelector('.accordion__content');

        headers.forEach((item, index) => {
            let nextElement = item.nextElementSibling;
            const isFirstHeader = index === 0;

            if (isFirstHeader) {
                item.classList.add('active');
            }

            while (nextElement && !nextElement.classList.contains('nav-title-h2')) {
                nextElement.style.display = isFirstHeader ? 'block' : 'none';
                nextElement = nextElement.nextElementSibling;
            }

            item.addEventListener('click', (e) => {
                let nextElement = item.nextElementSibling;
                const isActive = item.classList.toggle('active');

                while (nextElement && !nextElement.classList.contains('nav-title-h2')) {
                    nextElement.style.display = isActive ? 'block' : 'none';
                    nextElement = nextElement.nextElementSibling;
                }

                console.log(content);
                content.style.maxHeight = getFullHeight(content) + "px";
            });
        });
    }
    /* end navigation */

    /* Скрыть/показать */
    /* Параметры передаваемых классов 1 - обертка, 2 - елемент, 3 - кнопка скрыть/показать 4 - !!без точки активный класс для показа*/





    // function hidingElemsMainList() {
    //     const hidingElemsMainList = document.querySelectorAll('.hiding__elements-main');

    //     if (!hidingElemsMainList.length) return;

    //     hidingElemsMainList.forEach(hidingElemsMain => {
    //         const hidingElems = hidingElemsMain.querySelector('.hiding__elements');
    //         const hidingElem = hidingElemsMain.querySelectorAll('.hiding__element.active');
    //         const hidingBtns = hidingElemsMain.querySelector('.hiding__element-buttons');
    //         const hidingBtn = hidingElemsMain.querySelector('.hiding__element-button');
    //         const activeCount = hidingElem.length;

    //         if (!hidingElem.length && !hidingElems && !hidingBtns && !hidingBtn) return;

    //         function hidingElements(num) {
    //             hidingElem.forEach((element, index) => {
    //                 console.log('num = ' + num)
    //                 if (index > num) {
    //                     element.classList.toggle('hide');
    //                 }
    //                 if (activeCount > num) {
    //                     hidingBtns.classList.remove('hide');
    //                 }
    //                 if (activeCount <= num) {
    //                     hidingBtns.classList.add('hide');
    //                 }
    //             });
    //         }
    //         // Устанавливаем количество отображаемых элементов
    //         function hidingElementsCounts() {
    //             const gallery = document.querySelector('.gallery');
    //             const reviews = document.querySelector('.reviews');
    //             const windowWidth = window.innerWidth < 481; let num = 0;
    //             // Страница - Фотогалерея, Отзывы
    //             if (gallery || reviews) {
    //                 num = 11;
    //             } if (gallery && windowWidth) {
    //                 num = 9;
    //             }

    //             if (reviews && windowWidth) {
    //                 num = 6;
    //             }
    //             hidingElements(num);
    //         }

    //         hidingElementsCounts();
    //         hidingBtn.addEventListener("click", function () {
    //             hidingElementsCounts();
    //             hidingBtn.classList.toggle('open');
    //         })
    //     });
    // }

    /* end Скрыть/показать */
    /* Табы */
    // addEventListener("DOMContentLoaded", function () {
    //     const tabsButtons = document.querySelectorAll('.tabs__buttons');
    //     const tabsContent = document.querySelectorAll('.tabs__content');

    //     if (!tabsButtons.length || !tabsContent.length) return;

    //     tabsButtons.forEach(btns => {

    //         const tabsButton = btns.querySelectorAll('.tabs__button');

    //         tabsButton.forEach(btn => {
    //             btn.addEventListener('click', function () {
    //                 tabsButton.forEach(element => element.classList.remove('active'));
    //                 this.classList.add('active');

    //                 tabsContent.forEach(content => {
    //                     content.classList.remove('active');

    //                     if (content.dataset.tab === this.dataset.tab) {
    //                         content.classList.add('active');
    //                     }
    //                 });

    //                 const windowWidth = window.innerWidth < 481;

    //                 if (windowWidth) {
    //                     tabsButtons.forEach(element => element.classList.toggle('active'));
    //                     btns.prepend(this);
    //                 }
    //             });
    //         });
    //     });
    // });
    /* end Табы */



    const filterButtons = '.filter__buttons';
    const filterButton = '.filter__button';
    const filterElement = '.filter__element';
    const filterButtonAll = 'filter__button--all';

    filter(filterButtons, filterButton, filterElement, filterButtonAll);

    function filter(filterButtons, filterButton, filterElement, filterButtonAll) {
        const filterBtns = document.querySelectorAll(filterButtons);
        const filterElems = document.querySelectorAll(filterElement);
        const ACTIVE_CLASS = 'active';

        // Проверка элементов
        if (!filterBtns.length || !filterElems.length) {
            console.warn('Filter: Не найдены необходимые элементы');
            return;
        }

        // Инициализация - активируем первую кнопку и соответствующие элементы
        function initFilter() {
            const firstBtn = document.querySelector(`${filterButton}.${ACTIVE_CLASS}`) ||
                document.querySelector(filterButton);

            if (firstBtn) {
                firstBtn.classList.add(ACTIVE_CLASS);
                filterByButton(firstBtn);
            }
        }

        // Основная функция фильтрации
        function filterByButton(button) {
            const isAllButton = button.classList.contains(filterButtonAll);

            // Фильтрация элементов
            filterElems.forEach(elem => {
                elem.classList.remove(ACTIVE_CLASS);

                if (isAllButton || elem.dataset.tab === button.dataset.tab) {
                    elem.classList.add(ACTIVE_CLASS);

                }

                if (elem.classList.contains(ACTIVE_CLASS) && elem.classList.contains('prices__main')) {
                    const scrollHeight = elem.scrollHeight;
                    elem.style.maxHeight = scrollHeight + 'px';
                } else {
                    elem.style.maxHeight = null;
                }
            });


        }

        // Обработчик клика
        function handleFilterClick(e) {
            const button = e.currentTarget;
            const buttonContainer = button.closest(filterButtons);

            if (!buttonContainer) return;

            // Убираем активный класс у всех кнопок в этом контейнере
            buttonContainer.querySelectorAll(filterButton)
                .forEach(btn => btn.classList.remove(ACTIVE_CLASS));

            // Добавляем активный класс текущей кнопке
            button.classList.add(ACTIVE_CLASS);
            // // Mobile логика

            const isMobile = window.innerWidth < 481;
            if (isMobile) {
                buttonContainer.classList.toggle(ACTIVE_CLASS)
            }
            // Применяем фильтрацию
            filterByButton(button);
            hidingElemList(hidingWrapper, hidingElement, hidingButtons, hidingButton, ACTIVE_CLASS);
        }

        // Навешиваем обработчики
        filterBtns.forEach(container => {
            const buttons = container.querySelectorAll(filterButton);

            buttons.forEach(button => {
                // Убираем старые обработчики (защита от дублирования)
                button.removeEventListener('click', handleFilterClick);
                button.addEventListener('click', handleFilterClick);
            });
        });

        // Обработчик изменения размера окна
        let resizeTimeout;
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const activeBtn = document.querySelector(`${filterButton}.${ACTIVE_CLASS}`);
                if (activeBtn && window.innerWidth < 481) {
                    activeBtn.parentElement.prepend(activeBtn);
                }
            }, 150);
        }

        window.addEventListener('resize', handleResize);

        // Инициализация
        initFilter();


    }


    const hidingWrapper = '.hiding__wrapper';
    const hidingElement = '.hiding__item';
    const hidingButtons = '.hiding__buttons';
    const hidingButton = '.hiding__button';
    const ACTIVE_CLASS = 'active';

    hidingElemList(hidingWrapper, hidingElement, hidingButtons, hidingButton, ACTIVE_CLASS);

    function hidingElemList(hidingWrapper, hidingElement, hidingButtons, hidingButton, ACTIVE_CLASS) {
        const hidingWrap = document.querySelectorAll(hidingWrapper);

        if (!hidingWrap.length) return;


        hidingWrap.forEach(container => {
            const hidingElem = container.querySelectorAll(`${hidingElement}.${ACTIVE_CLASS}`);
            const hidinBtnsWrap = container.querySelector(hidingButtons);
            const hidingBtn = container.querySelector(hidingButton);

            if (hidingElem.length == 0 && hidinBtnsWrap) {
                console.log('dddd')
                hidinBtnsWrap.classList.remove(ACTIVE_CLASS);
            }

            if (!hidingElem.length && !hidingBtn) return;

            function hidingElements(num) {
                hidingElem.forEach((element, index) => {

                    if (index > num) {
                        element.classList.toggle(ACTIVE_CLASS);
                        hidinBtnsWrap.classList.add(ACTIVE_CLASS)
                    }
                });
            }

            // Устанавливаем количество отображаемых класс должен быть внутри hidingWrapper
            function hidingElementsCounts() {
                const gallery = document.querySelector('.gallery__items');
                const reviews = document.querySelector('.reviews__cards');
                const doctors = document.querySelector('.doctors__cards');
                const faqs = document.querySelector('.faqs__items');
                const MOBILE_WIDTH = 481;
                const windowWidth = window.innerWidth < MOBILE_WIDTH;
                let num = 0;
                if (gallery || reviews || faqs) num = 11;
                if (doctors) num = 7;
                if (doctors && windowWidth) num = 2;
                if (gallery && windowWidth) num = 9;
                if (reviews && windowWidth) num = 6;
                hidingElements(num);
            }

            hidingElementsCounts();
            hidingBtn.addEventListener("click", function () {
                hidingElementsCounts();
                console.log('hidingBtn ' + hidingBtn)
                hidingBtn.classList.toggle(ACTIVE_CLASS);
            })
        });
    }
})


const openingElement = document.querySelectorAll('.opening-element');
if (openingElement.length) {
    openingElement.forEach(element => {

        const openingElementBtn = element.querySelector('.opening-element__btn')
        const openingElementContent = element.querySelector('.opening-element__content')

        if (openingElementBtn) {

            openingElementBtn.addEventListener('click', function (e) {
                element.classList.toggle('open');

                if (element.classList.contains('open')) {
                    const scrollHeight = openingElementContent.scrollHeight;
                    openingElementContent.style.maxHeight = scrollHeight + 'px';
                } else {
                    openingElementContent.style.maxHeight = null;
                }
            })
        }
    });
}
