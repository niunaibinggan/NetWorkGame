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
  import Panel from '~/components/game/panel'
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
        answerQuestionsIds: [],
        answerRealIds: [],
        resultIds: [],
        isAllRight: false,
        questionsPanelCanvas: null,
        questionsResetCanvas: null,
        questionsSubmitCanvas: null,
        setAlpha: 1,
      }
    },
    async mounted () {
      let questions
      // 获取问题
      try {
        questions = await this.$testload()
      } catch (error) {
        questions = localStorage.getItem('questionsConfig')
      }

      if (!questions) return this.$router.replace('/config')

      this.questions = JSON.parse(questions)

      this.shuffle(this.questions.right)

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

      this.questionsPanelCanvas = this.createPanel('panel')

      this.questionsSubmitCanvas = this.createSubmitButton()

    },
    methods: {
      createPanel (type = 'panel') {
        const { questionLeft, questionRight, errorLine, rightLine, questionsImage, errorIcon, tipsLine } = this.assets
        // 插入题目 两个板块之间的距离 300 每个背景板的长度 499 106
        const panel = new Panel({
          // x: (1920 - 499 * 2 - 300) / 2,
          // y: 320 - (this.questions.left.length * 10),
          x: 0,
          y: 0,
          images: { questionLeft, questionRight, errorLine, rightLine, questionsImage, errorIcon, tipsLine },
          questions: this.questions,
          alpha: this.setAlpha,
          answerQuestionsIds: this.answerQuestionsIds,
          answerRealIds: this.answerRealIds,
          resultIds: this.resultIds,
          type,
          stage: this.stage
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
          alpha: this.setAlpha,
        })

        if (Hilo.event.POINTER_START == "touchstart") {
          subBtn.on('mousedown', (e) => {

            this.answerQuestionsIds = this.questionsPanelCanvas.setAnswerQuestionsId

            this.answerRealIds = this.questionsPanelCanvas.setAnswer

            if (this.answerQuestionsIds.length !== this.questions.left.length) return

            // 移除作答模版
            this.stage.removeChild(this.questionsPanelCanvas)

            // 创建显示模版
            this.questionsPanelCanvas = this.createPanel('result')

            this.isAllRight = this.answerQuestionsIds.every(item => item[0] == item[1])

            this.createModel(subBtn)
          })
        }

        subBtn.on(Hilo.event.POINTER_START, (e) => {

          this.answerQuestionsIds = this.questionsPanelCanvas.setAnswerQuestionsId

          this.answerRealIds = this.questionsPanelCanvas.setAnswer

          if (this.answerQuestionsIds.length !== this.questions.left.length) return

          // 移除作答模版
          this.stage.removeChild(this.questionsPanelCanvas)

          // 创建显示模版
          this.questionsPanelCanvas = this.createPanel('result')

          this.isAllRight = this.answerQuestionsIds.every(item => item[0] == item[1])

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
          rect: [-(1920 - 758) / 2, -(1080 - 404 * 0.7) / 2, 1920, 1080],
          isAllRight: this.isAllRight && this.questions.left.length,
          visible: true,
          alpha: this.setAlpha
        })

        // 插入结果 model
        this.stage.addChild(resultModel)

        setTimeout(() => {
          this.questionsResetCanvas = this.createRestButtons()
          this.questionsSubmitCanvas.visible = false
          this.stage.removeChild(resultModel)
          this.questionsResetCanvas.visible = true
        }, 2000)
        return resultModel
      },
      createRestButtons () {
        // 重置按钮
        const repeatX = this.isAllRight ? (1920 - 329) / 2 : (1920 - 329 * 2 - 300) / 2

        const resetButtons = new ResetButton({
          x: repeatX,
          y: (1920 - 96) / 2 + 50,
          images: this.isAllRight ? [this.assets.resetBtn] : [this.assets.rightBtn, this.assets.resetBtn],
          rect: [0, 0, 329, 96],
          isOnlyReset: this.isAllRight,
          visible: false,
          alpha: this.setAlpha
        })

        if (Hilo.event.POINTER_START == "touchstart") {
          resetButtons.on('mousedown', (e) => {

            // 移除显示结果panel
            this.stage.removeChild(this.questionsPanelCanvas)
            this.questionsPanelCanvas = null

            if (this.isAllRight) return this.resetHandel()

            e.eventTarget.id ? this.resetHandel() : this.seachHanel()

          })
        }

        resetButtons.on(Hilo.event.POINTER_START, (e) => {

          // 移除显示结果panel
          this.stage.removeChild(this.questionsPanelCanvas)
          this.questionsPanelCanvas = null

          if (this.isAllRight) return this.resetHandel()

          e.eventTarget.id ? this.resetHandel() : this.seachHanel()

        })
        this.stage.addChild(resetButtons)

        return resetButtons
      },
      resetHandel () {
        this.questionsResetCanvas.visible = false

        this.questionsSubmitCanvas.visible = true

        // 重置基础信息
        this.shuffle(this.questions.right)
        this.answerQuestionsIds = []
        this.answerRealIds = []

        // 重置后创建
        this.questionsPanelCanvas = this.createPanel('panel')

      },
      seachHanel () {
        this.questionsPanelCanvas = this.createPanel('rightResult')
      },

      shuffle (arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
          var randomIndex = Math.floor(Math.random() * (i + 1));
          var itemAtIndex = arr[randomIndex];
          arr[randomIndex] = arr[i];
          arr[i] = itemAtIndex;
        }

        this.questions.right = arr

        this.questions.left.forEach((item, index) => {
          this.resultIds[index] = [item.id, this.questions.right.findIndex(i => i.id === item.id)]
        })
      },
    }
  }
</script>