import Hilo from 'hilojs'

export default function (data) {

  return Hilo.Class.create({
    Mixes: Hilo.EventMixin,
    queue: null,
    layout: {},
    bg: null,
    answerError: null,
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

    async load () {
      const resources = [
        { id: 'bg', src: require('~/assets/bg.png') },
        { id: 'answerError', src: require('~/assets/error.png') },
        { id: 'questionLeft', src: require('~/assets/question_left.png') },
        { id: 'questionRight', src: require('~/assets/question_right.png') },
        { id: 'titleBg', src: require('~/assets/title.png') },
        { id: 'errorLine', src: require('~/assets/error-line.png') },
        { id: 'rightLine', src: require('~/assets/right-line.png') },
        { id: 'submit', src: require('~/assets/submit.png') },
        { id: 'errorModel', src: require('~/assets/answer_error.png') },
        { id: 'rightModel', src: require('~/assets/answer.png') },
        { id: 'rightBtn', src: require('~/assets/right_btn.png') },
        { id: 'resetBtn', src: require('~/assets/reset_btn.png') },
      ]

      this.layout = resources

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
      this.answerError = this.queue.get('answerError').content
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

      this.queue.off('complete')
      this.fire('complete')
    },
  })
}
