import Hilo from 'hilojs'
import Text from './text'
export default class ExportScence extends Hilo.Container {
  constructor(properties) {
    super(properties)

    this.initBackground(properties)
  }
  initBackground (properties) {
    // 整体背景
    new Hilo.Bitmap({
      x: 0,
      y: 0,
      image: properties.images.bg,
      rect: [0, 0, 1920, 1080],
      visible: true
    }).addTo(this, -1)

    // 时间背景
    new Hilo.Bitmap({
      x: (1920 - 582) / 2,
      y: 90,
      image: properties.images.titleBg,
      rect: [0, 0, 582, 146,],
      visible: true
    }).addTo(this)

    // 时间倒计时
    new Text({
      text: properties.title,
      // realTime: properties.initTime,
      fontSize: 45,
      lineHeight: 166,
      bold: true,
      textAlign: 'center',
      textVAlign: 'middle',
      height: 166,
      visible: true,
      cc: 3,
      alpha: 1,
      reTextWidth: 638,
      x: (1920 - 638) / 2,
      y: 110,
      color: '#ffffff',
    }).addTo(this)
  }
}
