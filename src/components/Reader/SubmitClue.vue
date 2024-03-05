<!-- 提交线索 -->
<template>
  <div>
    <div class="container">
      <h2>提交线索</h2>
      <!-- 填写框 -->
      <div class="part1" >
        <el-form :model="clue" label-width="60px" >
          <el-form-item label="标题">
            <el-input v-model="clue.title" placeholder="25字以内" :maxlength="25" />
          </el-form-item>
          <el-form-item label="类别" style="width: 300px;">
            <el-select v-model="clue.field" placeholder="请选择" style="width: 240px">
              <el-option v-for="f in fields" :label="f" :value="f"/>
            </el-select>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="clue.content" type="textarea" placeholder="字数不少于20字,不超过1000字" :minlength="20"
              :maxlength="1000" :rows="7"></el-input>
          </el-form-item>
          <el-form-item label="链接">
            <el-input v-model="clue.link"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input type="phone" v-model="clue.phone" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item v-if="false" label="验证码">
            <el-input type="phone" placeholder="13800000000" v-model="authCode" style="width: 250px;"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" round @click="submit">提交</el-button>
      </div>
      <!-- end -->
      <!-- 填写须知 -->
      <div class="part2">
        <h2>填写须知</h2>
        <p>1.请保证提交内容的客观、真实，并对此承担相应的法律责任。</p>
        <p>2.请按照提示清晰、完整地填写相关内容，并允许本平台根据工作需要，在保护您个人权益的前提下，使用您的任何叙述。</p>
        <p>3.请如实填写您的联系方式，以便核实相关情况，您的个人信息将被严格保密。</p>
        <p>4.请勿重复提交，以免影响平台运行效率。</p>
        <p>5.涉政治有害、暴力、低俗等违法和不良信息，请举报至中央网信办（国家网信办）违法和不良信息举报中心
          <a href="http://www.12377.cn" target="_blank">http://www.12377.cn</a>
        </p>
      </div>
      <!-- end -->
    </div>
  </div>
</template>

<script lang='ts' setup>
import { ref, reactive, toRefs, onBeforeMount, onMounted, onUnmounted } from 'vue'
import type { Clue } from '@/types'
import { ElMessage } from 'element-plus';
import clueApi from '@/request/api/clueApi'
import { useInfoStore } from "@/store"

const store = useInfoStore();
//数据
const clue = ref<Clue>({
  id: null,
  link: null,
  title: null,
  content: null,
  submitTime: null,
  phone: null,
  field: null,
})
const authCode = ref('')
const fields = [
  '新冠肺炎疫情专项',
  '时事政治',
  '党史国史',
  '食药卫生',
  '公共政策',
  '公共安全',
  '突发事件',
  '科学常识',
  '社会热点',
  '其他'
];

//方法
onMounted(()=>{
clue.value.phone=store.userInfo.phone
})

async function submit(){
  if(clue.value.title===null||clue.value.title===''){
    ElMessage("标题不能为空！")
  }else if(clue.value.field===null||clue.value.field===''){
    ElMessage("请选择类别！")
  }else if(clue.value.phone===null||clue.value.phone===''){
    ElMessage("手机号不能为空")
  }else if(clue.value.content===null||clue.value.content===''){
    ElMessage("内容不能为空")
  }else{  //提交
    let result = await clueApi.add(clue.value);
    if(result.data.code===1){
      ElMessage("提交成功")
    }
  }
}
function empty(){
  clue.value = {}as Clue
}
</script>

<style scoped>
.container{
  padding: 20px;
}
.part1 {
  border: 2px solid rgba(0, 0, 0, 0.355);
  padding: 20px 50px;
  margin: 20px auto;
  width:1000px;
  /* text-align: center; */
}

</style>