import type { UploadFile } from 'element-plus'

export interface RuleForm {
  category: string
  title: string
  desc: string
  imageList: UploadFile[]
}
