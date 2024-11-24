<script setup lang="ts">
import { ref } from 'vue'

import type { RuleForm } from '@/types'
import FormFeedback from '@/components/FormFeedback.vue'

const loading = ref(false)
const dialogVisible = ref(false)
const formData = ref<RuleForm>({
  category: '',
  title: '',
  desc: '',
  imageList: [],
})

const dialogBeforeClose = async (done: () => void) => {
  const hasData = Object.entries(formData.value).some(([key, value]) => {
    if (key === 'imageList') {
      return value.length > 0
    }

    return Boolean(value)
  })

  if (hasData) {
    ElMessageBox.confirm('確定要關閉嗎？您所填寫表單的內容將會被丟失！', {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
    })
      .then(() => {
        formData.value = {
          category: '',
          title: '',
          desc: '',
          imageList: [],
        }
        done()
      })
      .catch(() => {})
  } else {
    done()
  }
}

const onSubmit = async () => {
  loading.value = true
  try {
    // 模擬發送資料到 server
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log('請求到 server 端 Request Body：', formData.value)

    ElMessageBox.alert(
      `
        <h3 class="text-lg text-green-500 flex items-center space-x-3 gap-3 mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024"><path fill="#1fad55" d="M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896m-55.808 536.384l-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.27 38.27 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"/></svg>
          提交成功
        </h3>
        <p>感謝您的反饋，我們會繼續努力，提供更優質服務！</p>
      `,
      '',
      {
        dangerouslyUseHTMLString: true,
        // showClose: false,
        showConfirmButton: false,
      }
    )

    setTimeout(() => {
      formData.value = {
        category: '',
        title: '',
        desc: '',
        imageList: [],
      }
      ElMessageBox.close()
      dialogVisible.value = false

      ElMessage.success('提交成功')
    }, 5000)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div>
      <!-- content... -->
      <icon-ep-warning-filled
        class="size-8 text-blue-500 fixed bottom-8 right-8 cursor-pointer"
        @click="dialogVisible = true"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="意見反饋"
      width="600"
      :before-close="dialogBeforeClose"
    >
      <FormFeedback :loading="loading" v-model="formData" @submit="onSubmit" />
    </el-dialog>
  </div>
</template>
<style>
.el-popper__arrow {
  left: unset !important;
  right: 14px !important;
}
</style>
