<template>
  <div class="action-container">
    <a-spin :spinning="loading">
      <div class="action-title">
        <span>{{ this.form.title }}：</span>
        <span style="font-size: 12px;">
          <a-icon type="info-circle" />
          0表示第一位，-1表示最后一位，结束位置字符不包含
        </span>
      </div>
      <div class="action-form">
        <a-form-model
          ref="editForm"
          :model="form"
          :rules="rules"
          layout="inline"
        >
          <a-form-model-item label="开始位置" prop="start">
            <a-input-number :precision="0" v-model="form.start" />
          </a-form-model-item>
          <a-form-model-item label="结束位置" prop="end">
            <a-input-number :precision="0" v-model="form.end" />
          </a-form-model-item>
          <a-form-model-item
            :wrapper-col="{ span: 24 }"
            style="text-align:center;"
          >
            <a-button
              v-show="!isEdit"
              :loading="isSubmit"
              @click="saveClick"
              type="primary"
            >
              添加
            </a-button>
            <a-button
              v-show="isEdit"
              :loading="isSubmit"
              @click="editClick"
              type="primary"
            >
              保存
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    actionData: {
      type: Object,
    },
  },
  data() {
    return {
      loading: true,
      isSubmit: false,
      formItemLayout: {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 16,
        },
      },
      form: {
        id: "",
        title: "截取字符",
        type: "slice-chart",
        start: 0,
        end: -1,
      },
      rules: {},
    };
  },
  methods: {
    ...mapActions("action", ["addAction", "editAction"]),
    posChange(val) {
      this.form.pos = val;
    },
    saveClick() {
      this.isSubmit = true;
      let payload = { ...this.form, id: uuidv4() };
      this.addAction(payload);
      this.$message.success("添加成功");
      this.isSubmit = false;
    },
    editClick() {
      this.isSubmit = true;
      let payload = { ...this.form };
      this.editAction(payload);
      this.$message.success("修改成功");
      this.isSubmit = false;
    },
  },
  mounted() {
    if (this.isEdit) {
      this.form = { ...this.actionData };
    }
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped></style>
