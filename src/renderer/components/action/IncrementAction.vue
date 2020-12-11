<template>
  <div class="action-container">
    <a-spin :spinning="loading">
      <div class="action-title">
        <span>{{ this.form.title }}：</span>
      </div>
      <div class="action-form">
        <a-form-model
          ref="editForm"
          :model="form"
          :rules="rules"
          layout="inline"
        >
          <a-form-model-item label="位置" prop="pos">
            <a-select @change="posChange" v-model="form.pos">
              <a-select-option value="start">开头</a-select-option>
              <a-select-option value="end">结尾</a-select-option>
            </a-select>
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
        title: "递增数字",
        type: "increment",
        start: 1,
        pad: 2,
        step: 1,
        pos: "start",
        checked: true,
      },
      rules: {},
    };
  },
  methods: {
    ...mapActions("action", ["addAction", "editAction"]),
    posChange(val) {
      this.form.pos = val;
    },
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
