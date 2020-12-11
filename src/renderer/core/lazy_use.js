import Vue from "vue";

// base library
import {
  ConfigProvider,
  Layout,
  Row,
  Col,
  Button,
  Icon,
  FormModel,
  Input,
  InputNumber,
  Radio,
  Checkbox,
  Select,
  Modal,
  Table,
  List,
  Spin,
  Upload,
  Alert,
  Popover,
  Progress,
  Pagination,
  Space,
  message,
  notification,
} from "ant-design-vue";

// ext library
// import Dialog from "@/components/Dialog";
// import MultiTab from "@/components/MultiTab";
// import PageLoading from "@/components/PageLoading";
// import PermissionHelper from "@/utils/helper/permission";
// import "./directives/action";

Vue.use(ConfigProvider);
Vue.use(Layout);
Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(Icon);
Vue.use(FormModel);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Modal);
Vue.use(Table);
Vue.use(List);
Vue.use(Spin);
Vue.use(Upload);
Vue.use(Alert);
Vue.use(Popover);
Vue.use(Progress);
Vue.use(Pagination);
Vue.use(Space);

Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;

// Vue.use(Dialog); // this.$dialog func
// Vue.use(MultiTab);
// Vue.use(PageLoading);
// Vue.use(PermissionHelper);
