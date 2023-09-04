<template>
  <div>
    <div class="grid">
      <div class="col-12">
        <Button
          label="เพิ่มพนักงาน"
          icon="pi pi-user-plus"
          @click="(dialogEmployee = true), (actionButton = 'add')"/>
      </div>
    </div>
    <!-- Table Employee-->
    <div class="grid">
      <div class="col-12">
        <DataTable
          :value="item_employee"
          responsiveLayout="scroll"
          :paginator="true"
          :rows="10"
        >
          <template #empty>
            <p class="text-center"><em>ไม่พบข้อมูล</em></p>
          </template>
          <Column
            style="width: 10%"
            field="employee_username"
            header="รหัสพนักงาน"
          ></Column>
          <Column field="employee_name" header="ชื่อ-นามสกุล"></Column>
          <Column style="width: 15%" header="ตำแหน่ง">
            <template #body="item">
              <Chip
                :label="statusName(item.data.employee_position)"
                :class="statusColor(item.data.employee_position)"
              />
            </template>
          </Column>
          <Column style="width: 10%" header="สถานะ">
            <template #body="item">
              <InputSwitch
                :modelValue="item.data.employee_status"
                @click="updateStatus(item.data)"
                v-if="item.data._id!==this.$store.getters.id"
              />
            </template>
          </Column>
          <Column style="width: 15%" header="ตัวเลือก">
            <template #body="item">
              <Button
                icon="pi pi-pencil"
                class="mr-2"
                @click="openDialogEdit(item.data)"
                v-if="item.data._id!==this.$store.getters.id"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-danger"
                @click="delEmployee(item.data._id)"
                v-if="item.data._id!==this.$store.getters.id"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Dialog Add Employee -->
    <Dialog
      v-model:visible="dialogEmployee"
      :modal="true"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
      :style="{ width: '30vw' }"
    >
      <template #header>
        <strong>{{ actionTitle }}</strong></template
      >
      <div class="grid">
        <div class="col-12">
          <div class="field">
            <label>ชื่อ-นามสกุล :</label>
            <InputText
              v-model="employee.employee_name"
              class="font w-full"
              placeholder="กรอกชื่อ-นามสกุลพนักงาน"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label>เบอร์โทร : </label>
            <InputMask
              v-model="employee.employee_phone"
              mask="999-9999999"
              class="w-full font"
              placeholder="กรอกเบอร์โทรศัพท์"
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label>ชื่อผู้ใช้งาน (Username):</label>
            <div class="p-inputgroup" v-if="actionButton === 'add'">
              <span class="p-inputgroup-addon">
                <strong>{{ this.shop.shop_number }}-</strong>
              </span>
              <InputText
                v-model="employee.employee_username"
                placeholder="กรอกชื่อผู้ใช้งานเป็นตัวเลขเท่านั้น"
                class="w-full font"
                oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');"
              />
            </div>
            <InputText
              v-model="employee.employee_username"
              class="w-full"
              :disabled="true"
              v-else
            />
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label>รหัสผ่าน (Password) :</label>
            <Password
              v-model="employee.employee_password"
              class="w-full"
              placeholder="กรอกรหัสผ่าน"
              inputClass="font"
              inputStyle="width:100%"
            >
              <template #footer>
                <Divider />
                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                  <li>ต้องมีอย่างน้อย 6 ตัวอักษรขึ้นไป</li>
                </ul>
              </template>
            </Password>
          </div>
        </div>
        <div class="col-12">
          <div class="field">
            <label>ตำแหน่ง :</label>
            <Dropdown
              v-model="employee.employee_position"
              :options="item_position"
              optionLabel="name"
              optionValue="value"
              placeholder="เลือกตำแหน่ง"
              class="w-full"
              inputClass="font"
            ></Dropdown>
          </div>
        </div>
      </div>
      <template #footer>
        <Button
          label="ยกเลิก"
          class="p-button-text"
          @click="clearForm(), (dialogEmployee = false)"
        />
        <Button
          label="บันทึก"
          @click="addEmployee()"
          v-if="actionButton === 'add'"
        />
        <Button label="อัปเดต" @click="updateEmployee()" v-else />
      </template>
    </Dialog>
  </div>
</template>
  
  <script>
import axios from "axios";
import dayjs from "dayjs";
export default {
  created(){
    document.title="จัดการพนักงานในร้านค้า"
  },
  async mounted() {
    //โหลดร้านค้า
    await axios
      .get(`${process.env.VUE_APP_SHOP}shop/${localStorage.getItem('shop_id')}`, {
        headers: {
          "auth-token": `Bearer ${this.$store.getters.token}`,
        },
      })
      .then((res) => {
        this.shop = res.data.data;
      })
      .catch((err) => {
        if (err.response.status === 408) {
          window.location.reload();
        }
      });
    //โหลดพนักงานของร้านค้า
    await axios
      .get(`${process.env.VUE_APP_SHOP}employee/shop/${localStorage.getItem('shop_id')}`, {
        headers: {
          "auth-token": `Bearer ${this.$store.getters.token}`,
        },
      })
      .then((res) => {
        this.employees = res.data.data;
        this.item_employee = this.employees;
      })
      .catch((err) => {
        if (err.response.status === 408) {
          window.location.reload();
        }
      });
  },
  data: () => ({
    //about add edit
    actionTitle: "เพิ่มพนักงานในร้านค้า",
    actionButton: "add",
    dialogEmployee: false,
    employees: [],
    item_employee: [],
    item_position: [
      { name: "ผู้จัดการ", value: "manager" },
      { name: "แคชเชียร์", value: "cashier" },
      { name: "ทั่วไป", value: "general" },
    ],
    employee: {
      employee_shop_id: "",
      employee_name: "",
      employee_username: "",
      employee_password: "",
      employee_phone: "",
      employee_position: "",
    },
    shop: {
      _id: "",
      shop_number: "",
    },
  }),
  methods: {
    clearForm() {
      this.employee.employee_name = "";
      this.employee.employee_username = "";
      this.employee.employee_password = "";
      this.employee.employee_phone = "";
      this.employee.employee_position = "";
    },
    addEmployee() {
      if (
        this.employee.employee_name === "" ||
        this.employee.employee_username === "" ||
        this.employee.employee_password === "" ||
        this.employee.employee_phone === "" ||
        this.employee.employee_position === ""
      ) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "กรุณากรอกข้อมูลให้ครบถ้วน",
          life: 3000,
        });
        return false;
      }
      this.$confirm.require({
        message: "ต้องการเพิ่มพนักงานในร้านค้านี้?",
        header: "เพิ่มพนักงาน",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "ตกลง",
        rejectLabel: "ยกเลิก",
        accept: async () => {
          const data = {
            ...this.employee,
            employee_shop_id: this.shop._id,
            employee_username: `${this.shop.shop_number}-${this.employee.employee_username}`,
            employee_date_start: dayjs(Date.now()).format(),
          };
          await axios
            .post(`${process.env.VUE_APP_SHOP}employee`, data, {
              headers: {
                "auth-token": `Bearer ${this.$store.getters.token}`,
              },
            })
            .then((res) => {
              this.item_employee.push(res.data.result);
              this.$toast.add({
                severity: "success",
                summary: "สำเร็จ",
                detail: "เพิ่มพนักงานในร้านค้าเรียบร้อยแล้ว",
                life: 3000,
              });
              this.clearForm();
              this.dialogEmployee = false;
            })
            .catch((err) => {
              if (err.response.status === 408) {
                window.location.reload();
              }
              this.$toast.add({
                severity: "error",
                summary: "ไม่สำเร็จ",
                detail: err.response.data.message,
                life: 3000,
              });
            });
        },
      });
    },
    statusColor(status) {
      switch (status) {
        case "manager":
          return "bg-purple-800 text-white";
        case "cashier":
          return "bg-purple-600 text-white";
        case "general":
          return "bg-purple-400 text-white";
        default:
          return "bg-red-600 text-white";
      }
    },
    statusName(status) {
      switch (status) {
        case "manager":
          return "ผู้จัดการ";
        case "cashier":
          return "แคชเชียร์";
        case "general":
          return "พนักงานทั่วไป";
        default:
          return status;
      }
    },
    openDialogEdit(item) {
      this.employee = {
        ...item,
        employee_password: "",
      };
      this.actionButton = "edit";
      this.actionTitle = "แก้ไขพนักงาน รหัส " + item.employee_username;

      this.dialogEmployee = true;
    },
    updateEmployee() {
      console.log(this.employee);
      const emp_id = this.employee._id;
      const position = this.item_employee.findIndex((el) => el._id === emp_id);
      if (
        this.employee.employee_name === "" ||
        this.employee.employee_phone === "" ||
        this.employee.employee_position === ""
      ) {
        this.$toast.add({
          severity: "warn",
          summary: "แจ้งเตือน",
          detail: "กรุณากรอกข้อมูลให้ครบถ้วน",
          life: 3000,
        });
        return false;
      }
      this.$confirm.require({
        message: "ต้องการอัพเดตข้อมูลผู้ใช้งานนี้?",
        header: "อัพเดตพนักงาน",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "ตกลง",
        rejectLabel: "ยกเลิก",
        accept: async () => {
          //set data
          let new_data = null;
          if (this.employee.employee_password === "") {
            new_data = {
              _id: this.employee._id,
              employee_username: this.employee.employee_username,
              employee_name: this.employee.employee_name,
              employee_phone: this.employee.employee_phone,
              employee_position: this.employee.employee_position,
              employee_status: this.employee.employee_status,
            };
          } else {
            new_data = {
              ...this.employee,
              employee_phone: this.employee.employee_phone.replace(/-/g, ""),
            };
          }
          await axios
            .put(`${process.env.VUE_APP_SHOP}employee/${emp_id}`, new_data, {
              headers: {
                "auth-token": `Bearer ${this.$store.getters.token}`,
              },
            })
            .then(() => {
              this.item_employee.splice(position, 1, new_data);
              this.dialogEmployee = false;
              this.$toast.add({
                severity: "success",
                summary: "สำเร็จ",
                detail: "อัพเดตข้อมูลพนักงานสำเร็จ",
                life: 3000,
              });
            })
            .catch((err) => {
              if (err.response.status === 408) {
                window.location.reload();
              }
              this.$toast.add({
                severity: "error",
                summary: "ไม่สำเร็จ",
                detail: err.response.data.message,
                life: 3000,
              });
            });
        },
      });
    },
    delEmployee(emp_id) {
      const position = this.item_employee.findIndex((el) => el._id === emp_id);
      this.$confirm.require({
        message: "ต้องการลบข้อมูลพนักงานในร้านค้านี้?",
        header: "ลบพนักงาน",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "ตกลง",
        rejectLabel: "ยกเลิก",
        accept: async () => {
          await axios
            .delete(`${process.env.VUE_APP_SHOP}employee/${emp_id}`, {
              headers: {
                "auth-token": `Bearer ${this.$store.getters.token}`,
              },
            })
            .then(() => {
              this.item_employee.splice(position, 1);
              this.$toast.add({
                severity: "success",
                summary: "สำเร็จ",
                detail: "ลบข้อมูลพนักงานเรียบร้อย",
                life: 3000,
              });
            })
            .catch((err) => {
              if (err.response.status === 408) {
                window.location.reload();
              }
              this.$toast.add({
                severity: "error",
                summary: "ไม่สำเร็จ",
                detail: err.response.data.message,
                life: 3000,
              });
            });
        },
      });
    },
    async updateStatus(item) {
      const position = this.item_employee.findIndex(
        (el) => el._id === item._id
      );
      let status = null;
      let text = "";
      if (item.employee_status) {
        status = false;
        text = "ปิด";
      } else {
        status = true;
        text = "เปิด";
      }
      await axios
        .put(
          `${process.env.VUE_APP_SHOP}employee/${item._id}`,
          { employee_status: status },
          {
            headers: {
              "auth-token": `Bearer ${this.$store.getters.token}`,
            },
          }
        )
        .then(() => {
          this.$toast.add({
            severity: "success",
            summary: text + "การใช้งาน",
            detail: "อัพเดตสถานะพนักงานคนนี้เรียบร้อยแล้ว",
            life: 3000,
          });
          this.item_employee.splice(position, 1, {
            ...item,
            employee_status: status,
          });
        });
    },
  },
};
</script>