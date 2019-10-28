window.cancelRequestAnimFrame = (function () {
    return window.cancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout
})();

window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                return window.setTimeout(callback, 1000 / 60);
            };
})();

var site = site || {};

site.draw = {};
site.draw.svg = $('#svg');
site.draw.type = 'all';
site.draw.p = [];
site.draw.d = [];
site.draw.t = [];
site.draw.c = 0;
site.draw.width = window.innerWidth > 1500 ? 1300 : (window.innerWidth > 1000 ? window.innerWidth : window.innerWidth);
site.draw.height = 600;
site.draw.links = [
    {title: "Веб-дизайн", type: 1, modal: 'modal-1'},
    {title: "Прототипы", type: 1, modal: 'modal-2'},
    {title: "Логотипы", type: 1, modal: 'modal-3'},
    {title: "Айдентика", type: 1, modal: 'modal-4'},

    {title: "Сайты", type: 2, modal: 'modal-5'},
    {title: "Лендинги", type: 2, modal: 'modal-6'},
    {title: "Мобильные версии", type: 2, modal: 'modal-7'},
    {title: "Мобильные приложения", type: 2, modal: 'modal-8'},

    {title: "SEO", type: 3, modal: 'modal-9'},
    {title: "Контекстная реклама", type: 3, modal: 'modal-10'},
    {title: "SMM", type: 3, modal: 'modal-11'},
    {title: "Медийная реклама", type: 3, modal: 'modal-12'},

    {title: "Разработка модулей", type: 4, modal: 'modal-13'},
    {title: "Синхронизация с 1С", type: 4, modal: 'modal-14'},
    {title: "Выгрузка в Яндекс-Маркет", type: 4, modal: 'modal-15'},
    {title: "Электронная оплата", type: 4, modal: 'modal-16'},

    {title: "Маркетинговый аудит", type: 5, modal: 'modal-17'},
    {title: "Seo - аудит сайта", type: 5, modal: 'modal-18'},
    {title: "Технический аудит сайта", type: 5, modal: 'modal-19'},
    {title: "Юзабилити - аудит", type: 5, modal: 'modal-20'}

];

$('#servis-interactive').css('max-width', site.draw.width);

site.draw.mouseover = function () {
    d3.select(this).select("polygon").transition().duration(150).attr("fill", '#ff8282');
    d3.select(this).select("polyline").transition().duration(150).attr("opacity", '1');
    d3.select(this).select("text").transition().duration(150).attr("opacity", '1');
}
site.draw.mouseout = function () {
    d3.select(this).select("polygon").transition().duration(150).attr("fill", '#fff');
    d3.select(this).select("polyline").transition().duration(150).attr("opacity", '0');
    d3.select(this).select("text").transition().duration(150).attr("opacity", '0');
}

site.draw.print = function () {
    site.draw.svg.selectAll('.node').remove();

    site.draw.svg.select('path').remove();
    site.draw.svg.append('path').attr('d', '');

    var k = 0,
            items = 1;

    // Set elements
    site.draw.links.forEach(function (link, i) {

        if (parseInt(site.draw.type, 10) === link.type || site.draw.type === 'all') {
            var node = site.draw.svg.append('g');

            node.attr('class', 'node node-' + k);
            node.on("mouseover", site.draw.mouseover);
            node.on("mouseout", site.draw.mouseout);

            node.append("polygon").attr({
                points: '17.500, 0 8.750, 15.155 -8.750, 15.155 -17.500, 0 -8.750, -15.155 8.750, -15.155',
                fill: '#fff',
                transform: "rotate(40)",
                modal: link.modal
            });


            node.append("text").attr({
                x: -32,
                y: -64,
                dy: '0.5em',
                fill: '#fff',
                opacity: 0
            }).text(function () {
                return link.title;
            });

            node.append("polyline").attr({
                points: '-12,-12 -22,-26 -22,-52',
                fill: 'rgba(0,0,0,0)',
                stroke: 'rgb(255, 255, 255)',
                opacity: '0'
            });
            k++;
            items++;
        }
    });

    if (site.draw.type === 'all') {
        site.doDrawStart();
    } else {
        site.doDrawStop();
        console.log('stop');

        var width = ~~$('svg').attr('width') - 100,
                itemWidth = 92,
                width2 = width - itemWidth * items,
                widthMargin = width2 / (items - 2),
                sPath = '';

        for (var i = 0; i <= items; i++) {
            var x = (i ? ((widthMargin * i) + (itemWidth * (i + 1)) + 50) : 50),
                    y = (i + 1) % 2 == 0 ? site.draw.height - site.draw.height * 0.3 : site.draw.height - site.draw.height * 0.6;

            if (i < (items - 1)) {
                sPath += (i === 0 ? ' M' : ' L') + x + "," + y;
            }

            site.draw.svg.select('.node-' + i).attr('transform', 'translate(' + x + ',' + y + ')');
        }

        site.draw.svg.select('path').attr('d', sPath);
    }

    site.randomize();
}
site.rand = function (min, max) {
    min = parseInt(min);
    max = parseInt(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Animate function */
site.randomize = function () {
    site.draw.p = [];
    site.draw.d = [];
    site.draw.t = [];

    var points = 0;
    site.draw.links.forEach(function (link, i) {
        if (parseInt(site.draw.type, 10) === link.type || site.draw.type === 'all') {
            points++;
        }
    });

    var no = points;
    var delta = 1;

    for (var i = 0; i < no; i++) {
        var s = (i * 2);
        site.draw.p[s] = site.rand(50, site.draw.width - 50);
        site.draw.p[s + 1] = site.rand(100, site.draw.height);
        site.draw.d[s] = (Math.random() - Math.random()) * delta;
        site.draw.d[s + 1] = (Math.random() - Math.random()) * delta;
        site.draw.t[i] = (i === 0) ? " M" : " L";
    }
}
site.doDrawAnimation = false;
site.doDraw = function () {
    site.doDrawAnimation = window.requestAnimationFrame(site.doDraw);

    var sPath = "";
    for (var i = 0; i < site.draw.t.length; i++) {
        var ty = site.draw.t[i],
                s = (i * 2),
                x = site.draw.p[s],
                y = site.draw.p[s + 1],
                coor = x + "," + y;

        var res = site.move(x, site.draw.d[s], 50, site.draw.width - 50);

        site.draw.d[s] = res.delta;
        site.draw.p[s] = res.value;

        res = site.move(y, site.draw.d[s + 1], 100, site.draw.height - 50);

        site.draw.d[s + 1] = res.delta;
        site.draw.p[s + 1] = res.value;

        site.draw.svg.select('.node-' + i).attr('transform', 'translate(' + x + ',' + y + ')');
        sPath += ty + coor;
    }

    site.draw.svg.select('path').attr('d', sPath);
}
site.doDrawStart = function () {
    if (!site.doDrawAnimation) {
        site.doDraw();
    }
}
site.doDrawStop = function () {
    if (site.doDrawAnimation) {
        window.cancelAnimationFrame(site.doDrawAnimation);
        site.doDrawAnimation = false;
    }
}

site.move = function (value, delta, min, max) {
    var _value = value + delta;
    if (_value <= min) {
        delta = -delta;
        _value += delta;
    } else {
        if (_value > max) {
            delta = -delta;
            _value = max;
        }
    }
    return {
        value: _value,
        delta: delta
    };
}

$(document).ready(function () {
    $(document).on('click', '#services .sort:not(.sort--off) a', function (event) {
        event.preventDefault();
        var that = $(this);

        if (!that.hasClass('sort__link--active')) {
            $('.sort a').removeClass('sort__link--active');
            that.addClass('sort__link--active');
            site.draw.type = that.data('type');
            site.draw.print();
        }
    });

    if ((device.tablet() || device.desktop()) && $('#servis-interactive').length) {

        site.draw.svg = d3.select('#svg');

        // SVG size
        $(window).resize(function () {
            site.draw.width = config.getWidth() > 1500 ? 1300 : (config.getWidth() > 1000 ? config.getWidth() : 970);
            site.draw.height = config.getHeight() - parseInt($('#servis-interactive').offset().top) - parseInt($('#container').css('paddingBottom')) - $('a.servis-interactive-link').height();
            site.draw.height = site.draw.height > 300 ? site.draw.height : 300;
            site.draw.svg.attr("width", site.draw.width).attr("height", site.draw.height);
        });

        $(window).resize();

        // Set elements
        site.draw.print();

        site.randomize();
    } else if ($('#services').length && device.mobile()) {
        $('#services').addClass('mobile');
    }


    if ($('#servis-line .point').length) {
        var count = $('#servis-line .point').length;
        $('.point').css('width', 100 / count + '%');
    }

    $(document).on('click', 'polygon', function () {
        config.openModal($(this).attr('modal'));
    });

    $(document).on('click', '.point__wrap', function () {
        config.openModal($(this).data('modal'));
    });


    if ($('#servis-line').length) {
        $(window).resize(function () {
            site.draw.height = config.getHeight() - parseInt($('#servis-interactive-in').offset().top) - parseInt($('#container').css('paddingBottom'));
            site.draw.height = site.draw.height > 375 ? site.draw.height : 375;
            $('#servis-line').css('height', site.draw.height);
        });

        $(window).resize();
    }
});