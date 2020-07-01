import Hilo from 'hilojs'
export default class ResultModel extends Hilo.Container {
  constructor(properties) {
    super(properties)
    this.model(properties)
  }
  model (properties) {
    const that = this
    new Hilo.Container({
      width: properties.width,
      height: properties.height,
      x: 0,
      y: 0,
      background: '#000',
      alpha: 0.5,
    }).addTo(this)

    const readyImage = properties.isAllRight ? properties.images.rightModel : properties.images.errorModel

    new Hilo.Bitmap({
      x: 0,
      y: 0,
      image: readyImage,
      rect: properties.rect,
    }).addTo(this)

  }
}
