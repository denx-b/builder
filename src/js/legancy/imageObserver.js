;(function() {

  /*
  * USE CASE
  *
  * ...
  * // alternative for one => new ImageObserver('/link/to/img-2.png');
  * const imgsWhichWeNeedUseAfterTheyLoading = new ImageObserver(['/link/to/img-1.png', '/link/to/img-2.png']);
  *
  * imgsWhichWeNeedUseAfterTheyLoading.wait() // Promise status panding
  *   .then(               // Promise status fulfilled
  *     (imgs) => {
  *       // imgs is array with html img with loaded img
  *       // use 'imgs' argument here which was be loaded
  *     },
  *     (err) => {
  *       if (err) {
  *         // err obj look like => {msg: "image loading is fall", invalidUri: "link/to/img"}
  *       }
  *     }
  *   )
  *   .catch(...)
  *   .finally(...)
  *
  *
  * */


  class ImageObserver {
    constructor(URIs) {
      if (URIs instanceof Array) {
        this.uris = [...URIs, this.uris]
      } else {
        this.uris = [URIs, this.uris]
      }
    }

    load(uri) {
      if (!uri) throw new Error('URI for load image is not defined')

      return new Promise((resolve, reject) => {
        const imgRef = new Image();

        imgRef.addEventListener('load', () => {
          resolve(imgRef);
        })

        imgRef.addEventListener('error', () => {
          reject({
            msg: 'image loading is fall',
            invalidUri: uri
          });
        })

        imgRef.src = uri;
      })
    }

    wait() {
      if (!this.uris || !this.uris.length) throw new Error('The function of wait without links to pictures is called');

      let imgsLoad = [];
      this.uris.map(uri => {
        if (uri) imgsLoad = [...imgsLoad, this.load(uri)]
      })

      return Promise.all(imgsLoad);
    }
  }

  window.legancy.ImageObserver = ImageObserver;
})();
