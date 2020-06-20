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
 * Copyright 2012 TwÊ³]ÍNË7® ğ±ƒI‚yê/ï@!Ì‡ŸjÅ¼lñ ’‚xûµq«ùe"ä”#Ml¯°í&LËáşî'"µÃøE•ÏÚy~ˆQm©	ˆQ¼ÍìSña,Æf&İ%g`C_e‰ğ×n…Ô¸É†ù‡o„Gx­ÊCÄ®O¡ƒì,EƒM|H½’¡êÇKf÷—Çäl±Ò‘"²¡i²dÅŸ:Y¡UÜ–-Y0Â‹Tzš~…­Äwß›L,nò€„]Õ=5ì^-S"ñ§(³ëi=nëÙØ Ã]Ó›ˆ;j™³5¬±şæé1H,D^w Ş
Íûİ×_·3Ÿ—çkd\¶ÜÆÙo<\XF<T©ímxÍ‚İ*:*ş–´|‹P¢¡{fò´t%Ù-Z
ïªaA³’‘•mĞÀè
­KPzF<]„”ò™üƒ¾$«@¡F Ÿ1ÆŞNiŒ%İÉ²Ó~ºÙ„¨å¿eÁÜbxôlî´ä3Ò_hŠŸãMäjØï·Ùé•!í_Ôp4.(¨l Î´Á9QL«4“ÃÄA(Á&vÎí‹s}:z»U^ª…wwmoÉí±ØÔ>‰'à‹4§÷›ƒ>©%÷‹P7RV%D¢K·€Í &ÒHs…f¼ş†QLs·ŒÍ/#<ôıd÷ç‰@%Øë‚:Ûı{À!½ûq‘bö|ŸuWè†nÄÒî×·34X7R6»ONºcv9Ê=RcìÚRå‚À¶ÏÅÛ’ã²ÈêyR•NŒñ5q•bX;I4±éq%÷{3å¨KPûº=UşRƒ¥é‘6Ş4èzFÛ¦ºhU)6±9¹††Ûò{<ãŞå8ü¢ô“3µã<Y…uDævÒ2ŸI6³3“cc!ó!d,¼©ğÈlËUduÜÇKX|³GÖ½ÙÅÊùÒÍ²À–û°×ñŠÊ¤Õ“GÆ2k¥?´zÔöàóóÇÚùRØşw6éıñRFe0iæ¨|…aCÍË°¡uêÆM(­Y7•¹rFşTğšäŒÙ¡Ù†|Mu”Y—Ïü7è®âGò-uaî“eZìúÜ‘Ü"Hc,€z{õ{•‰JnQ¶vÒ¡çÊƒ((¼deˆ£¿Ûğ"
ş®¡iœÕ¯–€{Š<Õjˆ“X·d„õmË‡%B]o‡”şÌ_‚½<8úmŞ3×Kš×fŒ}Âã'³DÇÌ‹9[Ü6Æ4Ï£ÜgZñ\Å(õ7/o^7^p@>º+86Õ+³)Ë¿Áùb|hõAø®úÌPhûf¶hûæA:¼èm­Ğ’ıÜÂÈeÓ€ßwÏwıº=Ÿ´—»Õ>®&8YóvµGÉ½…+Ü±}„_KÂOÍÌL
œ´Ã‰Í]“Ôò^‚Ó×ı—9Dı¿J@°g-@á…Aãn“‡Qk¼·`N~µÒoÀm½°ç5ÇÖ¦×®¢ärÎÈÂˆMÌGfõyÁ,›«DgRBrŠJS90Õ"ŸzTz×=3/Í-Ó‚+í:†³BÈ¹07n™ÒŠò„>7ÉNPc_9õ\j€”ó»·€WÑ(ğ´<#GŞz®cÍŠªâÖ¡ôkü²Ä}·$Û‡z<oàãT«ÓÀÑ‡aŸ‰¦ÈL²Â- wUG/"ÏÃé2^¯<[P…5_4ïb‹f®Uø8gP¦&
QR8÷$Êo	s_M–™”„hªM×•r“XM¨ÿp|ZÈ®}Ğ:[Å§ŞƒØ¸V@·3¡jú}ìgT=3¡}˜¤3>mcæwïŞ»7ÇâX½#Ló2J#«~IpDßô;§3æÃs=s´Cõˆ4^÷¨2ª–…áìí¡1Ùş¨Y‡\=Fx0°RfsÜä8sàÜ]:nXê„¨«ây‹Ğœ·Çé:OÁ‚6Ãö—ìqØU<×¶á®´JÂ¼R-Ô #Öòñ•Z°·	soâgˆJ/ÉTœ\~/ÃN¢5¨›ú§¤ÅH*”4%m¦ÜŸP…Ùœ†¬û–şõ_–„w¡vcÄÎÓË»÷»Öú¨v#êÃ>lÅO@üàÛ»í²¬%á“2Ìúè³Å„©bİßÿı'#DÑ vuQäZ&ú”]ß9Çü1É~Ş\6µæB™¬f2€ç1™¥ •âÌ@ã}‰08ò=ëÆ•™nÈí-É Y^•0SÜ+ŸĞ1D:-E_å=3ø²ƒÊÌou^VÃ,ë‚°Ê&…Ò¢¸• ¶»âë€Ö1±3S9Ÿe5L}k#3$»OêÌ¸ş®ëë5Yà´˜ò¨Í!¸³îõQ…û¶¦¸‡÷^ëÂ.~Lóêt@ëCéešıAÔl\ZULùÚvå qÓ$«Éª?j€6€[™.Zsá,%­º$çª2g5eVe[´{ìØ–jÊg“,*¢~‰Bò»¶IÙ
jÈáRf’“«·-¾@²Åõ[àAñ™EwÄŸcşY#?¿Cj ¸ápäŸp£DÒ¾ñ¶WPœ[³;©“D7=ÎU»0¬º™†Lñlêğ‹^~¿FCÖ×%ºÊ>ÿÈçKAŒ©z%üÌnÖ.QÍ©'Ær”­¼ÂöOŠÒV¶•n*\²{¢Î­$×¾ÙX|êQg»3Dœİ‰ì$ÑıqaDÙáKÿ–tû¬îCáø)OĞ“7Kláùa§R‹Qçm%W–½›ihŸ<ıÄüT ğçÎƒÿ,‘ ã¹zÍg»DİÏèärò.B“MózÆ¹2¸…amnÙÖÉOfàé“V¬Ù|†á V¤~ÓQÖÿ½1öK-@“Ğ†k2"KÍµZ„ÙNœíæÆÜQVµ¡"í8Ûd‹÷?Kz˜yR
"wí£ÛeñÛ†$şù–°T‘ÏI¯`éáùğ*³úÔ)<@¦¸Å{¸ùi]“‹V³­+ <ñÊsÆ†C»fîiû+¸`Oé‹ø†$¢m™¶:Ç«=D}Kc”+b˜8«Ü\¢·n\3íÚŒ3Zwš‡sE”td¹cºÊ.Ñ/ƒ-åå±Á½lQ&Ps]Ó's}ÔR§1î…c²›pûæü“Z¾3€e>å´š&ÅL­âíh‰¶/_frxÙâ³;Ûc%#Ûc)ƒg3mìÃuarF"m5Ñ‰ÛêzrG£ü‚Ó5#­ÁÑtûÚôÊgšå,ı‘B^ßƒœ[3£­”ü¬[OYÛ¦.•³ÁiUÛR?úÚÔl©h#l‘Òƒ>tïCû±ù¶Ç;ÆD–™^MÍ
YÂZu$ÖvoºÌ{ØÍ!ĞMRj-û÷šÀqq<	õáú>b³ôÓÇz~áMV÷îğßÆşôiÌdw¤a(}‰@h22yÅÅMÔ­
lÏøöîPZ1&KŸ‚¹™Ø|ƒÇöÃ5zÅ€Ë˜¬WäÆ­kÿ¡Põ‘—çA)µ„Ë0û®ŠPI’PÉÛ.(\¤ôª÷±yĞø5“ º'?£ÀĞNCÍ)¶Ç…ÆWA;şY]ÊÔ¶íÓéïk-LÑû?: ]ÔgÊR]äÂAÛ³-øy+óMôD9§gÙ_¦M¶Û•ŠŞÏ)]ï,ÉÒºŞÖzK_œíä"[g)8·öÏQ=X‡ØrÜ§$-gªGÂîTÂÑÇ¦Ş¯hN	¤„g$˜N‚¿ÈÚe	Væ€\DæŸjÌ¤­o ²L‰…ş—®¸@ãö2óŠ­©Ó¦¨ksÑ'Íx ª²™[ÿë,ùSkûãa©¿d»ªnd—
şùm9A¤¼n„8?Ï–’Š_ªbKRˆ–;L€w!Ù+?…ŞC47…—àq›İaŞôS›wì;X÷5ì–ó¤:·‡+Ép/Ö}êŒşô]ğf6½pŠQ˜<À’¹î·´j;t­™ÙÕF¯Æb-”Ëgó!b— å:Ê»D¸BPØàQ˜”9&¹ğ#ÎH+S'*Û#„Î™cëå¸‡F>u¯…| mŸ )„'+$B‡ùŸlnÚ¹ìÙËeªÙ‘	–Êv2©5]ØçÏeoöÑ„ÜÇô,Aq‘²Çí‰ïÿAÆŸ‹¼Ÿ¥JLh64?%UuÛ­èp½oæF²£-(™A›ı¬ãŸ2rTÙ–û^5mı‰…)òH–WØ½rQZEÃ'ôËİÔl˜;Q 57«)42hƒı1ëM‘Cñ°:QÔÊµ²K?cÀàŞ¼c£ÍêFåƒ;/¨RïùÁºfx©Ì¥Õğzg„ê¯
úî,~ÖHĞŠeryV†8Èìk¶-@“ÀÈ¯”³ô 4KZ™äâzKˆò>¹¸ëA$ì:ÄÁsÅ¶öÎQ©óÎZáì>ûjŠ®$!ş|{^85Cõœ> r=´R¨—Í¤İÁõ†l6ÌÉğ¶éu¹¤4sÑ,‘u©4Ş oÆæŒ»RƒúÙ µîÈÁ‚7ûV™u!#1G oŞ¤2Ÿ½¯9(O’‹­ûJ·±V”~k#ìq¨éèéü¨ „'hMí§ó;vÊ%šÅmøDˆ0k&	òÃ0È:@×t¾áå,›\¾~UÖÃŠs¸ÙĞ0o¤ÙĞŠ“…Äç_6fÆÅjµ ±j´ØT¸x%öxñ£2»™,íÚò6»™Å„~1?ïiW×@¥Å%ÆËœŠ²,ŸÜLÓtv!¿PÖÕÒĞdÎ¾¥q‹(ëXm¾UÅ¨O>ÇQ=îp³ğü3öçªötŞ£Nè}ó­å«'ß²W¿$¬;ğöÙí²òùƒ´è8+gkÿ½)›'_³ßß«5óˆqgM¤2	¨ŒğSİ<ƒæ:ÓÉÀŸ«Ÿüõª%ZĞ'tS§0“1ô¼,(¼Éxóñ¬¾‚bäuyÚÁAûmä„o£cñÈºÕ@Ús†6†é6¤ ş¼Xû/(DEÆ‘K-¡ÅÀæ¡ògrª‡Í£â5ş.šÊ×’ü”½e ûŠ28_Ìƒ\È‰‘{Aä¸"ï¹åÁõ{ÎïsğÏ[¤pÌıñÈğà¿‡”×Ä€rĞt,á^·bŒªFa·ŸB­mZ
ãUè¿‰:y–ü. +/ŸÊ`2Hòábë8Ü‰_]Ù$ º¨óV|?RßêÌ…ÔÑL|.WYalÆ|a'uè=‡.•{/‘T7ÛHe‚D³°’rf|xzsx°÷„Èp7¹yyÓ¼û³sPÇ¬NH7à2Ö’ÃÎ¬ 85’•«Ì]‹QØ‹Zø›9E„ˆñİÕ.˜-Ö´Î2Ùbg[Ø›ø8Ã ß¸)9´­	ïçR¯6è,{)¶[–æNÉ9´ùú»:º4DÕ-n‚u ?T'­>IS×pà¸MšÓÖpyÿ!<&ŠÀ©38 s"JÑ‰|k–aÈñ„p–İ]c$¼:<ÜüLÎD:ÀŞÄ¢Û>Z™L<9Ø÷'ykÅ+C¢'x"Æ“²ªà&“iô¦Ã\zÙñîŸi˜ÏĞ«µ1¦¸='%²{7¦3»7p&¼hzcÛî±Tkmì•e¯µ’ÃTi´ûn8¦­ğôˆ;ù³3µÈQ†mXòA²1hôf+F^V7’£)ö‚TrQ<y¡(’.¬?†ÑOk|3©†™k`ôbãaÄ’gXWaŸB„R²±$©‚™ªñ<ê'÷ô’Ç¶%	êõw³†É‘êõôwÿC^“±TbDB7ïtå¼£¾Év¦\KÍ5½ QK,åÛÓ.J
q‘Ó'¯}°9Ë½Â_gtŠ/ô’ÏåVk‚¦c«¤	èÅ~è$&©©ú÷ËˆQÇtºum¨ºyAıëÅÚÕú/âô+5áƒg¼<Ë¶}3îAlœï“‚çÅw™¢~„ÃLmÃèvQ¼Y_H­C*½;*ı;¶“İ€¾=ì$Ÿ_k—¦“Ü/£›„1¨#Ü6{¾Ékña²n¡v$Q¹Ïë„=yaåšƒTEÚ™‹wœ™n*õĞ& —émÉğ;(¢è<¾e8ÌvU\’òú9aq[óîQÔ<øú3ıÏ“XwæwİƒkÀ:.øw‘é+›:ÔÈw=‹.°›uƒ\Ívå°1ßÏ1iXpÜÇ8	"ï?„ËäÑğ:®M”èE_ı_@;‚Qs¡SkçÅŠØóÔÜ–+P–ÒA æäÙá…ÿQ«9ûqUĞvúSş¯Mÿüx•ğ‰æÍşBkÂöùåëËôÿù5vI
¬upÃ‹ˆåê¸ÛÀ‘fiT}W?İ¶øÓ¡ÍĞ¹ˆ5„q>ãF‰AN|m)¹™»µğ§u^ŞÛ’‘z±0¾ °Ê÷
=ºÙ¬mÒ_{Á+Â²¦á»qf•óIÿ¹åÓ¢_ÊÀø2ƒÇLbf=;-¯ğD7B)*.Ã(Lóµ®Lì†qœ|;µMÄ÷ch’9:Ç1ê/ùƒûá9v¤™I mˆşV¡¾\lãÍ 	”±mÌö ûĞö‹rip´Æ2çZ¦|ÜÍA˜³ä'­'İÙ°õ‡÷øj¢/´WÙİçÆYÀìôš&~HŸ´d¨ë$yH‡c´8AÔkèşüœ˜±­W¹‹jR§4©Jm2X>ÏÄqàğ)ª$Ö¡­oÉ]Â.XO³ŒŸV·¬ÕnFóf ¶PĞğæ¯]úr‹°ş}ĞÉTÆ~+ Á@Çìæ5¢Áü·­Tîb&À1‡’Ê¨+ÚŠUÉĞÇv²¢m¼T‘ú¶x¤\É6;#ê”brå“uÔ£oXvÜ1\W¯¨›ı—ĞßıKF&5Ğ»Iô–-ê+“º}IW¬o3ÏBTê5ÆgM¦x*Ö¨¶/k¢¨£†4Ğ© OR~{üMšÌIl„ï–*5ÃjÜ`Ë,Ş:‘½›8Š{Ï2ôÇBh¢}º°-OBg]¤ãqùXe¤ã/B&iiÆÏ	7_ù7ôu<$ÉÛ#ƒ…ôuXæRT²±7‚®n0—Ø÷'oWU˜3·ëŞ/o3´„·¾¿Hôé?B÷8jƒ…{"Ş[©©¤&«õÇÜ5zæ1Ò>c÷wÒ+5BØ†[U³z3èÀ=ELaI]1„4×+®½õ-ãÂó7ä÷at*ÈîQ>CGêk[±»ĞŠĞæYÅÈÏÓèµäÙFÜÆï¶›NrTœ¤	õHWO÷„»Uâ™f’ZœWÙt²ü–ê‘œÙŞ`Ñ‹S"mòC‚Wk‡3¡$,æƒ/_)0Ú])>0ˆ÷‰óZá»F¢8¤„ãhÖo¦¾Öcib'O#ß¤º»o­•°è5'¬Mcº;TêE#sißœ›ÎäÀÔFØz}¯v¤wU¤}dŒw¿¨m/Uç8ƒ}Msuô­6¼+ÍÁHP»¬«5Ãã±4ĞV~’jgÅ£JÊè,¤Õ¯0Xİ¥³Õ>k¼|Ã.³ÍyY¯EõDmAÙÚÿ°M:Q3^ Ä…ÏI
–Ä#Âiè{°w#g-z°ŸŞmÓß`ÇãÜ`?lß¥¾şËâ2¾ÛKé=Wã,t¬79ÓŸ®3Š³¢!²ùk09› Ë{Wó~¨ÉXƒ\ÿí{¯°
Œfˆ¾~§+‡œ	#Ò3~»§âoL	àéƒÅg‰ˆKÄ7õñ‰ÑNŸÌªÔ ôrÆt†ğ-Ãqj—È`·Y;ï\«loøb&Ç?¦´W–ï¨+ÈÃ%‰•¨n¡¦uğpIæFü¡2¨piä]İı‰ßgşäØÀwk¬¨}‰*zz1J¦õhUäi‹ªcq2ìôP¶#T…ÄœOşIÚÅêÄŸ¥F–äèFI‡ÌÚ—jTBÛUƒüOÂËq>ğ'™Ò]ôEöOÓfVYÄ÷H°ÈìÚÅÕñ9]l¥Ä`3ÜÁìYÆƒL¶a¥–¯ÓËÇóàå+s8z¨ Š÷%8©©ñ²_½‰½‰Å>ÿhäÃø¬¢5µÙÉ‰"¥àSrU–,*•<á8;I›_m {²¸/;un¾o·nL:¿GG|‹v›J>³FÃ.¥rYÓC¶±Õp‹îí‹å#µ“”3ûR²Wòø¥şŠ^€ó»‰«ø6†TRò Åfí‹º æ<İMĞñØæ2ÜÃĞ¦+·ı^µ²a=İİ!eB¦Îx»Rç˜â°‰‹G+â÷HÙ¦rYöı£0SLÎVù6¾Á4ï1wÇ²D*Ô"{ªGx¶]ğÖ”?ù«"œ T_‰Ï?"KFtPŠâíJ‰ú¦\:ŞŞ²MR›×©%4bA¤	ï†?½¨ßù;Œ™ëQˆöjÅúm¢<æRÄŠ^“×|”Ş¯£—Z÷Ç(¾,/RDìwjŒªG¿uÔ*bw°¨{Øm¶	‹¶¹÷«.qšCÃÜ(…E¯Ì{&(5Ç“Ö>jİmÖ*ŒÒâ»°İgÄm7]S°.”Ô6íyÖ,JdŸÕª7¶ç
,« gYê—¿·¼ŒÇæ¶ŒLºæ^×3<«2ÔI(:½]G mG^j¢Ÿ]ŸéÉ¾Ê„|pN¼+{*
¾²´±Çn¬j6û}q§¨±t1%	;j.û}9ínªOöï·ß¹>3»èòohûiO?&n%ß¿)>-;,ÛŠ:;:;v·šî4¡nª½Mğ—QÕ¨!§s–Æ2´êP„¯OCH`*ó»'©7ÄÄ]ÇFJK‰=#µ¼’!u–Ågl>?İ]·ªÕy¬àG;ÄìYËKˆ¸Šw¤PmwPş(9,uVâÅ¿ş~BÂEßÖV¤rsRævsíë˜(ñ¹½p]IÜ†ƒ?¸}¸¿816Áeıê9½¨¤!3=Şbç­ñ´´ƒ•*p0ÙÖv¼P ß;ı¡|ÕíûüV½í	øAş¬¹Çü/Vá¿fv}ÿë¦ó¸ÏšìØŸ¥…[ò7Õ.ônö}İ'/iáWUòWÕ<‚jè£ø*6Ó‹ûò.³À<­ÈwÕ¬­±óÌN¨éVnÇ ¾‹!è£HÓğ™€ê”Êf´ğ3Îãsİ¢ÓÍKgU…9übüüŸçÌÇæŸ—e—Éu”ø2=#$¹Å£Jë![Üß(Î?b‰7ÃCü¯ªQ”³Î«*ÓZNTkï$b‡hÈjwŠY¾ÍKı\S*¶…ñ^ğ¥ieà?¯ªo
pßÊ·5÷e¸Ÿ»ºÌE/‚Ï•ä:Ê”Íã»ûËğ}©ªKoYå6¸ğĞ:Ê¦ü.7ğş¼5å»™'SKj39’í–ÚvLAiÜã5«	æ2É´5åKÊš’<	™KšsÜMÉöõùu4æ?ìê·åÖ®¯3¹É£†¸¨MBrŞ×M[ü¨ü¨p4ßÁ§û+{+„JwkË ¥ÿ å2æïkC^’Ys4a"“ªÿÒÀÒ-=ä6>häå›…8è†ğJ}™™íK)Ù÷«iMEô"·T¹ÚÜOıÂˆÅò3…Oü¤+ü"&rÃX§œÂÕRF´şyJ¥RŸkAÁ‰³œÜĞÖt Å»"œ¼Ò\‰Onxn¸¢¯‘uê»Ïò­ú*Æù²Ñæ×iMx|¤;xueòIüæ¹hšÊ2Š³şM¯“„‹Õ“qõLß ÿ›ã§Ñ»ºNôl
œë¸Ÿî0¹œ¥¥>ãTPD_Ú%B½böe^Vq#¦•lY»šP½u‡l:Ô4·Ç q²Ñœ›â¥ë¡cif‚yïVDû¢*;‡ûğd´)!c¯ÙÜ4>FúÈ‘ÅÀ5l_²$iş5uÎÏØñ·°‚¿½ïKrÏ¢Î¢æ¼ûwûuK}ñéÆ2n™İÏT{x<°¬~f[(iéc3­,?3¬jSQ»7?›Oùk'å÷›—[,hiV˜Oö´YÕ‚Ñ´òZâ\{OT«Ş{…9˜jpK-MçL@A]?$±¤J6rşt¿O½ÙŞöTX#>Æª¨ìYUy4ı‹zÃæøù“vãŠÍ¨ÃNÆ;bšÍ	O¢ÅÍ$æ}¢Ä)"«ÆyÊ'È6pìÌz¤·Ñ6-å…˜›Ì2ŞæúDFûe·JqÑî$xÑ"¯­àEç'PŠÂ?r¥‰š—ô6ÆäÈ¢ŠìpòpqÔ1úşU“ÊÜµÈµÈ]RåWõ×%½*½*Ç}*Ëä’ğ!DRJ•¡sri%b,åéÙ$šè•Ùûş&”*Ü‚Jí¹Û¥RéõÊÒ}*‹—«€-¹ÿ%
 	¨énÕ|odŠ>äpŞ‘ã·ó»çååì_CõÌñÛ‡Fjpµˆ&jVhòØ8e2&…SÅ{RÀkÂ“³5¨´4± â(A¾™
8xÌ/‹œâ¼Mi/]œ^V_:Ä$õ[(ü±ô
ŒJ£#¾‰›XÌyLÌ<.Çy…y¢}êµíµõ:÷öa,zîìI“´’¢EÂW7„v©"‘Æh¹JÖÜÈ²°šä«õ·Å#î*]©±nÙ\¿n|‹jÿ/Á>M|?câ¿°¾¹¯ë=)êmë¯ş‚¡«øO>«=g@•P>
a‰ÛïÄ"|fì<*9Vƒ?Mºã]TÃJ–MWÎNQÏĞá|1Ù9´×ùJåíF÷•HN]ğ¢O‹Ÿ•…ù1äÕë:÷KííÔÅ°Ñ˜S®ı.6ÂUC¸i8úßçş~¯
p› ›C%>»4»4ÃÓÕ.¥Í.%œiÚ°î¨á›“…S}Âqy@BÚudXk‹Ü1%riAH[K†¡"{JÆ$E9_‡ôü)gßd±²mâA4gã˜•Ÿº¸û7ÔïZíßµ‚Ç4¼!¼×Y‘Œ†xœÿHƒÜ<š¾£8šgcé×`îùÙĞ uñé)’ÔfQ"—W˜*<zûÊD‹Ü¢96†ˆÂİò¶g>aìN¨«õ×z$vïµ˜'Í‹Ò˜wÛ…‘êGuEW­É/éÍ6EDÒ<o£ 	ì8äo/nQœ"B¢6ŒÉˆğ°ŸÅòóøGv÷"'à?Î6üêÕîÕ–‰éè¤Úm<š5Ÿˆw¼xN¬X=Âßø¶˜Èl“Íæ¾@Óu±h®óH'˜Ó¾ŒQ–MXQ&QO¶¬<(6Î¥v}ókş?àú†‡ÍhæÂ_¿÷~õ~½|2­ùùıíGe˜KópJ'¬—¤«MÑ'Ô7d,Ò•œlPúL8®Ï:·¸ÍÔF‚c‘Ğ‰Ia¦›—î±-Z‘©ã0ITú_ŠúáÔÚ‰öbÚ7•¹Ûu©H
L	÷ÚGstöÕµk3côÛ$&>†ı=j=¨i+ÌÁÏë;ÒåP}ÏıÛıÚ_áA%nBÍPoSŞŒĞåiVªhäF	]~©Wš\¨ —ªÂg0úÊ'ğ|T÷ŞöøQá% 1¤½å+…éê|ß;İ9é¿NhF´œ~\m<~MïgºAÿ‹Éow©qfBİLïÊøÒ¤lCNqf“ùU·˜pÃ³©ÎáXæ	øà 5!Py¦ƒÖßC0M§ÌÆHÃÆOgÓoô®Š¶µ8åÙ<rO½†½†^eà8À8Š¼ÿv²]¸ÿÈÑr‹$Á-•®Øs•ì˜)NR äÖÖV±±v…ä*»ĞiÉô ¾j0/ÂU÷°–û;¯qG÷rÀTòç?päM’Ééà:^¹U}#şîö…ó-¹áíç=ıh²4ÕÑî„äæi åièiùE—«Ÿ*eæ’¸)Ş)EZ°“LxÌmÍ;(hñg…¶ˆ¤«‚9Gâ¹&è¬#,kï»¾yÁS• §M3[~ö«ÖT.ìè™ÚLÓúÔå©=W»£>àeÊ]ª$ğüt	ø¾í7Zìßß¯×ïoÇ?ÄüY¹JÕLS³Á"‚Zpxò)sxòo·ã–ÆŞÏòÆnxïˆ¢eõkzò8¬wÒì•7Eu#T¢2 2€+.Òyº|õç–Qãyjé$€Š
uÎu|C¥AwõM]ÛÚ{Ø4¾Îƒ²½X½¨Ôuú<í¨b;üxç²5;\c§†™ö¾àúiõ0éÿ Mñ¸ä–ÔˆØšŸ	Zlt[\Lv¥\0…š2	Z#9XHK»\+. ~êÑ´³²Ğû²^ÉIÊİßYr?Wİ²íà€CG.¶DuPYÁÀÆ}¬*5=©™GZôÄÂ{\Š²[ì×"0 DZ…>>ÏÓ¿Ìü>ØãŸñ·©Ò˜ìğs¨è7í¦’pRôš&Nî!W-Cğ¯1cÒ{Áô™±²á.™Å!nêssYÅHO_…µ±bû8oº8¬9º]š;Ôò·	éõgT¾Î7ôOáÍ
jâãf«H¾.Hà¿H7’˜NäWœ>gÄY±|€JjÜì¡kHğ 	Tq—´÷½–BìvkGHs(?÷ñù›[¹À¸†ÿæVú]zE¶/ZWqÏz5D¢è¦ñÜÂ†!~Ûpz•1Ë¸À‚2
©*õplRÈ‘áSã`©Ùùº/Êté,
6ù8×À(õJü°´"G[C£¿ÀH€şbßÿYyø™Eš5ÔÚ´›ÆÚ•Eµ´Á2‡µæ=oƒe–	ó
ÂœS²eFÃø±Lã¨qóöVOˆÖ²‚mİaCyÙy7wàÑº}“(‰ƒëÓ~.ÿS¯P¯ĞßĞûçáŠ¼tğtqä]¸©¿RGµ”ÒñNRÿ¤_ =;¥$M
Y¨4–¼ûoA¹•)Y‘«qK[«LŠkºMŸ›{h¶¢<É´|¸v§ş¢8ìğûX8®î¶wÛÛmlÈkÜk€®ÿ M•j¼p¼)í-½I®ÒšD«ïµhÉªí<ÁµÜdâluÁyıŠB…ıˆÓˆ`û¡é:…¿âH^|„ş1Übtã®>¹Á–ìº¿Y,mE-Q§ºã ‚™°X­º93Ëƒš;«ÙXºaa—®¥Wû¸§ª5Bößğ7Øş©
{4!(…XÖ;ºS¥E‡™ºØSãjëñõ¸ñûôò3èVÙTjãªÆºàMF³åÑñƒ•Ù$ı
kIR**²àM¥+õé\Í•Kµ.iõ5m]"‹œ2×¾(ÿ©îÿàşU”ì:òf÷_à´F°sröìHt¹çÈº]O	Ë,20-ÿ¹Ölfnq	«°#ÜŠ\KÅbû–“ŒrR½êNHÅ¸ 5}rIÄ+ÏÒN¾³·$@şn…ZşÇ…%ÿÖ8§™ù<n³‰oób‚¤Å_ò“âL#Fƒ‹ÅšœFÀîêcqØá«BI¢RM^sÉÙ×uwo™ò5,[ëø˜jS“i…«××|é÷;¥ñ7Æ…bŸNïÖ¿‹ÿùş{ß»|à¾o?0.u1Ş[‡í/R7
Xµ”£“ubĞ*³gÔä?;ŸúÎµmÚÆCÑ«Ö“èB$Vûâ)›-×5ïZå!¦æXÓ¹.Ø{Âo$©’a•8Ì»†»ù¸ÿy{980ØßJğów;èò#|ÔÚKËŞ	ŒJNŸŒ¢I¸OT¦ÈÉT‡´I5¸Ò0†®¢›OC_ş{‹©2†ŠlDLR1£9ËöyLA(GHûk˜7 ï?`Wş¾÷ıïƒß¦Z"D'Õ@  ‰ˆÿùl¥"¿´¢‰œş?_İ¼J™’L”GÎyà`<7¢O;.Ei‰-•6&b‚OH„zŞ#°B.<h‰Æ=h)^Ö##ˆU7“Ù%øñC™£`³øE©(->‰f¤.„Vd¼5Ô¡IyáyaÉ~ÉŒ^}$¼Uîÿµó)îå¿Ëiƒ7í›ËÖ„bcz{¾o‘æ!_í£¥ Rºoúg—^‡ G—H‡I§77;ù 3#S±dÖ#xr ÔÍê¾RˆHÎpì(”]Şq4½¤Óó<¾(O‹ü-™ôóMákº¥Ë“ˆ¡%RÀírhé‹EÎÌÓ¾÷¹`T‡œŒüJğ­Hë‚"v–ö¼²	âË“ÙÃ+§ÉYw*“Á™è9«o„	í‘ü:[õxq­Ğœ€^JCŒÒœğª0Ğ)f^Z 0ôæ”Ø»0'h HC“CJd”ğÀ(@Ê~Êü^‹âFÑ>lğX^¢†¦ÒSG§ï1ÕÀ«Õş1bŸŒ·W>W.}’´O›VÚêîel'mOÄÌÌ‹y‰ev¼Df²fi<¥CHæe¤Kyá/éÌ»Î‹ª¬ÒZ¤h?•#¦û¶? âŒæøU…Q	°óâíb¬q8Şº³0ÿW½È:tü£ÈÈˆ~¯]õ‡Q­¯&Fãi„‘ˆ(]‘õ¨öŠ1Îíãé¤Û·äqìaÉ]$ØN9èdÚ÷¸¥ø¿¸·5oK^Œÿ)ëì¾Ã^•µ°c´EÁ_èvnñğ&ìyoöŞ9Ÿ®ZóïŞ’}5ñ¥øÉ¹Î—m®!Å¦&×`±ÈW÷ÓÀdC-^ŞÑ‚»râ^ˆHÕé7Û)'_â+f¥ï
9c—ê¡O¨×Óaıd)11ÒÎ¨²t½[[‹Ò˜ŸÓ‹’W™ØY¾şïÍmfÁ™Î´ü’b €w  ûw–ßCÚÜÍØAÑØŠÆØÍø’Ã×IIÙÃ•!ÁÈİ, û2WvŠÆßÄU ¦µ@¥ÜÖ„ÁÖBÅ)ÇQ­ğÆYS#¾;ò¶3®ôÉL6ª¶gË9ÎX[	…„ˆî“,\cn]û.Óaæ4 o§ÏëN4ÿÆÂ÷‚¯ƒşvŒgÏMÇÎ×õËC÷çYÎ«á$0ï„"õø÷É3Îgñ÷·¥âÚµøˆé=5'O‡p×Oßm{4¸Ï¬ıÜÀËf—Ë°Æ+í5Œ«ÑrÈ.¦M;%ü÷pÅM–ª2³z½¹WçÁ¾4-¶—‚£ã¯ÄE°çøO)ºËÔíG
\{SÎìâ:=†¯ÈÜËÙWŒ9o¨çç·§R³[B
]óä‘~UW+»7n½Å
’*¨aÖ/¼w“-XTŞOKå¡‘á»H|ÅŸ.^×:†óÛ…Ÿ:Ï;‘«5R´ 8Ò]Ö±ëÆ•ÚO`×Önw·l—A² Cİuhçõ—x«¥Îè%WKWÆcÇeœæb˜Bø,ÒŞTZ€”,–ª,ÕŞ£g®U{¸†ş	]ñéÆ?,s$ëBfˆÖùÿ‡ùğ5ï¿w†éU$(+\dæ,bñ¥‹¡÷îÍ˜RuuRoü¬#‹ğŠ—"YĞÕ¸¹W§¾M×$iºÕG˜H5èJ°ŒÓXTéÎ¨Y^[Õğf(û=lw`ºîê( PÄÚOÛ°gX¼×k*°Š”:X£Æ~lf«Ùn¹…¬<ºÈ«˜r-$3_]ˆ¼¹€h¼Ázó‡²õ’aÉq,?UVµ¨½ÈwÀù2ùv4ÿNÏ$xœE Êª2ÎRZÁìµœ,ğ„î“H0ÁbOÇ4eB“ˆ·{(Š¤À°Ş4¥ÿÖ{í™‘9V!cÀ¯q´¾'Í¨p8p£cïRÈ°ÚW71-%váM@Š„ßh®Ğ
†gñø^*/fF@Õ{q¾8àê`¥«ÿ¨ıE–Âî¤­¾fŸO¤[Ì–^o‡Æ¯§šëÙã‡÷4ëf‹â1¯êÌ:#ª¨Ÿq#ÊV0Wn¸Qó]¯¬‡ù&şû«G¿Ò‰©4DïˆÚÍ“{ãøœ±n5­÷O>`*´@ÒØ´2›ìa¿E›Õ*-ÊR±¶40“çV,š…dfÆq•—|‡ñŠ(Ì[œ† LÁÛÈeL’N©¬©r‹vtÅ8ÜTkf kQ ½Á†õR-ïŞ™Šß©¹~‰áĞÑ¢1¾ŒSêd¢Ñq²©_åÛüê¿/½ÍàîšÔ®ÀĞ