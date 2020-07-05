import Hilo from 'hilojs'

export default function (data) {

  const isTest = (data.type === 'text')

  return Hilo.Class.create({
    Mixes: Hilo.EventMixin,
    queue: null,
    bg: null,
    errorIcon: null,
    questionLeft: null,
    questionRight: null,
    titleBg: null,
    errorLine: null,
    rightLine: null,
    submitButton: null,
    errorModel: null,
    rightModel: null,
    rightBtn: null,
    resetBtn: null,
    tipsLine: null,
    questionsImage: [],

    async load () {
      const resources = [
        { id: 'bg', src: require('~/static/bg.png') },
        { id: 'errorIcon', src: require('~/static/error.png') },
        { id: 'questionLeft', src: isTest ? require('~/static/question_left.png') : require('~/static/question_image_left.png') },
        { id: 'questionRight', src: isTest ? require('~/static/question_right.png') : require('~/static/question_image_right.png') },
        { id: 'titleBg', src: require('~/static/title.png') },
        { id: 'errorLine', src: require('~/static/error-line.png') },
        { id: 'rightLine', src: require('~/static/right-line.png') },
        { id: 'submit', src: require('~/static/submit.png') },
        { id: 'errorModel', src: require('~/static/answer_error.png') },
        { id: 'rightModel', src: require('~/static/answer.png') },
        { id: 'rightBtn', src: require('~/static/right_btn.png') },
        { id: 'resetBtn', src: require('~/static/reset_btn.png') },
        { id: 'tipsLine', src: require('~/static/line.png') },
      ]
      this.queue = new Hilo.LoadQueue()
      this.queue.add(resources)
      this.queue.on('load', this.onProcess.bind(this))
      return await new Promise((resolve, reject) => {
        this.queue.on('complete', (e) => {
          this.onComplete(e)
          resolve(this)
        })
        this.queue.on('error', (e) => {
          this.onError(e)
          reject(e)
        })
        this.queue.start()
      })
    },
    onProcess (e) {
      this.fire('load', e)
    },
    onError (e) {
      this.fire('error', e)
    },
    onComplete (e) {
      this.bg = this.queue.get('bg').content
      this.errorIcon = this.queue.get('errorIcon').content
      this.questionLeft = this.queue.get('questionLeft').content
      this.questionRight = this.queue.get('questionRight').content
      this.titleBg = this.queue.get('titleBg').content
      this.errorLine = this.queue.get('errorLine').content
      this.rightLine = this.queue.get('rightLine').content
      this.submitButton = this.queue.get('submit').content
      this.rightModel = this.queue.get('rightModel').content
      this.errorModel = this.queue.get("errorModel").content
      this.rightBtn = this.queue.get("rightBtn").content
      this.resetBtn = this.queue.get("resetBtn").content
      this.tipsLine = this.queue.get("tipsLine").content

      this.queue.off('complete')
      this.fire('complete')
    },
  })
}
