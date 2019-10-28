var config = config || {};

config.PlacemarkStyle = {
    iconLayout: 'default#image',
    iconImageHref: 'img/map-point.png',
    iconImageSize: [83, 122],
    iconImageOffset: [-41, -122]
}

config.isTouchDevice = function() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

config.parseCoordinats = function(str) {
    var coords = str.split(',');
    coords[0] = parseFloat(coords[0]);
    coords[1] = parseFloat(coords[1]);
    return coords;
}

config.initMap = function() {
    var coords = config.parseCoordinats($('#contact-map').data('coord')),
        title = $('#contact-map').data('title');

    var map = new ymaps.Map('contact-map', {
        center: coords,
        zoom: 15,
        controls: ['smallMapDefaultSet']
    });

    map.behaviors.disable('scrollZoom');

    var myPlacemark = new ymaps.Placemark(coords, { balloonContentHeader: title }, config.PlacemarkStyle);
    map.geoObjects.add(myPlacemark);

    config.initModalMap = true;
}

config.getScrollTop = function() {
    var scrOfY = 0;
    if (typeof(window.pageYOffset) == "number") {
        scrOfY = window.pageYOffset;
    } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        scrOfY = document.body.scrollTop;
    } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        scrOfY = document.documentElement.scrollTop;
    }
    return scrOfY;
};

config.getHeight = function() {
    return document.compatMode == 'CSS1Compat' && !window.opera ? document.documentElement.clientHeight : document.body.clientHeight;
}
config.getWidth = function() {
    return document.compatMode == 'CSS1Compat' && !window.opera ? document.documentElement.clientWidth : document.body.clientWidth;
}

config.openModal = function(id) {
    $('#' + id).remodal().open();
}



$(function() {

    if (navigator.userAgent.toLowerCase().indexOf('chrome') >= 0) {
        $(window).load(function() {
            $('input:-webkit-autofill').each(function() {
                $(this).after(this.outerHTML).remove();
                $('input[name=' + $(this).attr('name') + ']').val($(this).val());
            });
        });
    }


    // Карта на странице контактов
    if ($('#contact-map').length) {
        ymaps.ready(config.initMap);
    }

    // One Scroll самописное решение
    if ($('#one-page .item').length && config.getWidth() >= 1024) {
        config.onePage = {
            animate: false,
            items: $('#one-page .item'),
            itemsCount: $('#one-page .item').length,
            setDefault: function() {
                var index = this.getCurrentItem();
                if (this.itemsCount - 1 === index) {
                    index = this.itemsCount - 1;
                } else if (this.itemsCount - 1 < index || index == 0) {
                    return false;
                }

                var current = $('#one-page .item:not(:hidden)').eq(index);
                this.animateTo(current);
            },
            init: function() {
                this.items.css('height', config.getHeight());
                $('#one-page-wrap .paginator').css('height', config.getHeight() - 70);
                this.items.find('.wrap-in').css('height', config.getHeight());
                this.setDefault();
            },
            getCount: function(hidden) {
                if (hidden) {
                    return this.items.not(':hidden').length;
                } else {
                    return this.items.length;
                }
            },
            getTopOffset: function() {
                return this.items.eq(0).offset().top;
            },
            getCurrentItem: function() {
                var onePageOffset = this.getTopOffset(),
                    step = config.getHeight(),
                    scrollTop = config.getScrollTop();
                return scrollTop - onePageOffset < 0 ? 0 : Math.floor((scrollTop - onePageOffset) / step);
            },
            animateTo: function(item) {
                var body = $("html, body, .jPanelMenu-panel"),
                    that = this;
                that.animate = true;
                body.stop().animate({ scrollTop: item.offset().top }, 1400, 'easeOutCubic', function() {
                    that.animate = false;
                });
            }
        };
        config.onePage.init();
        $('.paginator').mousewheel(function(event) {
            event.preventDefault();
            return false;
        });
        config.onePage.items.mousewheel(function(event) {
            if (config.onePage.animate) {
                event.preventDefault();
                return false;
            }

            var that = $(this),
                hiddenCount = config.onePage.getCount() - config.onePage.getCount('hidden'),
                current = that.index(),
                nextItem = that.nextAll('.item').not(':hidden').first(),
                prevItem = that.prevAll('.item').not(':hidden').first();
            // Stop first and last
            if (current === 0 && event.deltaY > 0) {
                return true;
            } else if (config.onePage.getCount('hidden') - 1 === current && event.deltaY < 0) {
                return true;
            }

            if (current === 0 && event.deltaY < 0 && that.offset().top - 150 >= config.getScrollTop()) {
                config.onePage.animateTo(that);
                return true;
            } else if (hiddenCount - 1 <= current && event.deltaY > 0 && that.offset().top >= config.getScrollTop() + 150) {
                config.onePage.animateTo(that);
                return true;
            }

            if (event.deltaY > 0) {
                config.onePage.animateTo(prevItem);
            } else {
                config.onePage.animateTo(nextItem);
            }
        });
        $(document).on('click', '.paginator--steps-nav .paginator__item a', function(event) {
            event.preventDefault();
            config.onePage.animateTo(config.onePage.items.eq(~~$(this).data('step')));
        });
        $(window).scroll(function(event) {
            var scroll = config.getScrollTop(),
                wrapHeight = $('#one-page-wrap').height(),
                wrapOffset = $('#one-page-wrap').offset().top,
                viewportHeight = config.getHeight(),
                stopPos = wrapOffset + wrapHeight - viewportHeight,
                defTop = 70;
            if (scroll >= wrapOffset) {
                if (stopPos <= scroll) {
                    if ($('.paginator').hasClass('paginator--steps-nav')) {
                        $('.paginator').removeClass('fixed').css('top', wrapHeight - viewportHeight + defTop * 2);
                    } else {
                        $('.paginator').removeClass('fixed').css('top', wrapHeight - viewportHeight + defTop);
                    }

                } else {
                    $('.paginator').addClass('fixed').css('top', defTop);
                }
            } else {
                $('.paginator').removeClass('fixed');
            }
        });
        $(window).scroll();
    }

    if (config.getWidth() <= 1024 && $('#one-page').length) {
        $('#one-page').addClass('mobile-view')
    }

    // Адаптация главной страницы
    if ($('#main-content').length) {
        config.main = {
            content: $('#main-content'),
            setHeight: function() {
                var height = config.getHeight() - (parseInt(this.content.css('paddingTop'), 10) + parseInt(this.content.css('paddingBottom'), 10) + $('#top').height() + 3);
                if (height > 300) {
                    this.content.find('.wrap').css('height', height);
                } else {
                    this.content.find('.wrap').css('height', 'auto');
                }
            }
        }

        config.main.setHeight();
        $(window).resize(function() {
            config.main.setHeight();
        });
    }

    // Client - touch device support
    if ($('.clients .client').length && config.isTouchDevice()) {
        $('.clients .client').click(function() {
            $(this).toggleClass('hover')
        });
    }

    /*
     if ($('.portfolio-blocks .portfolio').length && config.isTouchDevice()) {
     $('.portfolio-blocks .portfolio').click(function(){
     $(this).toggleClass('hover')
     });
     }
     */

    // Select filter
    if ($('.mobile-filter select').length) {
        $('.mobile-filter select').select2({
            minimumResultsForSearch: Infinity,
            theme: 'search'
        });
    }

    config.orderForm = $.jPanelMenu({
        menu: '.order-form',
        trigger: '.form-triger',
        direction: 'right',
        openPosition: '350px',
        animated: true
    });
    config.orderForm.on();
    setTimeout(function() {
        $('#jPanelMenu-menu').addClass('view')
    }, 500);
    $(document).on('click', '.form-triger-close', function() {
        config.orderForm.close();
    });
    $(document).on('click', '.menu-btn', function(event) {
        event.preventDefault();
        var mobileMenu = $('.mobile-menu');
        if (mobileMenu.html() === '') {
            mobileMenu.html('<div class="wrap"><a href="#" class="close menu-triger-close">+</a>' + $('#mob-menu').html() + '</div>');
        }

        $('.mobile-menu').toggleClass('view');
    });
    $(document).on('click', '.menu-triger-close', function(event) {
        event.preventDefault();
        $('.mobile-menu').removeClass('view');
    });
    // Filter portfolio blocks
    if ($('.portfolio-blocks').length) {
        $(document).on('click', '.sort a', function(event) {
            event.preventDefault();
            var that = $(this);
            if (!that.hasClass('sort__link--active')) {
                $('.sort a').removeClass('sort__link--active');
                that.addClass('sort__link--active');
                config.sortBlocks(that.data('value'), 'blocks');
            }
        });
        $(document).on('change', '.mobile-filter select[name=sort]', function(event) {
            event.preventDefault();
            var that = $(this);
            if (!config.sortStop) {
                config.sortBlocks(that.val(), 'select');
                $('.sort a').removeClass('sort__link--active');
                $('.sort a[data-value=' + that.val() + ']').addClass('sort__link--active');
            }
        });
        config.sortStop = false;
        config.sortBlocks = function(type, mod) {
            $('.portfolio-blocks .portfolio').css('display', 'none');
            $('.portfolio-blocks .portfolio').removeClass('portfolio--2');
            $('.portfolio-blocks .portfolio').removeClass('portfolio--3');
            if (type == 'all') {
                $('.portfolio-blocks .portfolio').css('display', 'inline-block');
            } else {
                $(".portfolio-blocks .portfolio[data-values*='" + type + "']").css('display', 'inline-block');
            }

            $(".portfolio-blocks .portfolio:not(:hidden)").each(function(index, el) {
                if ((index + 1) % 2 == 0)
                    $(el).addClass('portfolio--2');
                if ((index + 1) % 3 == 0)
                    $(el).addClass('portfolio--3');
            });
            $('.mobile-filter select[name=sort]').val(type);
            if (mod != 'select') {
                config.sortStop = true;
                $('.mobile-filter select[name=sort]').change();
                config.sortStop = false;
            }
            $("html, body, .jPanelMenu-panel").stop().animate({ scrollTop: 0 }, 1000, 'easeOutCubic');
        }
    }

    $(" input[name=phone]").mask("+7(999) 999-99-99");
    // Filter portfolio list
    if ($('.portfolio-list').length) {
        $(document).on('click', '.sort a', function(event) {
            event.preventDefault();
            var that = $(this);
            if (!that.hasClass('sort__link--active')) {
                $('.sort a').removeClass('sort__link--active');
                that.addClass('sort__link--active');
                config.sortBlocks(that.data('value'), 'blocks');
            }
        });
        $(document).on('change', '.mobile-filter select[name=sort]', function(event) {
            event.preventDefault();
            var that = $(this);
            if (!config.sortStop) {
                config.sortBlocks(that.val(), 'select');
                $('.sort a').removeClass('sort__link--active');
                $('.sort a[data-value=' + that.val() + ']').addClass('sort__link--active');
            }
        });
        config.sortStop = false;
        config.sortBlocks = function(type, mod) {
            $('.portfolio-list .item').css('display', 'none');
            if (type == 'all') {
                $('.portfolio-list .item').css('display', 'block');
            } else {
                $(".portfolio-list .item[data-values*='" + type + "']").css('display', 'block');
            }

            $('.mobile-filter select[name=sort]').val(type);
            if (mod != 'select') {
                config.sortStop = true;
                $('.mobile-filter select[name=sort]').change();
                config.sortStop = false;
            }
            $("html, body, .jPanelMenu-panel").stop().animate({ scrollTop: 0 }, 1000, 'easeOutCubic');
        }
    }

    //Ajax
    $(".form-callback100500, .form-data").submit(function(e) {
        e.preventDefault();
        senderForm = this;
        if (LongByteValidate(this, {
                '[name=name]': /.{2,}/,
                '[name=phone]': /^[\d\-\(\)+\s]{7,}$/,
                '[name=email]': /^.+@.+\..+$/
            })) {

            $.ajax({
                type: "POST",
                url: "/edvance.php",
                data: $(senderForm).serializeArray()
            }).done(function() {
                console.log('done');
                $(senderForm).find("input, textarea").val("");
                if ($(senderForm).hasClass('form-callback100500 form-data')) {
                    $(senderForm)
                        .hide()
                        .siblings('.form-complete')
                        .show();
                } else {
                    $(senderForm)
                        .closest('.form-fields')
                        .hide()
                        .siblings('.form-complete')
                        .show();
                }
            });
        }
        return false;
    });

    $('.close').click(function() {
        $('.form-complete').hide();
        $('.contact-form').show();
    });

    $('.close_form-data').click(function() {
        $('.form-complete').hide();
        $('.form-fields').show();
        return false;
    });

});
