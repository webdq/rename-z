<template>
  <div class="action-container">
    <a-spin :spinning="loading">
      <div class="action-title">
        <span>{{ this.form.title }}：</span>
        <span style="font-size: 12px;">
          <a-icon type="info-circle" />
          普通替换、正则替换，2选1
        </span>
      </div>
      <div class="action-form">
        <a-form-model
          ref="editForm"
          :model="form"
          :rules="rules"
          layout="inline"
        >
          <a-form-model-item label="字符" prop="chart">
            <a-input v-model="form.chart" />
          </a-form-model-item>
          <a-form-model-item label="替换字符" prop="replace">
            <a-input v-model="form.replace" />
          </a-form-model-item>
          <a-form-model-item label="忽略大小写" prop="caps">
            <a-checkbox @change="capsChange" :checked="form.caps"></a-checkbox>
          </a-form-model-item>
          <a-form-model-item label="替换全部" prop="all">
            <a-checkbox @change="allChange" :checked="form.all"></a-checkbox>
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
      <div class="action-form">
        <a-form-model
          ref="editForm2"
          :model="form"
          :rules="rules"
          layout="inline"
        >
          <a-form-model-item label="正则" prop="pattern">
            <a-input addon-before="/" addon-after="/" v-model="form.pattern" />
          </a-form-model-item>
          <a-form-model-item label="修饰符" prop="flags">
            <a-input v-model="form.flags" />
          </a-form-model-item>
          <a-form-model-item label="替换字符" prop="replace">
            <a-input v-model="form.replace" />
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
        title: "替换字符",
        type: "replace-chart",
        all: true,
        caps: true,
        chart: "",
        replace: "",
        pattern: "",
        flags: "",
      },
      rules: {},
      allowedFlags: ["g", "i", "m", "s", "u", "y"],
    };
  },
  methods: {
    ...mapActions("action", ["addAction", "editAction"]),
    capsChange(e) {
      this.form.caps = e.target.checked;
    },
    allChange(e) {
      this.form.checked = e.target.checked;
    },
    saveClick() {
      this.isSubmit = true;
      let flags = this.form.flags;
      flags = [...new Set(flags.split(""))];
      flags = flags.filter((item) => this.allowedFlags.indexOf(item) > -1);
      flags = flags.join("");
      let payload = { ...this.form, id: uuidv4(), flags };
      this.addAction(payload);
      this.$message.success("添加成功");
      this.isSubmit = false;
    },
    editClick() {
      this.isSubmit = true;
      let flags = this.form.flags;
      flags = [...new Set(flags.split(""))];
      flags = flags.filter((item) => this.allowedFlags.indexOf(item) > -1);
      flags = flags.join("");
      let payload = { ...this.form, flags };
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
