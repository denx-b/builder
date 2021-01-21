// Scroll top
legancy.scrollTop = function (options) {
  options = typeof options === 'object' ? options : {}

  let scroll = document.createElement('div')
  scroll.classList.add('scroll-top')
  scroll.innerHTML =
    '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 32h62M50 20l12 12-12 12" stroke="#fff" stroke-width="2"/></svg>'

  scroll.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })

  let showTop = options.showTop || 500

  let scrollTop = () => {
    let scrollTop =
      window.scrollY ||
      document.body.scrollTop ||
      document.documentElement.scrollTop
    if (scrollTop > showTop) {
      scroll.classList.add('scroll-top_show')
    } else {
      scroll.classList.remove('scroll-top_show')
    }
  }

  scrollTop()
  window.addEventListener('scroll', scrollTop)

  return {
    init() {
      document.body.appendChild(scroll)
    },
    destroy() {
      document.body.removeChild(scroll)
      window.removeEventListener('scroll', scrollTop)
    },
  }
}
