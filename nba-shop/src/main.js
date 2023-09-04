import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import routerPartner from "./router/partner";
import routerEmployee from "./router/employee";
import store from "./store";
import jwtDecode from "jwt-decode";
//Prime Template
import PrimeVue from "primevue/config";

import "primevue/resources/themes/lara-light-purple/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
//prime flex
import "primeflex/primeflex.css";
//Custom css
import "@/assets/css/custom.css";

//component PrimVue ตัวเสริมที่ใช้บ่อยๆ ให้อัพที่นี่
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import Calendar from "primevue/calendar";
import Toast from "primevue/toast";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import InputSwitch from "primevue/inputswitch";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Password from "primevue/password";
import Dialog from "primevue/dialog";
import DataTable from "primevue/datatable";
import Divider from "primevue/divider";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; //optional for column grouping
import Row from "primevue/row";
import Card from "primevue/card";
import Chip from "primevue/chip";
import Panel from "primevue/panel";
import Textarea from "primevue/textarea";
import FileUpload from "primevue/fileupload";
import Image from "primevue/image";
import Toolbar from "primevue/toolbar";
import ProgressSpinner from "primevue/progressspinner";
import DataView from "primevue/dataview";
import Editor from "primevue/editor";
import Inplace from "primevue/inplace";
import PanelMenu from "primevue/panelmenu";
import TabMenu from "primevue/tabmenu";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Skeleton from "primevue/skeleton";
import Sidebar from "primevue/sidebar";
import Timeline from "primevue/timeline";
import Badge from "primevue/badge";
import MarqueeText from "vue-marquee-text-component";
import Chart from 'primevue/chart';
import VueHtmlToPaper from "./plugins/VueHtmlToPaper.js";
import Fieldset from 'primevue/fieldset';
import Message from 'primevue/message'
import ScrollPanel from 'primevue/scrollpanel';
import Galleria from 'primevue/galleria';
import InlineMessage from 'primevue/inlinemessage';
import Checkbox from 'primevue/checkbox';
import Steps from 'primevue/steps';
const app = createApp(App);
//Use
app.use(VueHtmlToPaper);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.use(store);

//ถอดรหัสตรวจสอบสถานะ และ เส้นทาง
try {
  const token = localStorage.getItem("token");
  const jwt_decode = jwtDecode(token);
  if (jwt_decode.row === "partner") {
    app.use(routerPartner);
  } else if (jwt_decode.row === "employee") {
    app.use(routerEmployee);
  } else {
    app.use(router);
  }
} catch (err) {
  app.use(router);
}

//Component
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Calendar", Calendar);
app.component("Row", Row);
app.component("InputText", InputText);
app.component("InputMask", InputMask);
app.component("Dropdown", Dropdown);
app.component("Password", Password);
app.component("Dialog", Dialog);
app.component("Divider", Divider);
app.component("InputNumber", InputNumber);
app.component("Button", Button);
app.component("Toast", Toast);
app.component("Card", Card);
app.component("Panel", Panel);
app.component("Textarea", Textarea);
app.component("InputSwitch", InputSwitch);
app.component("ConfirmDialog", ConfirmDialog);
app.component("FileUpload", FileUpload);
app.component("Image", Image);
app.component("Toolbar", Toolbar);
app.component("Chip", Chip);
app.component("ProgressSpinner", ProgressSpinner);
app.component("Editor", Editor);
app.component("Inplace", Inplace);
app.component("DataView", DataView);
app.component("PanelMenu", PanelMenu);
app.component("TabMenu", TabMenu);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);
app.component("Skeleton", Skeleton);
app.component("Sidebar", Sidebar);
app.component("Timeline", Timeline);
app.component("Badge", Badge);
app.component("marquee-text", MarqueeText);
app.component('Chart',Chart);
app.component('Fieldset',Fieldset);
app.component('Message',Message);
app.component('ScrollPanel',ScrollPanel);
app.component('Galleria',Galleria);
app.component('InlineMessage',InlineMessage);
app.component('Checkbox',Checkbox);
app.component('Steps',Steps)
app.mount("#app");