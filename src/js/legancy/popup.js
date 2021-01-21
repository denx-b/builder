;(function (window) {
  let options = {},
    defaultOptions = {
      cache: true, // сохранять ли кеш запроса
      display: 'block',
      data: {},
      paddingRightElements: [],
      title: 'Окно',
      onAfterAppend: null,
      onAfterOpen: null,
      onAfterClose: null,
    }

  /**
   * Создаёт обёртку попапа
   * @returns {HTMLDivElement}
   */
  let createWrap = () => {
    let wrap = document.createElement('div')
    wrap.dataset.close = 'true'
    wrap.classList.add('popup')
    wrap.innerHTML = `
    <div class="popup__wrap">
    <svg class="popup__logo-fixed" width="64" height="16" viewBox="0 0 128 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g fill="#FF005C"><path fill-rule="evenodd" clip-rule="evenodd" d="M119 18h-13v10h13a5 5 0 000-10zm-17-4v18h17a9 9 0 009-9 9 9 0 00-9-9h-17z"/><path d="M126 0h-24v32h4V4h20V0z"/></g><g fill="#FF005C"><path d="M94 0v32h-4V18H70v14h-4V0h4v14h20V0h4z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M44 28c6.627 0 12-5.373 12-12S50.627 4 44 4 32 9.373 32 16s5.373 12 12 12zm0 4c8.837 0 16-7.163 16-16S52.837 0 44 0 28 7.163 28 16s7.163 16 16 16z"/><path d="M22 0L8 14H4V0H0v32h4V18h4l14 14 2.82-2.82L11.64 16 24.82 2.82 22 0z"/></g></svg>
    <div class="popup__close" data-close="true"><span class="popup__close_1"></span><span class="popup__close_2"></span></div>
    <div class="popup__content-wrap"><h3 class="popup__title"></h3></div>
    </div>`
    return wrap
  }

  /**
   * Установка паддингов, чтобы элементы не прыгали при скрытии скрола у body
   * @param padding
   */
  let setPadding = (padding) => {
    window.document.body.style.overflowY = padding ? 'hidden' : 'scroll'
    window.document.body.style.paddingRight = padding

    if (!BX.type.isArray(options.paddingRightElements)) {
      return
    }

    for (let i in options.paddingRightElements) {
      let selector = options.paddingRightElements[i],
        nodeList = document.querySelectorAll(selector)

      if (!nodeList.length) {
        continue
      }

      for (let j in nodeList) {
        let currentElement = nodeList[j]
        if (!BX.type.isElementNode(currentElement)) {
          continue
        }

        currentElement.style.paddingRight = padding
      }
    }
  }

  /**
   * Возвращает объект попапа
   *
   * @param params
   * @returns {{close(): void, open(): void}}
   */
  window.legancyPopup = (params) => {
    params = typeof params === 'object' ? params : {}
    options = Object.assign({}, defaultOptions, params)

    let promise,
      content = options.content,
      wrap = createWrap()

    if (typeof content === 'string') {
      if (content.indexOf('/') >= 0 || options.ajax === true) {
        promise = fetch(content).then(
          (value) => (value.ok ? value.text() : '404 Not found'),
          (error) => 'Check your internet connection'
        )
      } else {
        promise = new Promise((resolve, reject) => {
          let popupElement = document.querySelector(content)
          if (BX.type.isElementNode(popupElement)) {
            resolve(popupElement.innerHTML)
          } else {
            reject('Selector content not found')
          }
        })
      }
    } else if (BX.type.isElementNode(content)) {
      promise = new Promise((resolve) => {
        resolve(content.innerHTML)
      })
    } else {
      promise = new Promise((resolve) => {
        resolve('Content Type Not Supported')
      })
    }

    let elem = wrap.querySelector('.popup__content-wrap')

    if (options.title === false || !options.title) {
      elem.removeChild(elem.querySelector('.popup__title'))
    } else {
      elem.querySelector('.popup__title').innerHTML = options.title
    }

    promise.then(
      (result) => {
        elem.insertAdjacentHTML('beforeend', result)
        document.body.appendChild(wrap)
        if (typeof params.onAfterAppend === 'function') {
          params.onAfterAppend(wrap)
        }
      },
      (error) => {
        elem.insertAdjacentHTML('afterBegin', 'Something went wrong')
        console.log(error)
      }
    )

    let closing = false
    const ANIMATION_SPEED = 200

    const escClickHandler = (evt) => {
      if (evt.keyCode === 27) {
        methods.close()
      }
    }

    /**
     * @type {{close(): void, open(): void}}
     */
    let methods = {
      open() {
        !closing && wrap.classList.add('popup_open')
        setPadding(getScrollBarWidth() + 'px')
        document.addEventListener('keydown', escClickHandler)
        if (typeof params.onAfterOpen === 'function') {
          params.onAfterOpen(wrap)
        }
      },
      close() {
        closing = true
        wrap.classList.remove('popup_open')
        wrap.classList.add('popup_hide')
        setTimeout(() => {
          wrap.classList.remove('popup_hide')
          setPadding(0)
          document.removeEventListener('keydown', escClickHandler)
          closing = false
        }, ANIMATION_SPEED)
        if (typeof params.onAfterClose === 'function') {
          params.onAfterClose(wrap)
        }
      },
    }

    wrap.addEventListener('click', (ev) => {
      if (ev.target.dataset.close) {
        methods.close()
      }
    })

    return methods
  }

  /**
   * Чтобы не передавать options при каждом открытии попапа
   * можно заранее назначить некоторые опции
   *
   * @param params
   */
  window.legancyPopupInit = (params) => {
    params = typeof params === 'object' ? params : {}
    defaultOptions = Object.assign({}, defaultOptions, params)
  }
})(window)
