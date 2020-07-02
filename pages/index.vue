<template>
  <div class="container"
       ref="container"></div>

</template>

<script>
  import Hilo from 'hilojs'
  import AssetsFectory from '~/components/game/asset'
  import StageFectory from '~/components/game/stage'
  import ExportScence from '~/components/game/exportScence'
  import SubmitButton from '~/components/game/submitButton'
  import QuestionsPanel from '~/components/game/questionsPanel'
  import ResultModel from '~/components/game/resultModel'
  import ResetButton from '~/components/game/resetButton'
  export default {
    data () {
      return {
        timeTranslate: '',
        gameMain: null,
        stage: null,
        assets: null,
        questions: {
          // left: [
          //   { id: 1, text: 9 + 8 },
          //   { id: 2, text: 1 + 8 },
          //   { id: 3, text: 1 + 8 + 9 },
          // ],
          // right: [
          //   { id: 1, text: 9 + 8 },
          //   { id: 2, text: 1 + 8 },
          //   { id: 3, text: 1 + 8 + 9 }
          // ],
          // title: '连线游戏'
        },
        answerIds: [],
        isAllAnswer: false,
        isAllRight: false,
        isSubmit: false,
        questionsPanelCanvas: null,
        questionsResetCanvas: null,
        questionsSubmitCanvas: null,
      }
    },
    async mounted () {
      // 获取问题
      this.getQuestion()

      // this.initTimeTranslate()

      // 预加载图片
      const Assets = AssetsFectory(this.questions)
      this.assets = new Assets()
      await this.assets.load()

      // 初始化舞台
      this.gameMain = StageFectory()
      this.stage = this.gameMain.stage
      this.$refs['container'].appendChild(this.stage.canvas)

      const oCanvas = document.querySelector('canvas')

      const { bg, titleBg } = this.assets

      // 初始化背景
      this.initBackground()

      // 准备场景
      const exportScence = new ExportScence({
        x: 0,
        y: 0,
        questions: this.questions,
        images: { bg, titleBg },
        title: this.questions.title,
      })

      // 插入背景
      this.stage.addChild(exportScence)

      this.questionsPanelCanvas = this.createPanel()

      this.questionsResetCanvas = this.createRestButtons()

      this.questionsSubmitCanvas = this.createSubmitButton()

      //结束场景

    },
    methods: {
      getQuestion () {
        // let configData
        // try {
        //   // configData = await this.$testload()
        //   if (typeof configData === 'string') {
        //     configData = JSON.parse(configData || null)
        //   }
        // } catch (error) {
        //   configData = JSON.parse(localStorage.getItem('configData') || null)
        // }
        let questions = localStorage.getItem('questionsConfig')

        if (!questions) return this.$router.replace('/config')

        this.questions = JSON.parse(questions)
        // this.questions.type = 'text'
        // this.questions.right.length = 2
        // this.questions.right[0].text = '1+3+9'
        // this.questions.right[1].text = '33333'
        // this.questions.left[1].text = '1+3+9'
        // this.questions.left[0].text = '1+3+9+1'
      },
      initBackground () {
        const oCanvas = document.querySelector('canvas')
        const oContainer = document.querySelector('.container')

        const { width: bgWidth, height: bgHeight } = oCanvas.getBoundingClientRect()

        const oBgWarpper = Hilo.createElement('div', {
          id: 'bg',
          style: {
            // background: `url(${require('~/assets/bg.png')}) no-repeat`,
            backgroundSize: bgWidth + 'px, ' + bgHeight + 'px',
            position: 'absolute',
            width: bgWidth + 'px',
            height: bgHeight + 'px'
          }
        })

        oContainer.insertBefore(oBgWarpper, this.stage.canvas);
      },
      createPanel () {
        const { questionLeft, questionRight, errorLine, rightLine, questionsImage } = this.assets
        // 插入题目 两个板块之间的距离 300 每个背景板的长度 499 106
        const panel = new QuestionsPanel({
          x: (1920 - 499 * 2 - 300) / 2,
          y: 320 - (this.questions.left.length * 10),
          images: { questionLeft, questionRight, errorLine, rightLine, questionsImage },
          questions: this.questions,
          alpha: 1,
          isSubmit: this.isSubmit
        })

        this.stage.addChild(panel)
        return panel
      },
      createSubmitButton () {
        // 准备按钮 canvas 1920 1080 , subButton 329 96
        const subBtn = new SubmitButton({
          x: (1920 - 329) / 2,
          y: (1080 - 96) / 2 + 470,
          images: this.assets.submitButton,
          rect: [0, 0, 329, 96],
          visible: true,
          alpha: 1,
        })

        subBtn.on(Hilo.event.POINTER_START, (e) => {

          this.answerIds = this.questionsPanelCanvas.setAnswerQuestionsId

          if (!this.answerIds.length) return

          this.isSubmit = true

          this.questionsPanelCanvas.isSubmit = true

          this.isAllAnswer = this.questionsPanelCanvas.setAnswerQuestionsId.length === this.questions.left.length

          this.isAllRight = this.questionsPanelCanvas.setAnswerQuestionsId.every(item => item[0] == item[1])

          this.createModel(subBtn)
        })
        this.stage.addChild(subBtn)

        return subBtn
      },
      createModel (subBtn) {
        const resultModel = new ResultModel({
          x: 0,
          y: 0,
          images: { rightModel: this.assets.rightModel, errorModel: this.assets.errorModel },
          width: 1920,
          height: 1080,
          rect: [-(1920 - 758) / 2, -(1080 - 404) / 2, 1920, 1080],
          isAllRight: this.isAllRight && this.questions.left.length,
          visible: true
        })

        // 插入结果 model
        this.stage.addChild(resultModel)

        resultModel.on(Hilo.event.POINTER_START, (e) => {
          this.questionsSubmitCanvas.visible = false
          this.stage.removeChild(resultModel)
          this.questionsResetCanvas.visible = true
        })

        return resultModel
      },
      createRestButtons () {
        // 重置按钮
        const isOnlyReset = this.isAllRight && this.isAllAnswer

        const repeatX = isOnlyReset ? (1920 - 329) / 2 : (1920 - 329 * 2 - 300) / 2

        const resetButtons = new ResetButton({
          x: repeatX,
          y: (1920 - 96) / 2 + 50,
          images: isOnlyReset ? [this.assets.resetBtn] : [this.assets.rightBtn, this.assets.resetBtn],
          rect: [0, 0, 329, 96],
          isOnlyReset: isOnlyReset,
          visible: false
        })
        resetButtons.on(Hilo.event.POINTER_START, (e) => {

          this.stage.removeChild(this.questionsPanelCanvas)

          this.questions.right = this.shuffle(this.questions.right)

          this.createPanel()

          this.questionsResetCanvas.visible = false
          this.questionsSubmitCanvas.visible = true
        })

        this.stage.addChild(resetButtons)

        return resetButtons
      },
      shuffle (arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
          var randomIndex = Math.floor(Math.random() * (i + 1));
          var itemAtIndex = arr[randomIndex];
          arr[randomIndex] = arr[i];
          arr[i] = itemAtIndex;
        }
        return arr
      },
    }
  }
</script>

<style>
</style>
