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
        isAllRight: false
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

      const { bg, titleBg, questionLeft,
        questionRight, errorLine, rightLine,
        submitButton, rightModel, errorModel,
        rightBtn, resetBtn } = this.assets

      // 初始化背景
      this.initBackground()

      // 准备场景
      const exportScence = new ExportScence({
        x: 0,
        y: 0,
        questions: this.questions,
        images: { bg, titleBg, questionLeft, questionRight, errorLine, rightLine },
        title: this.questions.title,
        // initTimeTranslate: this.timeTranslate,
      })

      // 插入题目 两个板块之间的距离 300 每个背景板的长度 499 106
      const panel = new QuestionsPanel({
        x: (1920 - 499 * 2 - 300) / 2,
        y: 320,
        images: { questionLeft, questionRight, errorLine, rightLine },
        questions: this.questions,
      })

      // 准备按钮 canvas 1920 1080 , subButton 329 96
      const subBtn = new SubmitButton({
        x: (1920 - 329) / 2,
        y: (1080 - 96) / 2 + 470,
        images: submitButton,
        rect: [0, 0, 329, 96],
        visible: true,
      })

      subBtn.on(Hilo.event.POINTER_START, (e) => {
        resultModel.visible = true
      })

      // 重置按钮
      const repeatX = this.isAllRight ? (1920 - 329) / 2 : (1920 - 329 * 2 - 400) / 2

      const resetButtons = new ResetButton({
        x: repeatX,
        y: (1920 - 96) / 2 + 50,
        images: this.isAllRight ? [resetBtn] : [rightBtn, resetBtn],
        rect: [0, 0, 329, 96],
        isAllRight: this.isAllRight,
        visible: false
      })

      // console.log(resetButtons.children[0])
      resetButtons.children[0].on(Hilo.event.POINTER_START, (e) => {
        console.log(22)
      })

      // 结果 Model
      const resultModel = new ResultModel({
        x: 0,
        y: 0,
        images: { rightModel, errorModel },
        width: 1920,
        height: 1080,
        rect: [-(1920 - 758) / 2, -(1080 - 404) / 2, 1920, 1080],
        isAllRight: this.isAllRight,
        visible: false
      })

      resultModel.on(Hilo.event.POINTER_START, (e) => {
        resultModel.visible = false
        resetButtons.visible = true
        subBtn.visible = false
      })

      // // 插入背景
      // this.stage.addChild(exportScence)
      // // 插入题目
      // this.stage.addChild(panel)
      // // 插入提交按钮
      // this.stage.addChild(subBtn)
      // // 插入结果 model
      // this.stage.addChild(resultModel)
      // // 插入重置按钮
      // this.stage.addChild(resetButtons)
      // //结束场景

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
      initTimeTranslate () {
        let minutes = Math.floor(this.questions.time / 60)

        let seconds = this.questions.time - minutes * 60

        minutes = Number(minutes) < 10 ? `0${minutes}` : minutes

        seconds = Number(seconds) < 10 ? `0${seconds}` : seconds

        this.timeTranslate = `${minutes}:${seconds}`
      }
    }
  }
</script>

<style>
</style>
