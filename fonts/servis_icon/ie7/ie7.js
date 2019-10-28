/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'servis_icon\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-web_dis2': '&#xe900;',
		'icon-usabilyty_audit': '&#xe901;',
		'icon-teh_audit': '&#xe902;',
		'icon-smm': '&#xe903;',
		'icon-sites': '&#xe904;',
		'icon-sinhronizaciya': '&#xe905;',
		'icon-seo_audit': '&#xe906;',
		'icon-seo': '&#xe907;',
		'icon-prototype': '&#xe908;',
		'icon-oplata': '&#xe909;',
		'icon-moduli': '&#xe90a;',
		'icon-mobile_version': '&#xe90b;',
		'icon-mob_app': '&#xe90c;',
		'icon-mediinaya': '&#xe90d;',
		'icon-marketing_audit': '&#xe90e;',
		'icon-market': '&#xe90f;',
		'icon-logo': '&#xe910;',
		'icon-landing': '&#xe911;',
		'icon-fir_stil': '&#xe912;',
		'icon-context': '&#xe913;',
		'icon-web_dis': '&#xe914;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
