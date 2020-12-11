<template>
  <div class="edit-action-modal">
    <IncrementAction
      v-show="showComp('increment')"
      :actionData="actionData"
      :isEdit="isEdit"
    ></IncrementAction>
    <UppercaseAction
      v-show="showComp('uppercase')"
      :actionData="actionData"
      :isEdit="isEdit"
    ></UppercaseAction>
    <LowercaseAction
      v-show="showComp('lowercase')"
      :actionData="actionData"
      :isEdit="isEdit"
    ></LowercaseAction>
    <AddChartAction
      v-show="showComp('add-chart')"
      :actionData="actionData"
      :isEdit="isEdit"
    ></AddChartAction>
    <RemoveChartAction
      v-show="showComp('remove-chart')"
      :actionData="actionData"
      :isEdit="isEdit"
    ></RemoveChartAction>
    <ReplaceChartAction
      v-show="showComp('replace-chart')"
      :actionData="actionData"
      :isEdit="isEdit"
    ></ReplaceChartAction>
    <SliceChartAction
      v-show="showComp('slice-chart')"
      :actionData="actionData"
      :isEdit="isEdit"
    ></SliceChartAction>
    <CustomNameAction
      v-show="showComp('custom-name')"
      :actionData="actionData"
      :isEdit="isEdit"
    ></CustomNameAction>
  </div>
</template>

<script>
import IncrementAction from "@/components/action/IncrementAction";
import UppercaseAction from "@/components/action/UppercaseAction";
import LowercaseAction from "@/components/action/LowercaseAction";
import AddChartAction from "@/components/action/AddChartAction";
import RemoveChartAction from "@/components/action/RemoveChartAction";
import ReplaceChartAction from "@/components/action/ReplaceChartAction";
import SliceChartAction from "@/components/action/SliceChartAction";
import CustomNameAction from "@/components/action/CustomNameAction";
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
  components: {
    IncrementAction,
    UppercaseAction,
    LowercaseAction,
    AddChartAction,
    RemoveChartAction,
    ReplaceChartAction,
    SliceChartAction,
    CustomNameAction,
  },
  methods: {
    showComp(name) {
      return (
        this.actionData.type === name || this.actionData.type === undefined
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
