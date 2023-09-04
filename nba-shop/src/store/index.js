import { createStore } from "vuex";
export default createStore({
  state: {
    loading: false,
    logedIn: false,
    token: localStorage.getItem("token"),
    level: "",
    name: "",
    position: "",
    id: "",
    shop: [],
    partner: [],
    shop_credit: 0,
    cart_product: [],
    cart_total: 0,
    order_product: [],
    order_total: 0,
    order_list: [],
    order_discount: 0,
    product_shop: [],
    //สินค้าฝากขาย
    order_consignment: [],

    //express
    couriers: [],
    item_courier: [],
    order_express: [],
    express_total: 0,
    //order counter service
    order_cs: [],
    order_cs_total: 0,
    //order mobile top up
    order_topup: [],
    order_topup_total: 0,

    //artwork
    order_artwork: [],
    order_artwork_detail: [],
    artwork_list: [],
    item_artwork: [],
    artwork_cus: {
      name: "",
      tel: "",
      address: "",
      line_id: "",
      people_id: "",
      tel_platform: "",
    },

    //website
    order_website: [],
    order_website_detail: [],
    website_cus: {
      name: "",
      tel: "",
      address: "",
      people_id: "",
      line_id: "",
      tel_platform: "",
    },

    //media
    order_media: [],
    order_media_detail: [],
    media_cus: {
      name: "",
      tel: "",
      address: "",
      people_id: "",
      line_id: "",
      tel_platform: "",
    },

    //พ.ร.บ. 
    order_act: [],
    order_act_detail: [],
    act_cus: {
      name: "",
      tel: "",
      address: "",
      people_id: "",
      line_id: "",
      tel_platform: "",
    },

    order_tax: [],
    order_tax_detail: [],
    tax_cus: {
      name: "",
      tel: "",
      address: "",
      people_id: "",
      tel_platform: "",
    },

    //ประกัน
    order_insurance: [],
    order_insurance_detail: [],
    insurance_img: [],
    insurance_cus: {
      name: "",
      tel: "",
      address: "",
      people_id: "",
      line_id: "",
    },

    //บริการด้านบัญชี
    order_accounting: [],
    order_accounting_detail: [],
    accounting_cus: {
      name: "",
      tel: "",
      address: "",
      people_id: "",
      line_id: "",
      tel_platform: "",
    },

    // IT-Support
    order_itsupport: [],
    order_itsupport_detail: [],
    itsupport_cus: {
      name: "",
      tel: "",
      address: "",
      people_id: "",
      line_id: "",
      tel_platform: "",
    },

    //for show
    item_order: [],
  },
  getters: {
    //artwork
    item_artwork: (state) => state.item_artwork,
    order_artwork: (state) => state.order_artwork,
    order_artwork_detail: (state) => state.order_artwork_detail,
    artwork_cus(state) {
      const data = {
        name: state.artwork_cus.name,
        tel: state.artwork_cus.tel,
        address: state.artwork_cus.address,
        people_id: state.artwork_cus.people_id,
        line_id: state.artwork_cus.line_id,
        tel_platform: state.artwork_cus.tel_platform,
      }
      return data;
    },
    // เขียนโปรแกรมและออกแบบเว็บไซต์
    order_website: (state) => state.order_website,
    order_website_detail: (state) => state.order_website_detail,
    website_cus(state) {
      const data = {
        name: state.website_cus.name,
        tel: state.website_cus.tel,
        address: state.website_cus.address,
        people_id: state.website_cus.people_id,
        line_id: state.website_cus.line_id,
        tel_platform: state.website_cus.tel_platform,
      }
      return data;
    },
    // สื่อโฆษณาออนไลน์
    order_media: (state) => state.order_media,
    order_media_detail: (state) => state.order_media_detail,
    media_cus(state) {
      const data = {
        name: state.media_cus.name,
        tel: state.media_cus.tel,
        address: state.media_cus.address,
        people_id: state.media_cus.people_id,
        line_id: state.media_cus.line_id,
        tel_platform: state.media_cus.tel_platform,
      }
      return data;
    },

    //พ.ร.บ.
    order_act: (state) => state.order_act,
    order_act_detail: (state) => state.order_act_detail,
    act_cus(state) {
      const data = {
        name: state.act_cus.name,
        tel: state.act_cus.tel,
        address: state.act_cus.address,
        people_id: state.act_cus.people_id,
        line_id: state.act_cus.line_id,
        tel_platform: state.act_cus.tel_platform,
      }
      return data;
    },
    
    //ภาษี
    order_tax: (state) => state.order_tax,
    order_tax_detail: (state) => state.order_tax_detail,
    tax_cus(state) {
      const data = {
        name: state.tax_cus.name,
        tel: state.tax_cus.tel,
        address: state.tax_cus.address,
        people_id: state.tax_cus.people_id,
        line_id: state.tax_cus.line_id,
        tel_platform: state.tax_cus.tel_platform,
      }
      return data;
    },

    //ประกัน
    order_insurance: (state) => state.order_insurance,
    order_insurance_detail: (state) => state.order_insurance_detail,
    insurance_img: (state) => state.insurance_img,
    insurance_cus(state) {
      const data = {
        name: state.insurance_cus.name,
        tel: state.insurance_cus.tel,
        address: state.insurance_cus.address,
        people_id: state.insurance_cus.people_id,
        line_id: state.insurance_cus.line_id,
        tel_platform: state.insurance_cus.tel_platform,
      }
      return data;
    },
    // บริการด้านบัญชี
    order_accounting: (state) => state.order_accounting,
    order_accounting_detail: (state) => state.order_accounting_detail,
    accounting_cus(state) {
      const data = {
        name: state.accounting_cus.name,
        tel: state.accounting_cus.tel,
        address: state.accounting_cus.address,
        people_id: state.accounting_cus.people_id,
        line_id: state.accounting_cus.line_id,
        tel_platform: state.accounting_cus.tel_platform,
      }
      return data;
    },
    // บริการ IT-Support
    order_itsupport: (state) => state.order_itsupport,
    order_itsupport_detail: (state) => state.order_itsupport_detail,
    itsupport_cus(state) {
      const data = {
        name: state.itsupport_cus.name,
        tel: state.itsupport_cus.tel,
        address: state.itsupport_cus.address,
        people_id: state.itsupport_cus.people_id,
        line_id: state.itsupport_cus.line_id,
        tel_platform: state.itsupport_cus.tel_platform,
      }
      return data;
    },
    order_artwork_total: (state) => state.order_artwork_detail.reduce((sum, order) => sum + order.total, 0),
    order_website_total: (state) => state.order_website_detail.reduce((sum, order) => sum + order.total, 0),
    order_media_total: (state) => state.order_media_detail.reduce((sum, order) => sum + order.total, 0),
    order_act_total: (state) => state.order_act_detail.reduce((sum, order) => sum + order.total, 0),
    order_tax_total: (state) => state.order_tax_detail.reduce((sum, order) => sum + order.total, 0),
    order_insurance_total: (state) => state.order_insurance_detail.reduce((sum, order) => sum + order.total, 0),
    order_accounting_total: (state) => state.order_accounting_detail.reduce((sum, order) => sum + order.total, 0),
    order_itsupport_total: (state) => state.order_itsupport_detail.reduce((sum, order) => sum + order.total, 0),
    //สินค้าฝากขาย
    order_consignment: (state) => state.order_consignment,
    order_consignment_total: (state) =>
      state.order_consignment.reduce((sum, product) => sum + product.total, 0),
    order_consignment_profit: (state) =>
      state.order_consignment.reduce((sum, product) => sum + ((product.productNBA_price - product.productNBA_cost) * product.amount), 0),
    item_order: (state) => state.item_order,
    loading: (state) => state.loading,
    //express
    order_express: (state) => state.order_express,
    item_courier: (state) => state.item_courier,

    logedIn: (state) => state.logedIn,
    token: (state) => state.token,
    level: (state) => state.level,
    position: (state) => state.position,
    name: (state) => state.name,
    id: (state) => state.id,
    shop: (state) => state.shop,
    partner: (state) => state.partner,
    shop_credit: (state) => state.shop_credit,

    cart_product: (state) => state.cart_product,
    cart_total: (state) =>
      state.cart_product.reduce(
        (sum, product) => sum + product.total - state.order_discount,
        0
      ),
    product_shop: (state) => state.product_shop,
    order_product: (state) => state.order_product,
    order_list: (state) => state.order_list,
    order_total: (state) =>
      state.order_product.reduce((sum, product) => sum + product.total, 0),
    order_discount: (state) => state.order_discount,
    //express
    order_express_total: (state) =>
      state.order_express.reduce((sum, order) => sum + order.total, 0),
    amountProductById: (state) => (id) => {
      const amount = state.order_product.find((el) => el._id === id);
      if (amount) {
        return amount.amount;
      } else {
        return 0;
      }
    },
    amountProductExpressById: (state) => (id) => {
      const amount = state.order_express.find((el) => el.id === id);
      if (amount) {
        return amount.amount;
      } else {
        return 0;
      }
    },
    //counter service
    order_cs: (state) => state.order_cs,
    order_cs_total: (state) =>
      state.order_cs.reduce((sum, order) => sum + order.total, 0),
    //mobile topup
    order_topup: (state) => state.order_topup,
    order_topup_total: (state) =>
      state.order_topup.reduce((sum, order) => sum + order.total, 0),
  },
  mutations: {
    setLoading(state, item) {
      state.loading = item;
    },
    setItemOrder(state, item) {
      state.item_order = item;
    },
    setLogin(state, item) {
      (state.logedIn = item.logedIn),
        (state.level = item.level),
        (state.position = item.position),
        (state.name = item.name),
        (state.id = item.id);
    },
    setDefaultLogin(state) {
      (state.logedIn = ""),
        (state.level = ""),
        (state.position = ""),
        (state.name = ""),
        (state.id = "");
    },
    setShop(state, item) {
      state.shop = item;
    },
    setPartner(state, item) {
      state.partner = item;
    },
    setWalletPartner(state, item) {
      state.partner.partner_wallet = item;
    },
    setShopCredit(state, item) {
      state.shop_credit = item;
    },
    setProductShop(state, item) {
      state.product_shop = item;
    },
    setDefaultCart(state) {
      state.cart_product = [];
      state.cart_total = 0;
    },
    setOrderDiscount(state, item) {
      state.order_discount = item;
    },
    pushCart(state, item) {
      const check_data = state.cart_product.find((el) => el._id === item._id);
      if (check_data) {
        const position = state.cart_product.findIndex(
          (el) => el._id === item._id
        );
        const new_item = {
          ...check_data,
          total: check_data.total + item.total,
          amount: check_data.amount + item.amount,
        };
        state.cart_product.splice(position, 1, new_item);
      } else {
        state.cart_product.push(item);
      }
    },
    updateCart(state, item) {
      const position = state.cart_product.findIndex(
        (el) => el._id === item._id
      );
      state.cart_product.splice(position, 1, item);
    },
    delProductCart(state, item) {
      const position = state.cart_product.findIndex(
        (el) => el._id === item._id
      );
      state.cart_product.splice(position, 1);
    },
    //about order
    setDefaultOrder(state) {
      state.order_product = [];
      state.order_total = 0;
      state.order_list = [];
      state.order_discount = 0;
    },
    pushOrder(state, item) {
      const order = state.order_product.find((el) => el._id === item._id);
      if (order) {
        const position = state.order_product.findIndex(
          (el) => el._id === item._id
        );
        const new_data = {
          ...order,
          amount: order.amount + item.amount,
          total: order.total + item.total,
        };
        state.order_product.splice(position, 1, new_data);
      } else {
        state.order_product.push(item);
      }

      //set ราคารวมลง local storage
      localStorage.setItem(
        "order_total",
        state.order_product.reduce((sum, product) => sum + product.total, 0)
      );

      let order_amount = 0;
      state.order_product.forEach((el) => {
        // console.log(el);
        order_amount = order_amount + el.amount;
      });
      localStorage.setItem("order_amount", order_amount);
    },
    updateOrder(state, item) {
      const position = state.order_product.findIndex(
        (el) => el._id === item._id
      );
      state.order_product.splice(position, 1, item);

      //set ราคารวมลง local storage
      localStorage.setItem(
        "order_total",
        state.order_product.reduce((sum, product) => sum + product.total, 0)
      );

      let order_amount = 0;
      state.order_product.forEach((el) => {
        console.log(el);
        order_amount = order_amount + el.amount;
      });
      localStorage.setItem("order_amount", order_amount);
    },
    delOrder(state, item) {
      const position = state.order_product.findIndex(
        (el) => el._id === item._id
      );
      state.order_product.splice(position, 1);
      //set ราคารวมลง local storage
      localStorage.setItem(
        "order_total",
        state.order_product.reduce((sum, product) => sum + product.total, 0)
      );
      let order_amount = 0;
      state.order_product.forEach((el) => {
        console.log(el);
        order_amount = order_amount + el.amount;
      });
      localStorage.setItem("order_amount", order_amount);
    },

    //Express
    setItemCourier(state, item) {
      state.couriers = item;
      state.item_courier = item;
    },
    pushOrderExpress(state, item) {
      const order = state.order_express.find((el) => el.id === item.id);
      if (order) {
        const position = state.order_express.findIndex(
          (el) => el.id === item.id
        );
        const new_data = {
          ...order,
          amount: order.amount + item.amount,
          total: order.total + item.total,
        };
        state.order_express.splice(position, 1, new_data);
      } else {
        state.order_express.push(item);
      }
      const order_parcel = state.order_express.filter(
        (el) => el.type === "parcel"
      );
      if (order_parcel.length !== 0) {
        state.item_courier = state.couriers.filter(
          (el) => el.courier_code === order_parcel[0].detail.courier_code
        );
      } else {
        state.item_courier = state.couriers;
      }

      //set ราคารวมลง local storage
      localStorage.setItem(
        "order_total",
        state.order_express.reduce((sum, order) => sum + order.total, 0)
      );
    },
    removeOrderExpress(state, id) {
      const position = this.getters.order_express.findIndex(
        (el) => el.id === id
      );
      state.order_express.splice(position, 1);

      //check courier
      const express = state.order_express.find((el) => el.type === "parcel");
      if (!express) {
        state.item_courier = state.couriers;
      }
      //set ราคารวมลง local storage
      localStorage.setItem(
        "order_total",
        state.order_express.reduce((sum, product) => sum + product.total, 0)
      );
    },
    updateOrderExpress(state, item) {
      const position = state.order_express.findIndex((el) => el.id === item.id);
      state.order_express.splice(position, 1, item);
    },
    checkItemCourier(state) {
      const item = state.order_express.filter((el) => el.type === "parcel");
      if (item.length !== 0) {
        state.item_courier = state.couriers.filter(
          (el) => el.courier_code === item[0].detail.courier_code
        );
      } else {
        state.item_courier = state.couriers;
      }
    },
    setDefaultOrderExpress(state) {
      state.order_express = [];
      localStorage.setItem("order_total", 0);
      localStorage.setItem("order_change", -1);
    },
    setOrderCS(state, item) {
      if (item.length !== 0) {
        for (let i = 0; i < item.length; i++) {
          state.order_cs.push(item[i]);
        }
      } else {
        state.order_cs = [];
      }
      localStorage.setItem("order_total", state.order_cs_total);
    },
    setOrderTopup(state, item) {
      if (item.length !== 0) {
        for (let i = 0; i < item.length; i++) {
          state.order_topup.push(item[i]);
        }
      } else {
        state.order_topup = [];
      }
      localStorage.setItem("order_total", state.order_topup_total);
    },
    addConsignment(state, item) {
      const check_data = state.order_consignment.find(
        (el) => el._id === item._id
      );
      if (check_data) {
        const position = state.order_consignment.findIndex(
          (el) => el._id === item._id
        );
        const new_item = {
          ...check_data,
          total: check_data.total + item.total,
          amount: check_data.amount + item.amount,
        };
        state.order_consignment.splice(position, 1, new_item);
      } else {
        state.order_consignment.push(item);
      }
    },
    delConsignment(state, item) {
      const position = state.order_consignment.findIndex(
        (el) => el._id === item
      );
      state.order_consignment.splice(position, 1);
    },
    updateConsignment(state, item) {
      const position = state.order_consignment.findIndex(
        (el) => el._id === item._id
      );
      state.order_consignment.splice(position, 1, item);
    },
    clearConsignment(state) {
      state.order_consignment = [];
    },

    // เก็บข้อมูล ลูกค้า
    setArtworkCus(state, item) {
      state.artwork_cus.name = item.cus_name;
      state.artwork_cus.tel = item.cus_tel;
      state.artwork_cus.address = item.cus_address;
      state.artwork_cus.people_id = item.people_id;
      state.artwork_cus.line_id = item.line_id;
      state.artwork_cus.tel_platform = item.tel_platform;
    },
    setWebsiteCus(state, item) {
      state.website_cus.name = item.cus_name;
      state.website_cus.tel = item.cus_tel;
      state.website_cus.address = item.cus_address;
      state.website_cus.people_id = item.people_id;
      state.website_cus.line_id = item.line_id;
      state.website_cus.tel_platform = item.tel_platform;
    },
    setMediaCus(state, item) {
      state.media_cus.name = item.cus_name;
      state.media_cus.tel = item.cus_tel;
      state.media_cus.address = item.cus_address;
      state.media_cus.people_id = item.people_id;
      state.media_cus.line_id = item.line_id;
      state.media_cus.tel_platform = item.tel_platform;
    },
    setActCus(state, item) {
      state.act_cus.name = item.cus_name;
      state.act_cus.tel = item.cus_tel;
      state.act_cus.address = item.cus_address;
      state.act_cus.people_id = item.people_id;
      state.act_cus.line_id = item.line_id;
      state.act_cus.tel_platform = item.tel_platform;
    },
    setTaxCus(state, item) {
      state.tax_cus.name = item.cus_name;
      state.tax_cus.tel = item.cus_tel;
      state.tax_cus.address = item.cus_address;
      state.tax_cus.people_id = item.people_id;
      state.tax_cus.line_id = item.line_id;
      state.tax_cus.tel_platform = item.tel_platform;
    },
    setInsuranceCus(state, item) {
      state.insurance_cus.name = item.cus_name;
      state.insurance_cus.tel = item.cus_tel;
      state.insurance_cus.address = item.cus_address;
      state.insurance_cus.people_id = item.people_id;
      state.insurance_cus.line_id = item.line_id;
      state.insurance_cus.tel_platform = item.tel_platform;
    },
    setAccountingCus(state, item) {
      state.accounting_cus.name = item.cus_name;
      state.accounting_cus.tel = item.cus_tel;
      state.accounting_cus.address = item.cus_address;
      state.accounting_cus.people_id = item.people_id;
      state.accounting_cus.line_id = item.line_id;
      state.accounting_cus.tel_platform = item.tel_platform;
    },
    setitsupportCus(state, item) {
      state.itsupport_cus.name = item.cus_name;
      state.itsupport_cus.tel = item.cus_tel;
      state.itsupport_cus.address = item.cart_address;
      state.itsupport_cus.people_id = item.people_id;
      state.itsupport_cus.line_id = item.line_id;
      state.itsupport_cus.tel_platform = item.tel_platform;
    },
    // setArtworkList(state,item){
    //   state.artwork_list = item;
    //   state.item_artwork = item;
    // },
    
    updateItemArt(state, item) {
      state.item_artwork = item;
    },
    // ออกแบบสื่อสิ่งพิมพ์
    pushOrderArt(state, item) {
      state.order_artwork.push({ ...item, code: 'artwork' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    pushOrderDetail(state, item) {
      state.order_artwork_detail.push({ ...item, code: 'artwork' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    // เขียนโปรแกรมและออกแบบเว็บไซต์
    pushWebsiteOrder(state, item) {
      state.order_website.push({ ...item, code: 'website' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    pushWebsiteDetail(state, item) {
      state.order_website_detail.push({ ...item, code: 'website' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    // สื่อโฆษณาออนไลน์
    pushMediaOrder(state, item) {
      state.order_media.push({ ...item, code: 'media_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    pushMediaDetail(state, item) {
      state.order_media_detail.push({ ...item, code: 'media_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    // พ.ร.บ.
    pushActOrder(state, item) {
      state.order_act.push({ ...item, code: 'act_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    pushActDetail(state, item) {
      state.order_act_detail.push({ ...item, code: 'act_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    // ภาษี
    pushTaxOrder(state, item) {
      state.order_tax.push({ ...item, code: 'tax_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    pushTaxDetail(state, item) {
      state.order_tax_detail.push({ ...item, code: 'tax_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    // ประกัน
    pushInsuranceOrder(state, item) {
      state.order_insurance.push({ ...item, code: 'insurance_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    pushInsuranceDetail(state, item) {
      state.order_insurance_detail.push({ ...item, code: 'insurace_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    pushInsutanceimg(state, item) {
      state.insurance_img.push({ ...item });
    },
    // บริการด้านบัญชี
    pushAccountingOrder(state, item) {
      state.order_accounting.push({ ...item, code: 'accounting_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    pushAccountingDetail(state, item) {
      state.order_accounting_detail.push({ ...item, code: 'accounting_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    // บริการ IT-Support
    pushitsupportOrder(state, item) {
      state.order_itsupport.push({ ...item, code: 'itsupport_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    pushitsupportDetail(state, item) {
      state.order_itsupport_detail.push({ ...item, code: 'itsupport_service' });
      state.item_artwork = state.artwork_list.filter((el) => el.type === item.type);
    },
    delArtwork(state, position) {
      state.order_artwork.splice(position, 1);
      state.order_artwork_detail.splice(position, 1);
    },
    delWebsite(state, position) {
      state.order_website.splice(position, 1);
      state.order_website_detail.splice(position, 1);
    },
    delMediaService(state, position) {
      state.order_media.splice(position, 1);
      state.order_media_detail.splice(position, 1);
    },
    delActService(state, position) {
      state.order_act.splice(position, 1);
      state.order_act_detail.splice(position, 1);
    },
    delTaxService(state, position) {
      state.order_tax.splice(position, 1);
      state.order_tax_detail.splice(position, 1);
    },
    delInsuranceService(state, position) {
      state.order_insurance.splice(position, 1);
      state.order_insurance_detail.splice(position, 1);
    },
    delAccountingService(state, position) {
      state.order_accounting.splice(position, 1);
      state.order_accounting_detail.splice(position, 1);
    },
    delitsupportService(state, position) {
      state.order_itsupport.splice(position, 1);
      state.order_itsupport_detail.splice(position, 1);
    },
    checkOrderArtwork(state) {
      const data_artwork = state.order_artwork_detail.filter((el) => el.code === 'artwork');
      if (data_artwork.length === 0) {
        state.order_artwork_detail = []
        state.item_artwork = state.artwork_list
      }
    },
    checkOrderWebsite(state) {
      const data_website = state.order_website_detail.filter((el) => el.code === 'website');
      if (data_website.length === 0) {
        state.order_website_detail = []
        state.item_artwork = state.artwork_list
      }
    },
    checkOrderMedia(state) {
      const data_media = state.order_media.filter((el) => el.code === 'media_service');
      if (data_media.length === 0) {
        state.order_media = []
        state.item_artwork = state.artwork_list
      }
    },
    checkOrderAct(state) {
      const data_act = state.order_act_detail.filter((el) => el.code === 'act_service');
      if (data_act.length === 0) {
        state.order_act_detail = []
        state.item_artwork = state.artwork_list
      }
    },
    checkOrderTax(state) {
      const data_tax = state.order_tax_detail.filter((el) => el.code === 'tax_service');
      if (data_tax.length === 0) {
        state.order_tax_detail = []
        state.item_artwork = state.artwork_list
      }
    },
    checkOrderInsurance(state) {
      const data_insutance = state.order_insurance_detail.filter((el) => el.code === 'insurance_service');
      if (data_insutance.length === 0) {
        state.order_insurance_detail = []
        state.item_artwork = state.artwork_list
      }
    },
    checkOrderAccounting(state) {
      const data_accounting = state.order_accounting_detail.filter((el) => el.code === 'accounting_service');
      if (data_accounting.length === 0) {
        state.order_accounting_detail = []
        state.item_artwork = state.artwork_list
      }
    },
    checkOrderitsupport(state) {
      const data_itsupport = state.order_itsupport_detail.filter((el) => el.code === 'itsupport_service');
      if (data_itsupport.length === 0) {
        state.order_itsupport_detail = []
        state.item_artwork = state.artwork_list
      }
    },
    updateShippingArt(state) {
      const count = state.order_artwork_detail.length;
      const position = state.order_artwork_detail.findIndex((e) => e.code === 'shipping');
      let name = '';
      let shipping = null;
      let square_metter = 0;
      let total = null;
      let total_fireght = null;
      if (count < 2) {
        const type = state.order_artwork_detail[0].type;
        const shipping_unit = state.order_artwork_detail[0].freight;
        const amount = state.order_artwork_detail[0].amount;
        const data_artwork = state.order_artwork_detail.filter((el) => el.type === type);
        if (type === 'ราคาต่อตารางเมตร') {
          square_metter = data_artwork.reduce((sum, product) => (sum + product.square_metter) * product.amount, 0);
          if (square_metter >= 2) {
            for (let i = 2; square_metter >= i; i++) {
              total_fireght = shipping_unit + ((square_metter - 1) * 10);
            }
          } else {
            total_fireght = shipping_unit;
          }
        }
        if (type === 'ราคาต่อชิ้น') {
          if (amount >= 5) {
            let value = amount / 5;
            let result_value = Math.trunc(value);
            total_fireght = shipping_unit + ((result_value - 1) * 50);
          }
          else {
            total_fireght = shipping_unit;
          }
        }
        if (type === 'ราคาต่อชุด') {
          if (amount >= 5) {
            let value = amount / 5;
            let result_value = Math.trunc(value);
            total_fireght = shipping_unit + ((result_value - 1) * 10);
          }
          else {
            total_fireght = shipping_unit;
          }
        }
      }
      if (count >= 2) {
        for (let i = 0; count > i; i++) {
          const amount = state.order_artwork_detail[i].amount;
          const type = state.order_artwork_detail[i].type;
          const shipping_unit = state.order_artwork_detail[i].freight;
          const data_artwork = state.order_artwork_detail.filter((el) => el.type === type);
          if (type === 'ราคาต่อตารางเมตร') {
            square_metter = data_artwork.reduce((sum, product) => (sum + product.square_metter) * product.amount, 0);
            if (square_metter >= 2) {
              for (let i = 2; square_metter >= i; i++) {
                total = shipping_unit + ((square_metter - 1) * 10);
              }
            }else{
              total = shipping_unit;
            }
          }
          if (type === 'ราคาต่อชิ้น') {
            if (amount >= 5) {
              let value = amount / 5;
              let result_value = Math.trunc(value);
              total = shipping_unit + ((result_value - 1) * 50);
            }
            else {
              total = shipping_unit;
            }
          }
          if (type === 'ราคาต่อชุด') {
            if (amount >= 5) {
              let value = amount / 5;
              let result_value = Math.trunc(value);
              total = shipping_unit + ((result_value - 1) * 10);
            }
            else {
              total = shipping_unit;
            }
          }
          name = state.order_artwork_detail[i].code;
          if (name !== 'shipping') {
            total_fireght = total_fireght + total;
          }
        }
      }
      shipping = {
        code: 'shipping',
        name: 'ค่าบริการจัดส่ง',
        amount: 1,
        total: total_fireght,
      }

      if (position !== -1) {
        state.order_artwork_detail.splice(position, 1);
        state.order_artwork_detail.push(shipping);
      } else {
        state.order_artwork_detail.push(shipping);
      }

    },
    updateShippingAct(state) {
      const count = state.order_act_detail.length;
      const position = state.order_act_detail.findIndex((e) => e.code === 'shipping');
      let shipping = null;
      let total_service = 0;
      if (count < 2) {
        const category = state.order_act_detail[0].category_name

        if (category === 'พ.ร.บ. จักยานยนต์ (ภาคบังคับ)') {
          total_service = total_service + 50;
        }
      }
  
      shipping = {
        code: 'shipping',
        name: 'ค่าบริการ',
        amount: 1,
        total: total_service,
      }

      if (position !== -1) {
        state.order_act_detail.splice(position, 1);
        state.order_act_detail.push(shipping);
      } else {
        state.order_act_detail.push(shipping);
      }
    },
    updateDetailArt(state, item) {
      const artwork = state.order_artwork_detail[item.position];
      const new_data = {
        ...artwork,
        detail: item.detail,
        amount: item.amount,
        total: artwork.price * item.amount
      }
      state.order_artwork_detail.splice(item.position, 1, new_data);
    },
    updateTotalArtwork(state) {
      const total = state.order_artwork_detail.reduce((sum, el) => sum + el.total, 0);
      localStorage.setItem('order_total', total);
      if (localStorage.getItem('order_total') === '0') {
        localStorage.setItem('order_change', -1);
      }
    },
    updateTotalWebsite(state) {
      const total = state.order_website_detail.reduce((sum, el) => sum + el.total, 0);
      localStorage.setItem('order_total', total);
      if (localStorage.getItem('order_total') === '0') {
        localStorage.setItem('order_change', -1);
      }
    },
    updateTotalMedia(state) {
      const total = state.order_media_detail.reduce((sum, el) => sum + el.total, 0);
      localStorage.setItem('order_total', total);
      if (localStorage.getItem('order_total') === '0') {
        localStorage.setItem('order_change', -1);
      }
    },
    updateTotalAct(state) {
      const total = state.order_act_detail.reduce((sum, el) => sum + el.total, 0);
      localStorage.setItem('order_total', total);
      if (localStorage.getItem('order_total') === '0') {
        localStorage.setItem('order_change', -1);
      }
    },
    updateTotalTax(state) {
      const total = state.order_tax_detail.reduce((sum, el) => sum + el.total, 0);
      localStorage.setItem('order_total', total);
      if (localStorage.getItem('order_total') === '0') {
        localStorage.setItem('order_change', -1);
      }
    },
    updateTotalInsurance(state) {
      const total = state.order_insurance_detail.reduce((sum, el) => sum + el.total, 0);
      localStorage.setItem('order_total', total);
      if (localStorage.getItem('order_total') === '0') {
        localStorage.setItem('order_change', -1);
      }
    },
    updateTotalAccounting(state) {
      const total = state.order_accounting_detail.reduce((sum, el) => sum + el.total, 0);
      localStorage.setItem('order_total', total);
      if (localStorage.getItem('order_total') === '0') {
        localStorage.setItem('order_change', -1);
      }
    },
    updateTotalitsupport(state) {
      const total = state.order_itsupport_detail.reduce((sum, el) => sum + el.total, 0);
      localStorage.setItem('order_total', total);
      if (localStorage.getItem('order_total') === '0') {
        localStorage.setItem('order_change', -1);
      }
    },
  },
  actions: {
    updateArtwork(context, value) {
      context.commit('updateDetailArt', value);
      context.commit('updateShippingArt');
    },
    delArtwork(context, value) {
      context.commit('delArtwork', value);
      context.commit('updateShippingArt');
      context.commit('checkOrderArtwork');
      context.commit('updateTotalArtwork');
    },
    delWebsite(context, value) {
      context.commit('delWebsite', value);
      context.commit('checkOrderWebsite');
      context.commit('updateTotalWebsite');
    },
    delMediaService(context, value) {
      context.commit('delMediaService', value);
      context.commit('checkOrderMedia');
      context.commit('updateTotalMedia');
    },
    delActService(context, value) {
      context.commit('delActService', value);
      context.commit('checkOrderAct');
      context.commit('updateTotalAct');
    },
    delTaxService(context, value) {
      context.commit('delTaxService', value);
      context.commit('checkOrderTax');
      context.commit('updateTotalTax');
    },
    delInsuranceService(context, value) {
      context.commit('delInsuranceService', value);
      context.commit('checkOrderInsurance');
      context.commit('updateTotalInsurance');
    },
    delAccountingService(context, value) {
      context.commit('delAccountingService', value);
      context.commit('checkOrderAccounting');
      context.commit('updateTotalAccounting');
    },
    delitsupportService(context, value) {
      context.commit('delitsupportService', value);
      context.commit('checkOrderitsupport');
      context.commit('updateTotalitsupport');
    },
    // สื่อสิ่งพิมพ์
    addOrderArt(context, value) {
      context.commit('pushOrderArt', value);
    },
    addOrderDetail(context, value) {
      context.commit('pushOrderDetail', value);
      context.commit('updateShippingArt');
      context.commit('updateTotalArtwork');
      context.commit('orderList')
    },
    // เขียนโปรแกรมและออกแบบเว็บไซต์
    addWebsiteOrder(context, value) {
      context.commit('pushWebsiteOrder', value);
    },
    addWebsiteDetail(context, value) {
      context.commit('pushWebsiteDetail', value);
      context.commit('updateTotalWebsite');
    },
    // สื่อโฆษณาออนไลน์ 
    addMediaOrder(context, value) {
      context.commit('pushMediaOrder', value);
    },
    addMediaDetail(context, value) {
      context.commit('pushMediaDetail', value);
      context.commit('updateTotalMedia');
    },
    // พ.ร.บ
    addActOrder(context, value) {
      context.commit('pushActOrder', value);
    },
    addActDetail(context, value) {
      context.commit('pushActDetail', value);
      context.commit('updateShippingAct');
      context.commit('updateTotalAct');
    },
    // ภาษี
    addTaxOrder(context, value) {
      context.commit('pushTaxOrder', value);
    },
    addTaxDetail(context, value) {
      context.commit('pushTaxDetail', value);
      context.commit('updateTotalTax');
    },
    // ประกัน
    addInsuranceOrder(context, value) {
      context.commit('pushInsuranceOrder', value);
    },
    addInsuranceDetail(context, value) {
      context.commit('pushInsuranceDetail', value);
      context.commit('updateTotalInsurance');
    },
    addInsuranceimg(context, value) {
      context.commit('pushInsutanceimg', value);
    },
    // บริการด้านบัญชี
    addAccountingOrder(context, value) {
      context.commit('pushAccountingOrder', value);
    },
    addAccountingDetail(context, value) {
      context.commit('pushAccountingDetail', value);
      context.commit('updateTotalAccounting');
    },
    // บริการ IT-Support
    additsupportOrder(context, value) {
      context.commit('pushitsupportOrder', value);
    },
    additsupportDetail(context, value) {
      context.commit('pushitsupportDetail', value);
      context.commit('updateTotalitsupport');
    },
    addOrderExpress(context, value) {
      context.commit("pushOrderExpress", value);
    },
    delOrderExpress(context, value) {
      context.commit("removeOrderExpress", value);
    },
    setDefaultExpress(context) {
      context.commit("setDefaultOrderExpress");
      context.commit("checkItemCourier");
    },
    updateWalletPartner(context, value) {
      context.commit("setWalletPartner", value);
    },
    setItemOrder(context, value) {
      context.commit("setItemOrder", value);
    },
  },
  modules: {},
});
