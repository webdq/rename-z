<template>
  <div class="action-container">
    <a-spin :spinning="loading">
      <div class="action-title">
        <span>{{ this.form.title }}：</span>
        <span style="font-size: 12px;">
          <a-icon type="info-circle" />
          {{ infoText }}
        </span>
      </div>
      <div class="action-form">
        <a-form-model
          ref="editForm"
          :model="form"
          :rules="rules"
          layout="inline"
        >
          <a-form-model-item label="名称" prop="name">
            <a-input style="width: 890px;" v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item label="起始值" prop="start">
            <a-input-number :precision="0" :min="0" v-model="form.start" />
          </a-form-model-item>
          <a-form-model-item label="增量" prop="step">
            <a-input-number
              :precision="0"
              :min="0"
              :max="10"
              v-model="form.step"
            />
          </a-form-model-item>
          <a-form-model-item label="位数" prop="pad">
            <a-input-number
              :precision="0"
              :min="0"
              :max="10"
              v-model="form.pad"
            />
          </a-form-model-item>
          <a-form-model-item label="不足位补齐" prop="checked">
            <a-checkbox
              @change="fillChange"
              :checked="form.checked"
            ></a-checkbox>
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
        title: "自定义名称",
        type: "custom-name",
        start: 1,
        pad: 2,
        step: 1,
        name: "",
        checked: true,
      },
      rules: {},
      infoText:
        "可添加以下变量，{{num}}：递增数字，{{originName}}：原文件名，{{currentName}}：当前动作时的文件名",
    };
  },
  methods: {
    ...mapActions("action", ["addAction", "editAction"]),
    fillChange(e) {
      this.form.checked = e.target.checked;
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
