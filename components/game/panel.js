import Hilo from 'hilojs'
import Text from './text'
export default class ResultPanel extends Hilo.Container {
  constructor(properties) {
    super(properties)

    this.isText = (properties.questions.type === 'text')

    const questionsLength = properties.questions.left.length

    const allNumber = this.isText ? 5 : 4

    const baseDistance = this.isText ? 130 : 170

    this.distance = baseDistance * (allNumber / questionsLength)

    this.initQuestion(properties)

    this.setAnswerQuestionsId = properties.answerQuestionsIds

    this.setAnswer = properties.answerRealIds

    this.resultIds = properties.resultIds

    // properties.type  'panel' |'resutl' | 'rightResult' 三种类型
    if (properties.type === 'panel') return
    this.resutlLine(properties)

  }
  selected = []
  isText = false
  rightX = 800
  distance = null
  setAnswerQuestionsId = []
  setAnswer = []
  resultIds = []
  rotationDeg = 0
  lineX = null
  lineBase = null

  // Math.atan2(1, 1)*180/Math.PI

  line (properties) {

    if (!this.verifyRepeat()) return

    const basedistanceLeft = (this.selected[0].realId) * this.distance + 50
    const basedistanceRight = (this.selected[1].realId) * this.distance + 50
    // 设置旋转角度
    this.rotationDeg = Math.atan2(basedistanceRight - basedistanceLeft, this.lineBase) * 180 / Math.PI

    var rotateContainer = new Hilo.Container({
      rotation: this.rotationDeg,
      x: this.lineX,
      y: basedistanceLeft,
      background: 'pink',
    }).addTo(this)

    // 设置背景图
    const rectLine = Math.floor(
      Math.sqrt(
        Math.pow(
          Math.abs(basedistanceRight - basedistanceLeft), 2) + Math.pow(this.lineBase, 2)))

    const lineScale = new Hilo.Bitmap({
      x: 0,
      y: 0,
      image: properties.images.rightLine,
      rect: [0, 0, rectLine, 17],
      visible: true,
      scaleX: 0,
      scaleY: 0,
    }).addTo(rotateContainer)

    Hilo.Tween.to(
      lineScale,
      { scaleX: 1, scaleY: 1 },
      {
        duration: 200
      }
    )
    // 存储数据
    this.setAnswer.push([this.selected[0].realId, this.selected[1].realId])
    this.setAnswerQuestionsId.push([this.selected[0].questionId, this.selected[1].questionId])
    this.selected = []
  }

  resutlLine (properties) {
    this.resultIds.forEach((item, index) => {

      const isError = properties.answerQuestionsIds[index][0] !== properties.answerQuestionsIds[index][1]

      let images

      let basedistanceLeft

      let basedistanceRight

      if (properties.type === 'result') {

        images = isError ? properties.images.errorLine : properties.images.rightLine

        basedistanceLeft = properties.answerRealIds[index][0] * this.distance + 50

        basedistanceRight = properties.answerRealIds[index][1] * this.distance + 50

      } else {
        console.log(properties.images.tipsLine)

        images = isError ? properties.images.tipsLine : properties.images.rightLine

        basedistanceLeft = properties.answerQuestionsIds[index][0] * this.distance + 50

        basedistanceRight = properties.answerQuestionsIds[index][1] * this.distance + 50
      }

      // 设置旋转角度
      this.rotationDeg = Math.atan2(basedistanceRight - basedistanceLeft, this.lineBase) * 180 / Math.PI

      const rotateContainer = new Hilo.Container({
        rotation: this.rotationDeg,
        x: this.lineX,
        y: basedistanceLeft,
      }).addTo(this)

      // 设置背景图
      const rectLine = Math.floor(
        Math.sqrt(
          Math.pow(
            Math.abs(basedistanceRight - basedistanceLeft), 2) + Math.pow(this.lineBase, 2)))

      new Hilo.Bitmap({
        x: 0,
        y: 0,
        image: images,
        rect: [0, 0, rectLine, 17],
        visible: true,
        scaleX: 1,
        scaleY: 1,
      }).addTo(rotateContainer)

      if (properties.type !== 'result') return

      // errorIcon
      new Hilo.Bitmap({
        x: rectLine / 2 - 34,
        y: -20,
        image: properties.images.errorIcon,
        rect: [0, 0, 68, 68],
        visible: true,
        scaleX: 1,
        scaleY: 1,
        visible: true,
        alpha: isError ? 1 : 0
      }).addTo(rotateContainer)

    })
  }

  initQuestion (properties) {
    // text:[0, 0, 499, 106], image: [0,0,245, 179]

    const rect = this.isText ? [0, 0, 499, 106] : [0, 0, 245, 179]

    const leftX = this.isText ? 0 : 254

    const baseScale = this.isText ? 1 : 0.8

    this.lineX = leftX + rect[2] * baseScale

    this.lineBase = this.isText ? 300 : 350

    let questionsLeftBg = []
    let questionsLeft = []
    let questionsRight = []
    let questionsRightBg = []

    properties.questions.left.forEach((item, index) => {
      questionsLeftBg[index] = new Hilo.Bitmap({
        x: leftX,
        y: index * this.distance,
        image: properties.images.questionLeft,
        rect,
        visible: true,
        scaleX: baseScale,
        scaleY: baseScale,
      }).addTo(this)

      questionsLeft[index] = new Text({
        id: { realId: index, questionId: item.id },
        text: item.text,
        fontSize: this.isText ? 70 : 35,
        lineHeight: rect[3] * baseScale,
        bold: true,
        textAlign: 'center',
        visible: true,
        alpha: 1,
        width: rect[2] * baseScale,
        height: rect[3] * baseScale - (this.isText ? 15 : 50),
        x: leftX,
        y: index * this.distance + (this.isText ? 15 : 50),
        color: this.isText ? '#fff' : '#f7e55d',
      }).addTo(this)

      this.panelClick('left', questionsLeft[index], questionsLeftBg[index], properties, leftX, index * this.distance, baseScale, this.isText ? 1.05 : .9)
    })

    properties.questions.right.forEach((item, index) => {
      questionsRightBg[index] = new Hilo.Bitmap({
        x: this.rightX,
        y: index * this.distance,
        image: properties.images.questionRight,
        rect,
        visible: true,
        scaleX: baseScale,
        scaleY: baseScale,
      }).addTo(this)

      if (this.isText) {
        questionsRight[index] = new Text({
          id: { realId: index, questionId: item.id },
          text: item.text,
          fontSize: 70,
          lineHeight: rect[3] * baseScale,
          bold: true,
          textAlign: 'center',
          width: rect[2] * baseScale,
          height: rect[3] * baseScale - 15,
          visible: true,
          alpha: 1,
          x: this.rightX,
          y: index * this.distance + 15,
          color: '#ffffff',
        }).addTo(this)
      } else {
        const imageScaleBaese = 0.2
        const imageScale = baseScale - imageScaleBaese
        const imageX = imageScaleBaese * rect[2]
        const imageY = imageScaleBaese * rect[3]
        questionsRight[index] = new Hilo.Bitmap({
          id: { realId: index, questionId: item.id },
          x: this.rightX + imageX / 2,
          y: index * this.distance + imageY / 2,
          width: rect[2],
          height: rect[3],
          visible: true,
          scaleX: imageScale,
          scaleY: imageScale,
          image: properties.images.questionsImage[index],
        }).addTo(this)
        // questionsRight[index] = new Hilo.Graphics({
        //   x: this.rightX + imageX / 2,
        //   y: index * this.distance + imageY / 2,
        //   width: rect[2],
        //   height: rect[3],
        //   visible: true,
        //   scaleX: imageScale,
        //   scaleY: imageScale,
        // })
        // const img = new Image()
        // img.src = item.text
        // img.onload = () => {
        //   img.onload = null
        //   questionsRight[index].beginBitmapFill(img, 'no-repeat').drawRoundRect(0, 0, rect[2] * imageScale, rect[3] * imageScale, 5).endFill().addTo(this)
        // }
      }

      this.panelClick('right',
        questionsRight[index],
        questionsRightBg[index],
        properties,
        this.rightX,
        index * this.distance,
        baseScale,
        this.isText ? 1.05 : .9)
    })
    // 正则表达式 RegExp(/left/).test(str)
  }

  panelClick (type, eventTarget, target,
    properties, initX, initY, baseScale,
    targetScale) {
    eventTarget.on(Hilo.event.POINTER_START, (e) => {
      if (type === 'right' && !this.selected.length) this.selected[0] = null
      this.selected[type === 'left' ? 0 : 1] = e.eventTarget.id
      Hilo.Tween.to(
        target,
        {
          scaleX: targetScale, scaleY: targetScale,
          x: initX - (499 * 0.05) / 2,
          y: initY - (106 * 0.05) / 2
        },
        {
          duration: 100,
          onComplete () {
            Hilo.Tween.to(
              target,
              { scaleX: baseScale, scaleY: baseScale, x: initX, y: initY },
              {
                duration: 300
              }
            )
          }
        }
      )
      if (properties.type !== 'panel') return
      this.line(properties)
    })
  }

  verifyRepeat () {
    // 验证是否选中两个
    if (!(this.selected.length === 2
      && this.selected.every(item => item))) return false

    // 验证是否有重复
    const isRepeat = this.setAnswer.filter(item =>
      (item[0] === this.selected[0].realId) || (item[1] === this.selected[1].realId)
    )
    if (isRepeat.length) return false

    return true
  }

}
