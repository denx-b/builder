;(function (window) {
  class Popup {
    #state = {
      isAjax: false,
    };

    $fetching = false;
    $open = false;

    constructor(params) {
      if (params instanceof Object) {
        this.options = Object.assign({}, Popup.defaultParams, params);
      } else {
        throw SyntaxError('Object with parameters not specified')
      }

      this.#init(this.options);
    }

    get handlers() {
      return {
        escape: (event) => {
          if (event.key === 'Escape') {
            this.close();
          }
        },
        closeBtn: () => {
          this.$wrap.addEventListener("click", (ev) => {
            if (ev.target.dataset.close) {
              this.close();
            }
          });
        }
      }
    }

    #init({content = undefined, ajax}) {
      if (content === undefined) {
        this.$promise = Promise.reject('Content Type Not Supported');
      }

      this.$wrap = Popup.createWrap();
      this.isClosing = false;

      this.addTitle();
      this.handlers.closeBtn()

      if (content !== null && typeof content === "string") {
        if (content.indexOf("/") >= 0 || ajax === true) {
          this.#state.isAjax = true;

          this.$promise = (noFetch = false) => {
            if (!noFetch) {
              this.$fetching = true;
            }

            return noFetch ? Promise.resolve() : fetch(content).then(
              (value) => (value.ok ? value.text() : "404 Not found"),
              (error) => "Check your internet connection"
            );
          }
        } else {
          this.$promise = new Promise((resolve, reject) => {
            let popupElement = document.querySelector(content);

            if (popupElement instanceof Node) {
              resolve(popupElement.innerHTML);
            } else {
              reject("Selector content not found");
            }
          });
        }
      } else if (content instanceof Node) {
        this.$promise = Promise.resolve(content.innerHTML);
      } else {
        this.$promise = Promise.reject('Content Type Not Supported');
      }
    }

    addTitle() {
      let $contentWrap = this.$wrap.querySelector(".popup__content-wrap");
      let $popupWrap = this.$wrap.querySelector(".popup__wrap");

      this.$contentWrap = $contentWrap;

      if (this.options.title === false || !this.options.title) {
        $popupWrap.removeChild(this.$wrap.querySelector(".popup__title"));
      } else {
        this.$wrap.querySelector(".popup__title").innerHTML = this.options.title;
      }
    }

    open() {
      if (this.$open)
        return;

      function showPopup() {
        !this.isClosing && this.$wrap.classList.add("popup_open");

        if (window['getScrollBarWidth']) {
          Popup.setPadding(getScrollBarWidth() + "px", this.options.paddingRightElements);
        }

        document.addEventListener("keydown", this.handlers.escape);

        if (typeof this.options.onAfterOpen === "function") {
          this.options.onAfterOpen.bind(this)(this.$contentWrap.querySelector('.popup__content'));
        }
      }

      if (this.$promise !== undefined && this.$promise?.then !== undefined || this.$promise instanceof Function) {
        this.$open = true;

        const openThen = [(result) => {
          this.$contentWrap.querySelector('.popup__content').insertAdjacentHTML("beforeend", result);

          document.body.appendChild(this.$wrap);

          showPopup.bind(this)();

          if (typeof this.options.onAfterAppend === "function") {
            this.options.onAfterAppend.bind(this)(this.$contentWrap.querySelector('.popup__content'));
          }
        },
          (error) => {
            this.$contentWrap.querySelector('.popup__content').insertAdjacentHTML("afterbegin", "Something went wrong");
            console.log(error);
          }]

        const _finally = () => {
          this.$fetching = false;
        }

        if (this.#state.isAjax) {
          this.$promise().then(
            ...openThen
          ).finally(_finally)
        } else
          this.$promise.then(
            ...openThen
          ).finally(_finally);
      }

      return Promise.resolve();
    }

    close() {
      this.isClosing = true;
      this.$open = false;

      this.$wrap.classList.remove("popup_open");
      this.$wrap.classList.add("popup_hide");

      setTimeout(() => {
        this.$wrap.classList.remove("popup_hide");
        Popup.setPadding(0, this.options.paddingRightElements);
        document.removeEventListener("keydown", this.handlers.escape);
        this.isClosing = false;

        const closeThen = [() => {
          this.$contentWrap.querySelector('.popup__content').innerHTML = '';

          if (typeof this.options.onAfterClose === "function") {
            this.options.onAfterClose.bind(this)();
          }
        },
          (error) => {
            this.$contentWrap.querySelector('.popup__content').insertAdjacentHTML("afterbegin", "Something went wrong");
            console.log(error);
          }]

        if (this.$promise !== undefined && this.$promise?.then !== undefined || this.$promise instanceof Function) {
          if (this.#state.isAjax) {
            this.$promise(true).then(...closeThen)
          } else
            this.$promise.then(
              ...closeThen
            );
        }
      }, Popup.config.ANIMATION_SPEED);

      return Promise.resolve();
    }

    static createWrap() {
      let wrap = document.createElement("div");
      wrap.dataset.close = "true";
      wrap.classList.add("popup");

      wrap.innerHTML = `
                <div class="popup__wrap">
                    <h3 class="popup__title"></h3>
                    <div class="popup__content-wrap">
                      <div class="popup__close" data-close="true">
                        <span class="popup__close_1"></span>
                        <span class="popup__close_2"></span>
                      </div>
                      
                      <div class="popup__content"></div> 
                    </div>
                </div>
                `;

      return wrap;
    }

    static setPadding(padding, paddingRightElements) {
      window.document.body.style.overflowY = padding ? "hidden" : "scroll";
      window.document.body.style.paddingRight = padding;

      if (!(paddingRightElements instanceof Array) || !paddingRightElements.length) {
        return;
      }

      for (let i in paddingRightElements) {
        let selector = paddingRightElements[i],
          nodeList = document.querySelectorAll(selector);

        if (!nodeList.length) {
          continue;
        }

        for (let j in nodeList) {
          let currentElement = nodeList[j];
          if (!(currentElement instanceof Node)) {
            continue;
          }

          currentElement.style.paddingRight = padding;
        }
      }
    }

    static defaultParams = {
      display: "block",
      data: {},
      paddingRightElements: [],
      title: "Окно",
      onAfterAppend: null,
      onAfterOpen: null,
      onAfterClose: null,
    };

    static config = {
      ANIMATION_SPEED: 200
    }
  }

  window.legancyPopup = (params = {}) => new Popup(params);

  window.legancyPopupInit = (params) => {
    params = typeof params === "object" ? params : {};
    Popup.defaultParams = Object.assign({}, Popup.defaultParams, params);
  };
})(window);
