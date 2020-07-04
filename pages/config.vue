<template>
  <div class="root">
    <h3 class="root__title-set">
      <input type="text"
             v-if="isText"
             v-model="questions.title"
             placeholder="请输入标题">
      <input v-else
             type="text"
             v-model="questionsImage.title"
             placeholder="请输入标题">
    </h3>

    <ul class="root__question"
        v-if="isText">
      <li v-for="(item, index) in questions.left"
          :key="item.id"
          class="root__question-item">
        <p>
          <span class="root__question-left root__question-common">
            <input type="text"
                   placeholder="请输入拖动元素名称"
                   v-model="item.text">
          </span>
          <span class="root__question-line"></span>

          <span class="root__question-right root__question-common">
            <input type="text"
                   placeholder="请输入目标元素名称"
                   v-model="questions.right[index].text">
          </span>

          <span class="root__delete"
                :class="{'root__delete-none': questions.left.length ===2}"
                @click="deleteQuestion(index)">x</span>
        </p>
      </li>
    </ul>

    <ul class="root__question"
        v-else>
      <li v-for="(item, index) in questionsImage.left"
          :key="item.id"
          class="root__question-item root__image-item">
        <p>
          <span class="root__image-left">
            <input type="text"
                   placeholder="请输入文字"
                   v-model="item.text">
          </span>
          <span class="root__image-line"></span>
          <span class="root__upload">
            <Upload @upload="upload"
                    class="root__upload-set"
                    :current="index"></Upload>

            <el-image v-if="questionsImage.right[index].text"
                      class="root__upload-image"
                      :src="questionsImage.right[index].text"
                      fit="contain"></el-image>
          </span>
          <span class="root__upload-tips"
                v-if="!questionsImage.right[index].text">+请上传图片</span>

          <span class="root__delete"
                style="top: 55px;"
                :class="{'root__delete-none': questionsImage.left.length ===2}"
                @click="deleteQuestion(index)">x</span>
        </p>
      </li>
    </ul>

    <div class="root__bottom">
      <div class="root__bottom-contnet">
        <div class="root__toggle">
          <span @click="toggle"
                :class="{'root__toggle-active': isText}">文-文</span>
          <span @click="toggle"
                :class="{'root__toggle-active': !isText}">文-图</span>
        </div>

        <span class="root__add"
              @click="addQuestion">
          +添加连线({{isText ? questions.left.length :questionsImage.left.length}}/{{target}})
        </span>

        <span class="root__submit"
              @click="submitConfig">完成</span>
        <span class="root__default"
              @click="defalutConfig">导入范例</span>
      </div>
    </div>

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
          title: ''
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
          title: ''
        },
        tips: '',
        visible: false,
        target: 5,
        isText: true,
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
          { id: 0, text: require('~/assets/apple.jpg') },
          { id: 1, text: require('~/assets/banana.jpg') }
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

        localStorage.setItem('questionsConfig', JSON.stringify(setQuestion))

        this.$router.replace('/')

      },
      tipsModel () {
        this.visible = true
        setTimeout(() => {
          this.visible = false
        }, 1000)
      },
      toggle () {
        this.isText = !this.isText
        this.target = this.isText ? 5 : 4
      },
    }
  }
</script>
<style scoped>
  .root {
    min-width: 600px;
    margin: 0 auto;
  }
  .root__question {
    margin: 0 auto;
    width: 100%;
    min-width: 600px;
    min-height: 400px;
    overflow: scroll;
  }
  .root__question-item {
    width: 100%;
    overflow: hidden;
    padding-top: 15px;
    height: 70px;
    cursor: pointer;
  }
  .root__image-item {
    height: 130px;
    margin-top: 8px;
    padding: 0;
  }
  .root__question-item:hover {
    background: rgba(217, 223, 255, 0.3);
  }
  .root__question-item p {
    padding: 0 35px;
    width: 100%;
    min-width: 600px;
    max-width: 1000px;
    overflow: hidden;
    margin: 0 auto;
    position: relative;
  }

  .root__image-item p {
    width: 100%;
    overflow: hidden;
    margin: 0 auto;
    position: relative;
    min-width: 300px;
    max-width: 650px;
  }

  .root__question-time-active {
    background: rgba(217, 223, 255, 0.3);
  }
  .root__question-common {
    width: 40%;
    height: 40px;
    font-size: 12px;
    line-height: 40px;
    border: 1px solid #cccccc;
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
    background: none;
    cursor: pointer;
  }
  .root__question-line {
    width: 20%;
    float: left;
    height: 1px;
    background: #585858;
    margin-top: 20px;
  }
  .root__image-line {
    width: calc(100% - 268px);
    float: left;
    height: 1px;
    background: #585858;
    margin-top: 65px;
  }
  .root__question-left {
    float: left;
  }
  .root__question-right {
    float: right;
  }
  .root__delete {
    width: 22px;
    height: 23px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    color: #ccc;
    cursor: pointer;
    border: 1px solid #ccc;
    position: absolute;
    left: 0;
    top: 8px;
    font-size: 18px;
    cursor: pointer;
  }
  .root__delete:hover {
    background: rgba(173, 173, 173, 0.3);
    color: #fff;
  }
  .root__delete-none {
    display: none;
  }

  .root__bottom {
    position: fixed;
    width: 100%;
    height: 40px;
    min-width: 450px;
    bottom: 5%;
    left: 0;
    text-align: center;
  }

  .root__bottom-contnet {
    max-width: 1000px;
    margin: 0 auto;
  }

  .root__add {
    display: inline-block;
    padding: 8px 20px;
    background: #ffb647;
    font-size: 12px;
    border-radius: 130px;
    color: #fff;
    cursor: pointer;
  }

  .root__add:hover {
    background: #ffa721;
  }

  .root__title-set {
    font-size: 16px;
    color: #5f5c5c;
    margin: 3% 0 2%;
    text-align: center;
    width: 100%;
  }
  .root__title-set input {
    border: none;
    border: 1px solid #cccccc;
    font-size: 14px;
    margin-left: 5px;
    padding: 10px 10px;
    width: 20%;
  }

  .root__default {
    float: right;
    padding: 8px 20px;
    background: #7e827f;
    font-size: 12px;
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    margin-right: 20px;
  }

  .root__submit {
    float: right;
    padding: 8px 20px;
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
    float: left;
    border-radius: 130px;
    overflow: hidden;
    border: 1px solid #ccc;
    position: relative;
    color: #868786;
  }
  .root__toggle::after {
    content: "";
    position: absolute;
    left: 50%;
    width: 1px;
    height: 40px;
    background: #ccc;
    top: 0;
  }
  .root__toggle span {
    padding: 3px;
    float: left;
    padding: 7px 13px;
    font-size: 12px;
    cursor: pointer;
  }
  .root__toggle-active {
    background: #3496ff;
    color: #fff;
  }
  .root__toggle-active:hover {
    background: #1f89fb;
    color: #fff;
  }
  .root__upload {
    width: 130px;
    height: 130px;
    border: 1px solid #ccc;
    float: right;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
  }
  .root__upload-set {
    width: 130px;
    height: 130px;
  }
  .root__upload-image {
    width: 128px;
    height: 128px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .root__upload-tips {
    position: absolute;
    top: 55px;
    font-size: 14px;
    color: #787878;
    right: 70px;
  }

  .root__image-left {
    float: left;
    height: 130px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .root__image-left input {
    border: none;
    font-size: 14px;
    margin-left: 5px;
    padding: 0 10px;
    width: 130px;
    background: none;
    line-height: 130px;
  }
</style>