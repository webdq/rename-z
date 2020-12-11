<template>
  <div class="bl-action panel-box">
    <div class="op-row">
      <a-button @click="addActionClick" type="primary" icon="plus"
        >添加动作</a-button
      >
      <a-button @click="removeActionAllClick" icon="delete"
        >移除所有动作</a-button
      >
    </div>
    <div class="action-title">
      已添加的动作<span style="font-size: 12px;">（可拖动交换位置）</span>
    </div>
    <div class="action-list-container">
      <div class="action-list">
        <draggable
          @start="dragStart"
          @end="dragEnd"
          v-model="actionList"
          v-bind="dragOptions"
          handle=".action-item"
        >
          <transition-group type="transition" name="flip-list">
            <div
              v-for="(item, index) in actionList"
              :key="item.id"
              class="action-item"
            >
              <div class="action-item-text">
                {{ index + 1 }} : {{ item.title }}
              </div>
              <div class="action-btn-row">
                <a-space>
                  <a-button @click="edit(item)" size="small">修改</a-button>
                  <a-button @click="remove(item.id)" size="small"
                    >删除</a-button
                  >
                </a-space>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>

    <a-modal
      :title="editModalTitle"
      v-model="editModalShow"
      :footer="null"
      :width="1000"
      :destroyOnClose="true"
    >
      <EditActionModal
        :actionData="actionData"
        :isEdit="isEdit"
      ></EditActionModal>
    </a-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import EditActionModal from "@/components/action/EditActionModal";
import draggable from "vuedraggable";
export default {
  data() {
    return {
      dragOptions: {
        animation: 200,
        group: "actions",
        disabled: false,
        ghostClass: "ghost",
      },
      editModalTitle: "",
      editModalShow: false,
      actionData: {},
      isEdit: false,
    };
  },
  computed: {
    actionList: {
      get() {
        return this.$store.state.action.actionList;
      },
      set(value) {
        this.$store.commit("action/UPDATE_ACTION", value);
      },
    },
  },
  components: {
    draggable,
    EditActionModal,
  },
  methods: {
    ...mapActions("action", ["removeAllAction", "removeAction"]),
    addActionClick() {
      this.actionData = {};
      this.isEdit = false;
      this.editModalTitle = "添加动作";
      this.editModalShow = true;
    },
    removeActionAllClick() {
      this.removeAllAction();
    },
    edit(item) {
      this.actionData = item;
      this.isEdit = true;
      this.editModalTitle = "修改动作";
      this.editModalShow = true;
    },
    remove(id) {
      this.removeAction({ id });
    },
    dragStart() {
      window.__drag = true;
    },
    dragEnd() {
      window.__drag = false;
    },
  },
};
</script>

<style lang="scss">
.bl-action {
  width: 300px;
  flex: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .action-title {
    font-size: 16px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
  }
  .action-list-container {
    position: relative;
    flex: auto;
  }
  .action-list {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  .action-item {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .action-item-text {
    margin-bottom: 5px;
  }
  .action-item + .action-item {
    border-top: 1px solid #e8e8e8;
  }
}
</style>
