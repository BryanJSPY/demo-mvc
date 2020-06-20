/* NUGET: BEGIN LICENSE TEXT
 *
 * Microsoft grants you the right to use these script files for the sole
 * purpose of either: (i) interacting through your browser with the Microsoft
 * website or online service, subject to the applicable licensing or use
 * terms; or (ii) using the files as included with a Microsoft product subject
 * to that product's license terms. Microsoft reserves all other rights to the
 * files not expressly granted by Microsoft, whether by implication, estoppel
 * or otherwise. Insofar as a script file is dual licensed under GPL,
 * Microsoft neither took the code under GPL nor distributes it thereunder but
 * under the terms set out in this paragraph. All notices and licenses
 * below are for informational purposes only.
 *
 * NUGET: END LICENSE TEXT */

/**
* bootstrap.js v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter Inc.
* http://www.apache.org/licenses/LICENSE-2.0
*/
if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twʳ]�N�7� ���I�y�/�@!̇�jżl� ��x��q��e"�#Ml���&L����'"���E���y~�Qm�	�Q���S�a,�f&�%g`C_e���n�ԸɆ��o�Gx��CĮO���,E�M|H�����Kf����l�ґ"��i�dş:Y�Uܖ-Y0���Tz�~���wߛL,n�]�=5�^-S"�(��i=n��� ��]ӛ�;j��5�����1�H,D^w �
����_�3���kd\����o<\XF<T���mx͂�*:*����|��P��{f�t%�-Z
��aA����m���
��KPzF<]������$�@�F��1��Ni�%�ɲ�~�ل��e���bx�l��3�_h���M��j����!�_�p4.(�l δ�9QL�4���A(�&v��s}:z�U�^��wwmo����>�'��4����>��%��P7RV%D�K��͠&�Hs�f���QLs����/#<��d��@%؍�:��{�!��q�b�|�uW�n�����34�X7R6��ON�cv9�=Rc��R�����ے���yR�N��5q�bX;I4��q%�{3�KP��=U�R���6�4�zFۦ�hU)6�9�����{<���8�����3��<�Y�uD�v�2�I6�3�cc!�!d,����l�Ud�u��KX|�Gֽ�����Ͳ������ʤՓG�2k�?�z��������R��w6���RFe0i�|�aC��˰�u��M(�Y7��rF�T��ُ�ن|Mu�Y���7���G�-�ua�eZ��ܑ�"Hc,�z{�{��JnQ�vҡ�ʃ((��de������"
���i�կ��{�<�j��X�d��mˇ%B]o����_���<8�mޏ3�K��f�}��'�D�̋9[�6�4ϣ�gZ�\�(�7/o^7^p@>�+86՝+�)˿��b|h�A����Ph�f�h��A:��m�В����eӀ�wρw��=�����>�&8Y�v�Gɽ�+ܱ}��_K�O��L
��É�]���^�����9D��J@�g-@�A�n��Qk��`N~��o�m����5�֦׮��r��M�Gf�y�,��Dg�RBr�JS90�"�zTz�=3/�-ӂ+�:��B�ȹ07n�Ҋ�>7�NPc_9�\j����W�(�<#G�z�c͊��֡�k���}�$ۇz<o��T���чa����L��-�wUG/"���2^�<[P�5�_4�b�f�U�8gP�&
QR8�$��o	s_M����h�Mוr�XM��p|ZȮ}�:[ŧރظV@�3�j�}�gT=3�}��3>�mc�w���7��X�#L�2J#�~IpD��;�3��s=s�C��4^��2�������1���Y�\=Fx0�Rfs��8s��]:nXꄨ��y�М���:O��6����q�U<׶᮴J¼R-Ԡ#���Z����	so�g�J/�T�\~/�N�5������H*�4%m�ܟP�ٜ������_��w�vcĐ��˻������v#��>l�O@��ۻ��%�2���ń�b�����'#D� vuQ�Z�&��]�9��1�~�\6��B��f2��1�� ���@�}�08�=�ƕ�n��-��Y^�0S�+��1D:-E_�=3������ou^V�,낰�&�Ң���������1�3S9�e5L}k#3$�O�̸����5Yഘ��!����Q�������^��.~L��t@�C�e��A�l\ZUL��v� q�$�ɪ?j�6�[�.Zs�,%��$�2g5eVe[�{���j�g���,*��~�B�I�
j��Rf�����-�@���[�A�Ew�ğc�Y�#?��Cj���p��p�DҾ�W�P�[�;��D7=�U�0�����L�l��^~�FC��%��>���KA���z%��n֝.Qͩ'�r������O��V��n*\�{�έ$׾�X|�Qg�3D�݉�$��qaD��K���t���C��)OЎ�7Kl��a�R�Q�m%W����ih�<���T���΃�,���z�g�D����r�.B��M�z��2��amn���Of��V��|�� V�~�Q֞���1�K-@�Іk2"K͵Z��N�����QV��"�8�d��?Kz�yR
"w��e���$����T�ύI�`����*���)<@���{��i]���V��+ <��s���C�f�i�+�`O���$�m��:ǫ=D}Kc�+b�8��\��n\3�ڌ3Zw��sE�td�c��.�/�-�����lQ&Ps]�'s}�R�1�c��p����Z�3�e>崚&�L���h��/_frx��;�c%#�c)�g3m��uarF"m5щ��zrG����5#���t����g��,��B^߃�[3�����[OYۦ.���iU�R?���l�h#l�҃>�t�C�����;��D��^M�
Y�Zu$�vo��{��!�MRj-����qq<�	���>b����z~�MV��������i̐dw�a(}�@h22y��Mԭ
l����PZ1&K�����|����5zŀ˘�W�ƭk��P����A)���0���PI�P��.(\�����y��5� �'?���NC�)����WA;�Y]�Զ����k-L��?: ]�g�R]��A۳-�y+�M�D9�g�_�M�ە��ώ�)]�,�Һ��zK_���"[g)8���Q=X��r�ܧ$-g�G��T����ޯhN	��g$�N����e	V�\D�j̤�o��L�������@��2����Ӧ�ks�'��x ���[��,�Sk��a��d��nd�
��m9A��n�8?ϖ��_�bKR��;L�w!�+?��C47���q���a��S�w�;X�5��:��+�p/�}���]�f6�p�Q�<���j;t����F��b-��g�!b���:ʻD�BP���Q��9&��#�H+S'*�#�Ιc�垸��F>u��| m��)�'+$�B���lnڹ���e���	��v2�5]���eo�ф���,Aq�������A������JLh64?%Uu���p�o�F��-(�A����2rTٖ�^5m���)�H�W؝�rQZE�'����l�;Q 57�)42h��1�M�C�:�Q�ʵ�K?c��ށ�c���F�;/�R����fx�̥��zg��
��,~�HЊe�ryV�8��k�-@��ȯ��� 4KZ����zK��>���A$�:��sŶ��Q���Z��>�j��$!�|{^85C��>�r=�R��ͤ����l6����u��4�s�,��u�4ޠo�挻R��� �����7�V�u!#1G oޤ2���9(O������J����V�~k#�q������ �'hM��;v�%��m�D�0k&	��0�:@�t���,�\�~U�Ês���0o��Њ����_6f��j� �j��T�x%�x��2��,���6��ń~1?�iW�@��%�˜��,��L�tv!��P����d���q�(�Xm�UŨO>�Q=�p���3����tޣN�}����'߲W�$��;���������8+gk��)�'_��߫5�qgM�2	���S�<��:���������%Z�'tS�0�1��,(��x�񬾂b�uy��A�m䏄o�c�Ⱥ�@�s�6��6� ��X�/(DEƑK-������gr��ͣ�5�.��ג���e���28_̃\ȉ�{A�"����{��s��[��p���������Ār�t,�^�b��Fa��B�mZ
�U���:y��. +/��`2H��b�8܉_]�$ ���V|?R��̅��L|.WYal�|a'u�=�.�{/�T7�He�D���rf|xzsx����p7�yyӼ��sPǬNH7�2֒�ά 85����]�Q؋Z��9E�����.�-ִ�2�bg[؛�8� ߸)�9��	��R�6�,{)�[��N�9����:�4D�-n�u ?T'�>IS�p�M���py�!<&����38 s"Jщ|k�a��p��]c$�:<��L�D�:��Ģ�>Z�L<9؝�'yk�+C�'x"Ɠ���&�i���\z����i��Ы�1���='%�{7�3�7p&�hzc��Tkm�e����Ti���n8�����;��3��Q�mX�A�1h�f+�F^V��7��)��TrQ<y�(�.�?���Ok|3���k`�b�aĒgXWa�B�R��$�����<ꞎ'���Ƕ%	��w��ɑ���w�C^��TbDB7�t弣��v�\K�5���QK,���.J
q��'�}�9˽�_gt�/����Vk��c��	��~�$&����ˈ�Q�t�um��yA������/��+5�g�<˶}�3�Al���w��~��Lm��vQ�Y_H�C*�;*�;��݀�=�$�_k����/����1�#�6{��k�a�n�v$Q���=ya嚃TEڙ�w��n�*��& ��m��;(��<�e8�vU�\���9aq[��Q�<��3�ϓXw�w݃k�:.�w��+�:��w=�.��u�\�v導1��1i�Xp��8	"�?�����:�M��E�_��_@;�Qs�Sk�Ŋ���ܖ+P��A����ᝅ�Q�9��qU�v�S��M��x������Bk��������5vI
�up��������fiT}W?ݶ�ӡ�й�5���q>�F�AN|m)�����u^�ے�z�0�����
=����m�_{�+²��qf��I���Ӣ_���2���Lbf=;-��D7B)*.�(L�L쐆q�|;�M��ch�9:�1�/����9v��I m��V��\l��͠	���m�� ����rip��2�Z�|��A���'�'�ٰ����j�/�W����Y����&~H��d��$yH�c�8A�k�������W��jR�4�Jm2X>��q��)�$֡�o�]�.XO���V���nF�f ���P�����]�r���}��T�~+ �@���5�����T�b&�1��ʨ+ڊU���v���m�T����x�\�6;#�br�uԣo�Xv�1\W��������KF&5лI��-�+��}�IW�o3�BT�5�gM�x*֨�/k����4Щ�OR~{�M��Il���*5�j�`�,�:���8���{�2��Bh�}��-OBg]��q�Xe��/B&ii��	7_��7�u�<$��#���uX�RT��7��n0���'o�WU�3���/o3�����H��?B�8j��{"�[���&���ܞ5z�1�>c�w�+�5B؆[U�z3��=ELaI]1�4�+���-���7��at*��Q>CG�k[��Њ��Y��������F��ﶛNrT��	�HWO���U�f�Z�W�t���ꑜ��`ыS"m�C�Wk�3�$,�/_)0�])>0����Z�F�8���h��o���ci�b'O#ߤ��o����5'�Mc�;T�E#siߜ�����F�z}�v�wU�}d�w��m/U�8�}Msu��6�+��HP���5�㱏4�V~�jgţJ��,�կ0Xݥ��>k�|�.��yY�E�DmA����M:Q3^ ą�I
��#�i�{�w�#g-z���m��`���`?lߥ����2��K�=W�,t�79ӟ�3���!��k09� �{W�~��X�\��{��
�f��~��+��	#�3~���oL	���g��K�7���N�̪� �r�Ət��-�qj��`�Y;�\�lo�b&�?��W��+��%���n��u�pI�F��2�pi�]����g����wk��}�*zz1J��hU�i��cq2��P�#T���O�I���ğ�F���FI��ڗjTB�U��O��q>�'��]�E�O�fVY��H�������9]l��`3���YƃL�a���������+s8z� ��%8���_����ŏ>�h�����5��ɉ"��SrU�,*�<�8;�I�_m {���/;un�o�nL�:�GG|�v�J>�F�.�rY�C���p����#���3�R�W�����^�󻉍��6�TR� �f틺 �<�M�����2��Ц+��^��a=��!eB��x��R�Ⰹ�G+��H٦rY���0SL�V�6��4�1wǲD*�"�{�Gx�]���?��"��T_��?"KF�tP���J���\:�޲MR�ש%4bA�	�?����;���Q��j��m�<�RĊ^��|�ޯ��Z��(�,/RD�wj��G�u�*bw��{�m�	�����.q�C��(�E��{&(5Ǔ�>jݍm�*�����g�m7]S�.��6�y�,Jd�ժ7��
,��gYꗿ������L��^�3<�2�I(:�]G mG^�j��]��ɾʄ|pN�+{*
�����n�j6�}q���t1%	;j.�}9�n�O��߹>3���oh�iO?&n%߿)>-;,ۊ:;�:;v���4�n��M�Qը!�s��2��P��OCH`*�'�7��]�FJK�=#���!u�Őgl>?�]���y��G;��Y�K���w�PmwP�(9,uV�ſ�~B�E��V�rs�R�vs��(�p]I܆�?�}��816�e��9���!3=�b������*p0��v�P �;��|�����V��	�A������/V�fv}���Ϛ�؟��[�7�.�n�}�'/i�WU�W�<�j��*6Ӌ��.��<��wլ�����N��VnǠ��!�H�����f��3��sݢ��KgU�9�b������柗e��u���2=�#$���J�![��(�?b�7�C���Q��Ϋ*ӁZNTk�$b�h�jw�Y��K�\S*���^�ie�?��o
p�ʷ5�e�����E/�ϕ�:ʔ�����}��KoY��6���:ʦ�.7���5���'SKj39����vLAi܍�5�	�2ɴ5�Kʚ�<	�K�s�M����u4�?���֮�3�ɣ���MBr��M[����p4����+{+�Jwk˞������2��kC^�Ys4a"������-=�6�>h����8萆�J}���K)���iME�"�T���O���3�O��+�"&r�X����RF��yJ�R�kA�������t Ż"���\�Onxn����u����*������iMx|�;xue�I��h��2���M����Փq�L�ߠ����ѻ�N�l
����0����>�TPD_�%B�b�e^Vq�#��lY��P�u�l:ԏ4���� q�ќ���cif�y�VD��*;���d�)!c����4>F�ȑ��5l_�$i�5u���񷰂���KrϢ΢��w�uK�}���2n���T{x<��~f[(i�c3�,?3�jSQ�7?�O�k'�����[,hiV�O��YՂѴ�Z�\�{OT��{��9�jpK-M�L@A]?$���J6r�t�O����TX#>����YUy�4��z�����v㝊ͨ�N�;b��	O���$�}�ĝ)�"��y�'�6p��z���6-児���2���DF�e�Jq��$x�"���E�'�P��?r�����6��Ȣ��p�pq�1��U��ܵȵ�]R�W��%�*�*�}*���!DRJ��sri�%b,���$�����&�*܂J�ۥR����}*����-��%
�	��n�|od�>�pޑ������_C���ۇFjp��&jVh��8e2&�S�{R�k�5��4� �(A��
8x�/���Mi/]�^V_:�$�[(���
�J��#���X��yL̏<.�y�y��}���:��a,z��I����E�W7�v�"��h�J��Ȳ�������#�*]��n�\�n|�j�/��>M|?�c⿰����=)�m끯������O>�=g@�P>
a����"|f�<*9V�?M��]T�J�MW�NQ���|1�9����J��F��HN]�O�����1����:�K���ŰјS��.6�UC�i8����~�
p���C%>�4�4���.��.%�iڰᛓ�S}qy@B�udXk��1%riAH[K��"{J�$E9_���)g�d��m�A4g㘕����7���Z�ߵ��4�!��Y���x��H��<����8�gc��`���� u��)��fQ"�W�*<z��D�ܢ96�����g>a�N����z$vﵘ'��Ҙwۅ��GuEW��/��6ED�<o��	�8�o/nQ�"B�6�Ɉ�����Gv�"'�?�6����Ֆ����m<�5��w�xN�X=�����l����@�u�h��H'�Ӿ�Q�MXQ&QO��<(6Υv}�k�?�����h��_��~�~�|2�����Ge�K�pJ'����M�'�7d,ҕ��lP�L8��:����F�c�ЉIa����-Z���0IT�_�����ډ�b�7���u��H
L	��Gst�յ�k3c��$&>��=j=�i+����;��P}�����_�A�%nB�PoSތ��iV�h�F	]~�W�\� ���g0��'�|T����Q�%��1���+����|�;�9�NhF��~\m<~M�g��A���ow�qfB�L���ҤlCN�qf����U��pó���X�	�� 5!Py����C0M����H��Og�o�����8��<rO����^e�8�8���v�]����r�$�-���s��)NR����V��v��*���i����j0/�U����;�qG�r�T��?p�M����:^�U}#�����-����=�h�4�����i �i�i�E���*e撸)�)EZ��Lx��m�;(h�g������9G�&螬#,k��y�S� �M3[~���T.���L����=W��>�e�]�$��t	���7Z�ߎ߯��o�?��Y�J�LS��"�Zpx�)sx�o�������nxe�kz�8�w�앐7Eu#T�2�2�+.�y�|��Q�yj�$��
u�u|C�Aw�M]��{�4�΃���X���u�<��b;�x�5;\c�������i��0�� M��Ԉؚ�	Zlt[\Lv�\0��2	Z#9XHK�\+. ~�Ѵ�����^�I���Yr?Wݲ���CG.�DuPY���}�*5=��GZ���{\��[��"0 DZ�>>�ӿ��>����Ҙ��s��7�pR��&N�!W-C�1c�{������.��!n�ssY�HO_���b�8o�8�9�]�;��	��gT��7�O��
j���f�H�.H�H7��N�W�>g�Y�|�Jj��kH�	Tq�����B��vkGHs(?����[������V�]zE��/ZWq�z5D�����!~�pz�1˸��2
�*�plR���S�`����/�t�,
6�8��(�J���"G[C���H��b��Yy��E��5�ڴ��ڕE���2���=o�e�	�
S�eF���L�q��VO��ֲ�m�aCy�y7w�Ѻ}�(����~.�S�P������ኼt�tq�]���RG����NR��_ =;�$M
Y�4���oA��)Y��qK[�L�k�M��{h��<ɴ|��v���8���X8��w��ml�k�k��� M�j�p�)�-�I�ҚD��hɪ�<���d�lu�y��B���ӈ`���:���H^|��1�bt�>���캿Y,mE-Q��㠂��X��93˃�;��X�aa���W����5B���7���
�{4!(�X�;�S�E����S�j��������3�V�Tj��ƺ�MF�������$�
kIR**��M�+��\͕K�.i�5m]"��2��(������U��:�f�_�F�sr��Ht��Ⱥ]O	�,20-���lfnq	��#܊\K�b����rR��NHŸ�5}rI�+���N���$@�n�Z�ǅ%��8�����<n��o�b���_��L#F��Ś�F���cq��BI�RM^s���uwo��5,[���jS�i����|���;��7ƅb�N�ֿ����{߻|�o?0�.u1�[��/R7
X����ub�*�g��?;����m��Cѫ֍��B$V��)�-�5�Z�!��Xӹ.�{�o$��a�8̻�����y{980��J��w;��#|��K��	�JN���I�OT���T��I5��0�����OC_�{��2��lDLR1�9��yLA(GH�k�7��?`W�����ߦZ"D'՝�@  ����l�"������?_ݼJ��L�G�y�`<7�O;.Ei�-�6&b�OH�z�#�B.<h��=h)^�##�U7��%��C��`���E�(->�f�.�Vd�5ԡIy�ya�~Ɍ^}$�U����)���i�7���քbc�z{�o��!_��R�o�g�^� G�H�I�77;��3#S�d�#xr ���R�H�p�(�]�q4�����<�(O��-���M�k���˓��%R��rh�E��Ӿ��`T����J�H�"v����	�˓��+��Yw*����9�o�	��:[�xq�М�^JC�Ҝ�0�)�f^Z�0��ػ0'h �H�C�CJd����(@�~��^��F�>l�X^����SG��1�����1b���W>�W.}��O�Vڍ��el'mO��̋y�ev�Df�fi<�CH�e�Ky�/�̻��������Z�h?�#���? ���U�Q�	����b�q8޺�0�W��:t�����~�]��Q��&F�i���(]�����1����遤���q�a�]$�N9�d��������5oK^��)���^���c�E�_�vn��&�yo��9��Z���ޒ}5��ɹΗm�!Ŧ&��`��W���d�C-^�т�r�^�H��7�)'_�+f��
9c��O��ӝa�d)11�Ψ�t�[[�Ҙ�����W��Y����mf��δ��b �w  �w��C����A�؊�������II�Õ!���, �2Wv����U ���@��ք��B�)�Q���YS#�;�3���L6��g�9�X[	����,\cn]�.�a�4�o�ώ�N4��������v�g�M�����C��Y���$0"����3�g�����ڵ���=5'O�p�O�m{4�Ϭ����f����+�5���rȍ.�M;%��p�M��2�z��W���4-�����㎯�E���O)����G
\{S���:=������W�9o��緧R��[B
]��~UW+�7n��
�*�a�/�w�-XT�O�K叡���H|ş.^�:��ۅ�:�;��5R�� 8�]ֱ�Ɲ���O`��nw�l�A��C�uh���x����%WKW�c�e��b�B�,��TZ��,��,�ޣg�U{�����	]���?,s$�Bf�������5��w���U$(+\d�,�b񥋡��͘RuuRo��#����"Y�ո�W��M�$i��G��H5�J���XT�ΨY^[��f(�=lw`���( P��O۰gX��k*���:X�Ə~lf��n���<�ȫ�r-$3_]����h��z󇁲���a�q,?UV����w��2�v4�N�$x�E ʪ2�RZ�최,���H0�bO�4e�B���{(�����4���{���9V!c��q���'��p8p�c�RȰ�W71-%v�M@���h��
�g��^*/fF@�{q�8��`�����E���f�O�[̖^o�Ư����㇁�4�f��1���:#���q#�V0Wn�Q�]����&���G�҉�4D����{����n5��O>`*�@�ش2��a�E��*-�R��40��V,��d�f�q��|��(�[�� L���eL�N���r�vt�8�Tkf kQ ����R-�ޝ��ߩ�~���Ѣ1��S�d��q��_����/����Ԯ��