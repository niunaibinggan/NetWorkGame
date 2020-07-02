<template>
  <div class="root">
    <h1 class="root__title">题目：{{questions.left.length}}/{{target}}
      <span class="root__tips">(每题有唯一的答案)</span></h1>

    <h3 class="root__title-set">设置标题：
      <input type="text"
             v-model="questions.title">
    </h3>

    <div class="root__bottom">
      <span class="root__add"
            @click="addQuestion">添加</span>
      <span class="root__submit"
            @click="submitConfig">提交</span>
      <span class="root__default"
            @click="defalutConfig">默认配置</span>

    </div>

    <ul class="root__question"
        v-if="isText">
      <li v-for="(item, index) in questions.left"
          :key="item.id"
          class="root__question-item">
        <span class="root__question-left root__question-common">
          <input type="text"
                 v-model="item.text">
        </span>
        <span class="root__question-line"></span>
        <span class="root__delete"
              :class="{'root__delete-none': questions.left.length ===2}"
              @click="deleteQuestion(index)">删除</span>

        <span class="root__question-right root__question-common">
          <input type="text"
                 v-model="questions.right[index].text">
        </span>
      </li>
    </ul>

    <ul class="root__question"
        v-else>
      <li v-for="(item, index) in questionsImage.left"
          :key="item.id"
          class="root__question-item">
        <span class="root__question-left root__question-common"
              style="margin-top:60px">
          <input type="text"
                 v-model="item.text">
        </span>
        <span class="root__question-line"
              style="margin-top:80px; width: 25%"></span>
        <span class="root__delete"
              :class="{'root__delete-none': questionsImage.left.length ===2}"
              @click="deleteQuestion(index)">删除</span>

        <div class="root__upload">
          <Upload @upload="upload"
                  class="root__upload-set"
                  :current="index"></Upload>
          <img v-if="questionsImage.right[index].text"
               class="root__upload-image"
               :src="questionsImage.right[index].text" />
        </div>

      </li>
    </ul>

    <p class="root__toggle">
      <span @click="toggle">{{isText? '文 - 文': '文 - 图'}}</span>
    </p>

    <div class="root__model"
         v-if="visible">
      {{tips}}
    </div>

  </div>
</template>

<script>
  import Upload from "~/components/Upload";
  export default {
    components: { Upload },
    data () {
      return {
        questions: {
          left: [
            { id: 0, text: '' },
            { id: 1, text: '' },
          ],
          right: [
            { id: 0, text: '' },
            { id: 1, text: '' },
          ],
          title: '连线游戏'
        },
        questionsImage: {
          left: [
            { id: 0, text: '' },
            { id: 1, text: '' },
          ],
          right: [
            { id: 0, text: '' },
            { id: 1, text: '' },
          ],
          title: '连线游戏'
        },
        tips: '',
        visible: false,
        target: 5,
        isText: false,
        uploadImage: ''
      }
    },
    watch: {
      "questions.time": function (val) {
        // console.log(typeof val)
      }
    },
    computed: {
      questionsType () {
        return this.isText ? 'questions' : 'questionsImage'
      }
    },
    methods: {
      upload (data) {
        this.questionsImage.right[data.current].text = data.content
      },
      deleteQuestion (index) {
        this[this.questionsType].left.splice(index, 1)
        this[this.questionsType].right.splice(index, 1)
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
      addQuestion () {
        this.target = this.isText ? 5 : 4
        if (this[this.questionsType].left.length >= this.target) {
          this.tips = `最多添加${this.target}道题目`
          this.tipsModel()
          return
        }
        let createId = this[this.questionsType].left[this[this.questionsType].left.length - 1].id + 1
        this[this.questionsType].left.push({ id: createId, text: '' })
        this[this.questionsType].right.push({ id: createId, text: '' })
      },
      defalutConfig () {
        if (this.isText) {
          this.questions.left = [
            { id: 0, text: '9 + 8' },
            { id: 1, text: '1 + 8' },
          ]
          this.questions.right = [
            { id: 0, text: '17' },
            { id: 1, text: '9' },
          ]
          return
        }
        this.questionsImage.left = [
          { id: 0, text: 'apple' },
          { id: 1, text: 'banana' },
        ]
        this.questionsImage.right = [
          { id: 0, text: 'http://i.nibaku.com/img_5_1621076003x3346949080_26.jpg' },
          { id: 1, text: 'http://img4.imgtn.bdimg.com/it/u=2641311620,3928227804&fm=26&gp=0.jpg' }
        ]
      },
      submitConfig () {
        const leftVerify = this[this.questionsType].left.every(item => item.text)
        if (!leftVerify) {
          this.tips = `题目不能为空！`
          this.tipsModel()
          return
        }

        const rightVerify = this[this.questionsType].right.every(item => item.text)

        if (!rightVerify) {
          this.tips = `答案不能为空！`
          this.tipsModel()
          return
        }

        if (!this[this.questionsType].title) {
          this.tips = `请填写标题！`
          this.tipsModel()
          return
        }

        this[this.questionsType].type = this.isText ? 'text' : 'image'

        let setQuestion = this[this.questionsType]

        setQuestion.right = this.shuffle(this[this.questionsType].right)

        localStorage.setItem('questionsConfig', JSON.stringify(setQuestion))
        // this.$router.replace('/')

      },
      tipsModel () {
        this.visible = true
        setTimeout(() => {
          this.visible = false
        }, 1000)
      },
      toggle () {
        this.isText = !this.isText
      },
    }
  }
</script>
<style scoped>
  .root {
    /* padding: 0 20%; */
    max-width: 720px;
    margin: 0 auto;
  }
  .root__title {
    margin: 3% 0;
    padding-top: 10% 0;
  }
  .root__tips {
    margin-left: 20px;
    font-size: 14px;
    color: #ccc;
  }
  .root__question {
    margin: 0 auto;
    width: 100%;
    min-width: 720px;
  }
  .root__question-item {
    width: 100%;
    min-height: 80px;
    overflow: hidden;
    min-width: 200px;
    position: relative;
    overflow: hidden;
  }
  .root__question-common {
    width: 40%;
    height: 40px;
    font-size: 12px;
    line-height: 40px;
    border: 1px solid #efefef;
    border-radius: 4px;
    padding-left: 10px;
  }
  .root__question-common input {
    border: none;
    font-size: 14px;
    margin-left: 5px;
    padding-left: 10px;
    width: 70%;
    padding-bottom: 5px;
  }
  .root__question-line {
    width: 8%;
    float: left;
    margin-left: 1%;
    margin-right: 1%;
    height: 1px;
    background: #585858;
    margin-top: 20px;
  }
  .root__question-left {
    float: left;
  }
  .root__question-right {
    float: right;
    margin-right: 10%;
  }
  .root__delete {
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    background: #e63939;
    font-size: 12px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 5px;
  }
  .root__delete-none {
    display: none;
  }

  .root__bottom {
    margin-bottom: 5%;
    width: 100%;
    height: 40px;
    min-width: 720px;
  }

  .root__add {
    display: inline-block;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    background: #3496ff;
    font-size: 12px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
  }

  .root__title-set {
    font-size: 16px;
    color: #5f5c5c;
    margin: 5% 0 3%;
  }
  .root__title-set input {
    border: none;
    border-bottom: 1px solid #000;
    font-size: 14px;
    margin-left: 5px;
    padding-left: 10px;
    padding-bottom: 5px;
    width: 40%;
  }

  .root__default {
    float: right;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    background: #7e827f;
    font-size: 12px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    margin-right: 20px;
  }

  .root__submit {
    float: right;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    background: #39e698;
    font-size: 12px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
  }
  .root__model {
    position: absolute;
    left: 50%;
    top: 10%;
    transform: translateX(-50%);
    background: #ffa921;
    padding: 10px 40px;
    border-radius: 4px;
    color: #fff;
  }

  .root__toggle {
    margin-top: 30px;
    text-align: center;
    min-width: 720px;
  }
  .root__toggle span {
    display: inline-block;
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    background: #3496ff;
    font-size: 12px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    margin-left: -10%;
  }
  .root__upload {
    width: 150px;
    height: 150px;
    border: 1px dashed #ccc;
    float: left;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
  .root__upload-set {
    width: 150px;
    height: 150px;
  }
  .root__upload-image {
    width: 148px;
    height: 148px;
    position: absolute;
    left: 0;
    top: 0;
  }
</style>