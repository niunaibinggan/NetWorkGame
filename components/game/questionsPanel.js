import Hilo from 'hilojs'
import Text from './text'
export default class QuestionsPanel extends Hilo.Container {
  constructor(properties) {
    super(properties)
    this.distance = 130 * (5 / (properties.questions.left.length))
    this.initQuestion(properties)
  }
  // selected = [{ realId: 0 }, { realId: 1 }]
  selected = []
  rightX = 800
  distance = null
  setAnswer = []
  rotationDeg = 0

  // Math.atan2(1, 1)*180/Math.PI

  line (properties) {
    if (!this.verifyRepeat()) return
    const basedistanceLeft = (this.selected[0].realId) * this.distance + 50
    const basedistanceRigt = (this.selected[1].realId) * this.distance + 50

    // 设置旋转角度
    this.rotationDeg = Math.atan2(basedistanceRigt - basedistanceLeft, 300) * 180 / Math.PI

    var rotateContainer = new Hilo.Container({
      rotation: this.rotationDeg,
      x: 500,
      y: basedistanceLeft,
    }).addTo(this)

    // 设置背景图
    const rectLine = Math.floor(
      Math.sqrt(
        Math.pow(
          Math.abs(basedistanceRigt - basedistanceLeft), 2) + Math.pow(300, 2)))

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
    this.selected = []

  }

  initQuestion (properties) {
    // 题目列表
    let questionsLeftBg = []
    let questionsLeft = []
    let questionsRight = []
    let questionsRightBg = []

    properties.questions.left.forEach((item, index) => {
      questionsLeftBg[index] = new Hilo.Bitmap({
        x: 0,
        y: index * this.distance,
        image: properties.images.questionLeft,
        rect: [0, 0, 499, 106],
        visible: true,
        scaleX: 1,
        scaleY: 1,
      }).addTo(this)

      questionsLeft[index] = new Text({
        id: { realId: index, questionId: item.id },
        text: item.text,
        fontSize: 70,
        lineHeight: 97,
        bold: true,
        textAlign: 'center',
        textVAlign: 'middle',
        height: 97,
        visible: true,
        cc: 3,
        alpha: 1,
        reallyTextWidth: 400,
        x: - 130,
        y: + (index * this.distance) + 20,
        color: '#fff',
      }).addTo(this)

      this.panelClick('left', questionsLeft[index], questionsLeftBg[index], properties, 0, index * this.distance)
    })

    properties.questions.right.forEach((item, index) => {
      questionsRightBg[index] = new Hilo.Bitmap({
        x: this.rightX,
        y: index * this.distance,
        image: properties.images.questionRight,
        rect: [0, 0, 499, 106],
        visible: true
      }).addTo(this)

      questionsRight[index] = new Text({
        id: { realId: index, questionId: item.id },
        text: item.text,
        fontSize: 70,
        lineHeight: 97,
        bold: true,
        textAlign: 'center',
        textVAlign: 'middle',
        height: 97,
        visible: true,
        cc: 3,
        alpha: 1,
        reallyTextWidth: 400,
        x: this.rightX - 120,
        y: + (index * this.distance) + 20,
        color: '#ffffff',
      }).addTo(this)

      this.panelClick('right', questionsRight[index], questionsRightBg[index], properties, this.rightX, index * this.distance)
    })
    // 正则表达式 RegExp(/left/).test(str)
  }

  panelClick (type, eventTarget, target, properties, initX, initY) {
    eventTarget.on(Hilo.event.POINTER_START, (e) => {
      if (type === 'right' && !this.selected.length) this.selected[0] = null
      this.selected[type === 'left' ? 0 : 1] = e.eventTarget.id
      Hilo.Tween.to(
        target,
        {
          scaleX: 1.05, scaleY: 1.05,
          x: initX - (499 * 0.05) / 2,
          y: initY - (106 * 0.05) / 2
        },
        {
          duration: 100,
          onComplete () {
            Hilo.Tween.to(
              target,
              { scaleX: 1, scaleY: 1, x: initX, y: initY },
              {
                duration: 300
              }
            )
          }
        }
      )
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
