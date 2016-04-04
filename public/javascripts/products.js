function ProductItem(arguments) {

  var that = this;
  _.forEach(arguments, function(n, key) {
    that[key] = n;
  });
}

tagFiltersCtx = [{
  id: "privatecloud",
  caption: "Частное облако"
}, {
  id: "database",
  caption: "Базы данных"
}, {
  id: "datacenter",
  caption: "Дата-центры"
}, {
  id: "virtualmashine",
  caption: "Виртуальные машины"
}, {
  id: "cod",
  caption: "ЦОДы"
}, {
  id: "1s",
  caption: "1С"
}, {
  id: "corpemail",
  caption: "Корпоративная почта"
}, {
  id: "crmsystem",
  caption: "CRM-система"
}, {
  id: "onlinecommunicate",
  caption: "Онлайн-коммуникация"
}, {
  id: "webconf",
  caption: "Веб-конференции"
}, {
  id: "filestorage",
  caption: "Хранилище файлов"
}, {
  id: "telephoniya",
  caption: "Телефония"
}, {
  id: "idea",
  caption: "Управление идеями"
}]

var m_site = {
  products: ko.observableArray([]),
  cases: ko.observableArray([]),
  activeFilterA: ko.observable(),
  activeFilterB: ko.observable(),
  tags: ko.observableArray([]),
  activeTags: ko.observableArray([]),
  tagsBuff: ko.observableArray([]),
  loadCases: function() {
		$.getJSON('/datasource/cases.json').done(function(data) {
				m_site.cases(data);
				m_site.loadProducts();
		})
  },
  loadProducts: function() {
    $('.product-preloader').show();

    $.getJSON('/datasource/products.json').done(function(data) {
      var products = data;
      var tmp_prod = [];

      $('.product-preloader').hide();

      _.forEach(products, function(d, indx) {

        if (d.case_id) {
          d.case_data = [];

          _.forEach(d.case_id, function(c, cindx) {
            var a = _.find(m_site.cases(), function(n) {
              return n._id === c;
            });

            d.case_data.push(a)
          });

        };
        tmp_prod.push(d)
      });

      m_site.products(tmp_prod);
    });
  },
  productAnimationClass: ko.observable(),
  toggleFilter: function(group, val) {

    if (group == "0") {
      if (m_site.activeFilterA() != val) {
        m_site.activeFilterA(val);
        m_site.activeFilterB('');

        if (localStorage.getItem("infiniteScrollEnabled") === null) {

          localStorage.setItem('productFilterA', val);
          localStorage.setItem('productFilterB', '');
          localStorage.setItem('productTags', '');
        }

      } else {
        m_site.activeFilterA(false);

        if (localStorage.getItem("infiniteScrollEnabled") === null) {

          localStorage.setItem('productFilterA', '');
          localStorage.setItem('productFilterB', m_site.activeFilterB() ? m_site.activeFilterB() : '');
        }

      }
    } else {
      if (m_site.activeFilterB() != val) {
        m_site.activeTags([]);
        m_site.activeFilterB(val);
        //$('.filter-helper').slideDown(300);

        if (localStorage.getItem("infiniteScrollEnabled") === null) {

          localStorage.setItem('productFilterA', m_site.activeFilterA() ? m_site.activeFilterA() : '');
          localStorage.setItem('productFilterB', val);
          localStorage.setItem('productTags', '');
        }

      } else {
        //$('.filter-helper').slideUp(300, function() {});
        m_site.activeFilterB(false);

        if (localStorage.getItem("infiniteScrollEnabled") === null) {

          localStorage.setItem('productFilterA', m_site.activeFilterA() ? m_site.activeFilterA() : '');
          localStorage.setItem('productFilterB', '');
          localStorage.setItem('productTags', '');
        }

      }
    }
  },

  showCatalogItem: function(element, index, data) {
    $('.catalog').css('display', 'none');
    $('.catalog').stop().fadeIn(400);
  },

  moveonCatalogItem: function(element, index, data) {

  },

  moveofCatalogItem: function(element, index, data) {

  },

  hideCatalogItem: function(element, index, data) {
    $('.catalog').fadeOut(400, function() {
      $(element).remove();
      $('.catalog').fadeIn()
    });
  },

  toggleProductAnimation: function(element) {

    var block = $(element).closest('.product-block');
    var popup = block.find('.product-block__popup-content');
    var front = block.find('.product-block__front');

    if (block.hasClass('product-block_mod_open')) {
      block.removeClass('product-block_mod_open');
      front.animate({ top: 0 }, 400)

    } else {
      block.addClass('product-block_mod_open');
      front.animate({ top: -popup.outerHeight() }, 400)
    }
  }
}

$(document).ready(function() {

  m_site.loadCases();
  m_site.productFiltrat = ko.computed(function() {

    var groupA = _.clone(m_site.products());

    if (m_site.activeFilterA()) {
      groupA = _.filter(groupA, function(n) {
        var subr = _.indexOf(n.groupA, m_site.activeFilterA());
        var res = subr >= 0
        return res;
      });
    }

    if (m_site.activeFilterB()) {
      groupA = _.filter(groupA, function(n) {
        var subr = _.indexOf(n.groupB, m_site.activeFilterB());
        var res = subr >= 0
        return res;
      });

      var buff = _.clone(groupA);

      m_site.tagsBuff(buff)
    }

    if (m_site.activeTags().length > 0) {

      groupA = _.filter(groupA, function(n) {
        var subr = _.intersection(n.tags, m_site.activeTags()).length;
        var res = subr >= m_site.activeTags().length;
        return res;
      });

      if (localStorage.getItem("infiniteScrollEnabled") === null) {
        localStorage.setItem('productTags', m_site.activeTags());
      }
    }

    return groupA;
  });

  m_site.grabTags = ko.computed(function() {
    if (m_site.activeFilterB()) {
      var a = _.uniq(_.flatten(_.map(m_site.tagsBuff(), 'tags')));
      var arr = [];

      _.forEach(a, function(n, key) {
        var r = _.find(tagFiltersCtx, function(ctx, idx) {
          return ctx.id === n
        });

        if (r != -1) {
          arr.push(r)
        } else {
          console.log('undefined tag: ', n)
        }
      });

      m_site.tags(_.sortBy(arr, 'caption'));


    } else {
      m_site.tags([]);
      m_site.activeTags([]);

    }
  });

  if (window.location.hash) {
    var a = window.location.hash.split('#')[1];
    m_site.activeFilterB(a);
    //$('.filter-helper').slideDown(300);
  }

  ko.applyBindings(m_site);

  //localStorage.setItem('activeFilterA', m_site.activeFilterA());
  //localStorage.setItem('activeFilterB', val);
  //localStorage.setItem('tags', '');

  if (localStorage.getItem("infiniteScrollEnabled") === null) {
    if (localStorage.getItem("productFilterA")) {
      m_site.activeFilterA(localStorage.getItem("productFilterA"));
    };

    if (localStorage.getItem("productFilterB")) {
      m_site.activeFilterB(localStorage.getItem("productFilterB"));
    };

    if (localStorage.getItem("productTags")) {
      var a = localStorage.getItem("productTags").split(',');
      m_site.activeTags(a);
    };
  }

  /*$('.product-block_mod_open').on('mouseleave', function() {
  	alert(1);
  });*/

  $(window).on('resize', function() {

    if ($('.product-block_mod_open').length > 0) {

      $('.product-block_mod_open').each(function() {
        $(this).removeClass('product-block_mod_open');
        $(this).find('.product-block__front').css('top', 0)
      });
    };

  });
})
