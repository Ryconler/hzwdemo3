import{b as l,r,G as d,e as n,f as e,D as _,B as o,o as p,p as f,h}from"./index.18b16d2b.js";import{_ as v,a as k}from"./plugin-vue_export-helper.94e3df31.js";const t=a=>(f("data-v-8bf7d740"),a=a(),h(),a),b={class:"pay-fail"},m=t(()=>e("i",{class:"fail-icon"},null,-1)),y=t(()=>e("h1",{class:"fail-text pf-medium"},"\u8BA2\u5355\u652F\u4ED8\u5931\u8D25",-1)),I=t(()=>e("h2",{class:"fail-tip"},"\u8BF7\u53CA\u65F6\u652F\u4ED8\u54E6",-1)),F=l({__name:"PayFail",setup(a){const c=_();k({title:"\u652F\u4ED8\u5931\u8D25",share:!1});const s=r(c.query.orderId),u=()=>{location.href=`/hzwdemo3/order-detail/${s.value}?naviType=4&kwtarget=blank`,o({bizType:"127",pageLevelId:"121013558",clickId:"200001"})},i=()=>{location.href="/hzwdemo3/recharge",o({bizType:"127",pageLevelId:"121013558",clickId:"200003"})};return d({bizType:"127",pageLevelId:"121013558",pageParam:{orderid:s.value}}),(g,B)=>(p(),n("div",b,[m,y,I,e("div",{class:"buttons"},[e("button",{class:"view-button",onClick:u},"\u67E5\u770B\u8BA2\u5355"),e("button",{class:"back-button",onClick:i},"\u8FD4\u56DE")])]))}});var C=v(F,[["__scopeId","data-v-8bf7d740"]]);export{C as default};
//# sourceMappingURL=PayFail.c57a2d9f.js.map