import AssetsFectory from '~/components/game/asset'
import StageFectory from '~/components/game/stage'
import ExportScence from '~/components/game/exportScence'
import SubmitButton from '~/components/game/submitButton'
import PanelImage from '~/components/game/panelImage'

export default async function init (questions) {
  // const  // 接入hilo动画引擎
  const Assets = AssetsFectory(questions)

  const assets = new Assets()
  await assets.load()

  // 初始化舞台
  const gameMain = StageFectory()

  const { stage, ticker } = gameMain

  const { bg, titleBg } = assets

  // 准备场景
  const exportScence = new ExportScence({
    x: 0,
    y: 0,
    questions,
    images: { bg, titleBg },
    title: questions.title,
  })

  // 准备按钮 canvas 1920 1080 , subButton 329 96
  const subBtn = new SubmitButton({
    x: (1920 - 329) / 2,
    y: (1080 - 96) / 2 + 470,
    images: assets.submitButton,
    rect: [0, 0, 329, 96],
    visible: true,
  })

  // 题目
  const { questionLeft, questionRight, errorLine, rightLine, questionsImage, errorIcon, tipsLine } = assets
  // 插入题目 两个板块之间的距离 300 每个背景板的长度 499 106
  const panel = new PanelImage({
    // x: (1920 - 499 * 2 - 300) / 2,
    // y: 320 - (this.questions.left.length * 10),
    x: 0,
    y: 0,
    images: { questionLeft, questionRight, errorLine, rightLine, questionsImage, errorIcon, tipsLine },
    questions: questions,
    answerQuestionsIds: [],
    answerRealIds: [],
    resultIds: [],
    type: 'panel',
    stage: stage,
    submitBtn: subBtn
  })

  stage.addChild(exportScence)
  stage.addChild(subBtn)
  stage.addChild(panel)
  return new Promise((re) => {
    ticker.nextTick(() => {
      setTimeout(() => {
        re(stage.canvas.toDataURL('image/png'))
      }, 500)
    })
  })
}

