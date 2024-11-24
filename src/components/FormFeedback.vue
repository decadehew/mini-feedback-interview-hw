<script setup lang="ts">
import { ref, reactive } from 'vue'

import type {
  FormInstance,
  FormRules,
  UploadFile,
  UploadProps,
  UploadRequestOptions,
} from 'element-plus'
import type { RuleForm } from '@/types'
import { UPLOAD_CONFIG } from '@/config/constants'

const CATEGORY_OPTIONS = [
  { label: '操作問題', value: 'a' },
  { label: '優化建議', value: 'b' },
  { label: 'Bug 反饋', value: 'c' },
  { label: '其他', value: 'd' },
]

const emits = defineEmits(['submit'])
const props = defineProps<{
  loading: boolean
}>()
const formData = defineModel<RuleForm>({
  default: () => ({
    category: '',
    title: '',
    desc: '',
    imageList: [],
  }),
})

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<RuleForm>>({
  category: [{ required: true, message: '請選擇類別', trigger: 'change' }],
  title: [{ required: true, message: '請輸入標題', trigger: 'blur' }],
  desc: [{ required: true, message: '請輸入描述', trigger: 'blur' }],
  // 圖片驗證
  // imageList: [
  //   {
  //     validator: (rule, value, callback) => {
  //       if (formData.value.imageList && formData.value.imageList.length > 0) {
  //         callback()
  //       } else {
  //         callback(new Error('請上傳至少一張圖片'))
  //       }
  //     },
  //     trigger: ['blur', 'change'],
  //   },
  // ],
})
const previewImageUrl = ref('')
const previewImageVisible = ref(false)

// 驗證上傳的圖片是否符合規格
const validUploadFile = (file: File) => {
  if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      message: '只支持 JPG/PNG 格式的圖片',
    }
  }
  if (file.size > UPLOAD_CONFIG.MAX_SIZE) {
    return {
      isValid: false,
      message: '圖片大小不能超過 5MB',
    }
  }

  return { isValid: true }
}

const addAttachment = (uploadFile: UploadFile) => {
  console.log('上傳圖片', uploadFile)

  // URL.createObjectURL(file.file)，element-plus 會自動生成
  formData.value.imageList.push(uploadFile)
}

const onRemoveImage = (uploadFile: UploadFile) => {
  formData.value.imageList = formData.value.imageList.filter((item) => {
    return item.uid !== uploadFile.uid
  })
}

// 預覽圖片
const onPreviewImage = (uploadFile: UploadFile) => {
  previewImageUrl.value = uploadFile.url!
  previewImageVisible.value = true
}

const onBeforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const { isValid, message } = validUploadFile(rawFile) as {
    isValid: boolean
    message?: string
  }

  if (!isValid) {
    ElMessage.error(message)
    return false
  }

  return true
}

const onUploadError = (error: Error) => {
  console.log('onUploadError', error.message)
  ElMessage.error(error.message)
}

const onUpload = (uploadRequestOptions: UploadRequestOptions) => {
  console.log('onUpload 到 server', uploadRequestOptions)
}

const onSubmit = async () => {
  if (!ruleFormRef.value) return

  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      emits('submit')
    } else {
      console.log('驗證失敗，請檢查以下欄位：', fields)
    }
  })
}
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="formData"
    :rules="rules"
    label-width="auto"
    class="custom-form"
    style="max-width: 600px"
    label-position="top"
  >
    <el-form-item label="類別" prop="category">
      <el-select v-model="formData.category" placeholder="請選擇類別">
        <el-option
          v-for="item in CATEGORY_OPTIONS"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item class="form-item-title-hint" prop="title">
      <template #label>
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-1">
            <span class="text-red-500">*</span>
            <h3 class="text-gray-500 text-base">標題</h3>
          </div>
          <span class="text-gray-400 text-xs">(只限30字符)</span>
        </div>
      </template>
      <el-input
        v-model="formData.title"
        placeholder="請輸入標題"
        maxlength="30"
      />
    </el-form-item>
    <el-form-item class="form-item-title-hint" prop="desc">
      <template #label>
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-1">
            <span class="text-red-500">*</span>
            <h3 class="text-gray-500 text-base">描述</h3>
          </div>
          <span class="text-gray-400 text-xs">(只限300字符)</span>
        </div>
      </template>
      <el-input
        v-model="formData.desc"
        type="textarea"
        placeholder="請輸入描述"
        maxlength="300"
        :autosize="{ minRows: 3, maxRows: 3 }"
        show-word-limit
      />
    </el-form-item>
    <el-form-item>
      <template #label>
        <div class="flex items-center space-x-3">
          <div class="flex items-center space-x-1">
            <h3 class="text-gray-500 text-base">參考圖片</h3>
          </div>
          <span class="text-gray-400 text-xs"
            >(僅提供PNG、JPG格式，每張5MB內)
          </span>
        </div>
      </template>
      <!-- 圖片列表 -->
      <div class="flex items-center space-x-3">
        <div class="flex space-x-3">
          <div
            v-for="item in formData.imageList"
            :key="item.url"
            class="relative group border border-gray-200 rounded-md w-[148px] h-[148px] overflow-hidden"
          >
            <img
              class="object-cover w-full h-full rounded-md"
              :src="item.url"
              alt="item.url"
            />
            <div
              class="rounded-md absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4 cursor-pointer"
            >
              <icon-ep-zoom-in
                class="text-white"
                @click="onPreviewImage(item)"
              />
              <icon-mdi-trash class="text-white" @click="onRemoveImage(item)" />
            </div>
          </div>
        </div>
        <el-upload
          class="custom-upload"
          :class="{ 'upload-hidden': formData.imageList.length >= 3 }"
          action=""
          list-type="picture-card"
          :show-file-list="false"
          :http-request="onUpload"
          :before-upload="onBeforeUpload"
          :on-change="addAttachment"
          :on-error="onUploadError"
          :on-preview="onPreviewImage"
          :on-remove="onRemoveImage"
        >
          <icon-ep-plus class="text-gray-400 size-8" />
        </el-upload>
      </div>
      <p class="w-full flex pt-3 text-gray-400 text-xs">
        可提供意見/問題截圖(上傳數量 {{ formData.imageList.length }}/{{
          UPLOAD_CONFIG.MAX_COUNT
        }})
      </p>
    </el-form-item>
    <el-form-item>
      <el-button
        class="w-full"
        type="primary"
        size="large"
        :loading="props.loading"
        @click="onSubmit"
      >
        提交
      </el-button>
    </el-form-item>
  </el-form>
  <el-dialog v-model="previewImageVisible">
    <img w-full :src="previewImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<style scoped>
.custom-form
  :deep(.form-item-title-hint.is-required:not(.is-no-asterisk).asterisk-left)
  > .el-form-item__label:before {
  content: '';
}

.custom-upload.upload-hidden :deep(.el-upload--picture-card) {
  display: none;
}

.group:hover img {
  filter: brightness(0.7);
  transition: all 0.3s;
}
</style>
