import Hilo from 'hilojs'
import Text from './text'
export default class ResultPanel extends Hilo.Container {
  constructor(properties) {
    super(properties)

    this.stage = properties.stage

    this.creatContainer()

    this.isText = (properties.questions.type === 'text')

    this.questionsLength = properties.questions.left.length

    const allNumber = this.isText ? 5 : 4

    const baseDistance = this.isText ? 130 : 170

    this.distance = baseDistance * (allNumber / this.questionsLength)

    this.initQuestion(properties)

    this.setAnswerQuestionsId = properties.answerQuestionsIds

    this.setAnswer = properties.answerRealIds

    this.resultIds = properties.resultIds

    this.errorIcon = properties.images.errorIcon

    // properties.type  'panel' |'resutl' | 'rightResult' 三种类型
    if (properties.type === 'panel') return
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
  errorIcon = null
  repeatAnswerIndex = []
  readyLine = {
    isStart: false
  }
  stage = null
  temporaryQuestionsContainer = null
  temporaryLinesContainer = null
  temporarySelected = null
  temporaryLinesMove = null

  questionsLength = 0

  // Math.atan2(1, 1)*180/Math.PI
  creatContainer () {
    this.temporaryLinesContainer = new Hilo.Container({
      x: (1920 - 499 * 2 - 300) / 2,
      y: this.isText ? 320 - (this.questionsLength * 10) : 280 - (this.questionsLength * 10),
    }).addTo(this)

    this.temporaryQuestionsContainer = new Hilo.Container({
      x: (1920 - 499 * 2 - 300) / 2,
      y: this.isText ? 320 - (this.questionsLength * 10) : 280 - (this.questionsLength * 10),
    }).addTo(this)

    this.temporarySelected = new Hilo.Container({
      x: (1920 - 499 * 2 - 300) / 2,
      y: this.isText ? 320 - (this.questionsLength * 10) : 280 - (this.questionsLength * 10),
    }).addTo(this)
    this.temporaryLinesMove = new Hilo.Container({
      x: 0,
      y: 0,
    }).addTo(this)

  }
  initQuestion (properties) {
    // text:[0, 0, 499, 106], image: [0,0,245, 179]

    const rect = this.isText ? [0, 0, 499, 106] : [0, 0, 245, 179]

    const leftX = this.isText ? 0 : 265

    const baseScale = this.isText ? 1 : 0.8

    this.lineX = leftX + rect[2] * baseScale

    this.lineBase = this.isText ? 320 : 360

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
      }).addTo(this.temporaryQuestionsContainer)

      questionsLeft[index] = new Text({
        id: { realId: index, questionId: item.id },
        text: item.text,
        fontSize: this.isText ? 70 : 35,
        bold: true,
        textAlign: 'center',
        visible: true,
        alpha: 1,
        reTextWidth: rect[2] * baseScale,
        height: rect[3] * baseScale - (this.isText ? 15 : 50),
        x: leftX,
        y: index * this.distance + (this.isText ? 20 : 55),
        color: '#9d6c3c',
      }).addTo(this.temporaryQuestionsContainer)
    })

    properties.questions.right.forEach(async (item, index) => {
      questionsRightBg[index] = new Hilo.Bitmap({
        x: this.rightX,
        y: index * this.distance,
        image: properties.images.questionRight,
        rect,
        visible: true,
        scaleX: baseScale,
        scaleY: baseScale,
      }).addTo(this.temporaryQuestionsContainer)

      if (this.isText) {
        questionsRight[index] = new Text({
          id: { realId: index, questionId: item.id },
          text: item.text,
          fontSize: 70,
          lineHeight: rect[3] * baseScale,
          bold: true,
          textAlign: 'center',
          reTextWidth: rect[2] * baseScale,
          height: rect[3] * baseScale - 15,
          visible: true,
          alpha: 1,
          x: this.rightX,
          y: index * this.distance + 20,
          color: '#9d6c3c',
        }).addTo(this.temporaryQuestionsContainer)
      } else {
        const imageScaleBaese = 0.15
        // const imageScale = baseScale - imageScaleBaese
        const imageX = Math.round(imageScaleBaese * rect[2])
        const imageY = Math.round(imageScaleBaese * rect[3])
        questionsRight[index] = new Hilo.Container({
          id: { realId: index, questionId: item.id },
          x: this.rightX + imageX / 2,
          y: index * this.distance + imageY / 2,
          width: rect[2],
          height: rect[3],
          visible: true,
          scaleX: 1,
          scaleY: 1,
        }).addTo(this.temporaryQuestionsContainer)

        // 渲染图片
        // const imgs = await this.onloadImage(item.text, questionsRight[index], rect, baseScale)
        // 渲染图片
        const img = new Image()
        img.src = item.text
        img.onload = (e) => {
          const realImageWidth = e.path[0].width
          const realImageHeight = e.path[0].height
          const scale = realImageWidth > realImageHeight ? (rect[2] - 40) * baseScale / realImageWidth : (rect[3] - 35) * baseScale / realImageHeight
          new Hilo.Bitmap({
            id: { realId: index, questionId: item.id },
            x: realImageWidth > realImageHeight ? 0 : (rect[2] - 80 - realImageWidth * scale) / 2,
            y: realImageWidth > realImageHeight ? (rect[3] - 60 - realImageHeight * scale) / 2 : 0,
            width: realImageWidth * scale,
            height: realImageHeight * scale,
            image: item.text,
            visible: true,
          }).addTo(questionsRight[index])
        }
      }
    })
  }
  onloadImage (src, target, rect, baseScale) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.src = src
      img.onload = (e) => {
        console.log(2)
        const realImageWidth = e.path[0].width
        const realImageHeight = e.path[0].height
        const scale = realImageWidth > realImageHeight ? (rect[2] - 40) * baseScale / realImageWidth : (rect[3] - 35) * baseScale / realImageHeight
        const imgs = new Hilo.Bitmap({
          x: realImageWidth > realImageHeight ? 0 : (rect[2] - 80 - realImageWidth * scale) / 2,
          y: realImageWidth > realImageHeight ? (rect[3] - 60 - realImageHeight * scale) / 2 : 0,
          width: realImageWidth * scale,
          height: realImageHeight * scale,
          image: src,
          visible: true,
        })
        resolve(imgs)
      }
    })
  }
}
