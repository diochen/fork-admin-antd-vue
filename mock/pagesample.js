const mockjs= require('mockjs');
const { VITE_APP_APIHOST } = process.env;
const mock = {};


mock[`GET ${VITE_APP_APIHOST || ''}/pages/detail`] = (req, res) => {
  res.send({
    code: 0,
    data: mockjs.mock({
      userInfo: {
        name: '小李',
        tel: '13770779817',
        courier: '宇宙快遞',
        address: '宇宙地球',
        remark: '無',
      },
      refundApplication: {
        ladingNo: '1000000000',
        saleNo: '1234123421',
        state: '已取貨',
        childOrders: '3214321432',
      },
      'returnGoods|5': [
        {
          id: '@integer(1,99999)',
          name: '@ctitle(5,10)',
          barcode: '@integer(100000000000000,999999999999999)',
          price: '@float(1,15,0,2)',
          num: '@integer(1,5)',
          amount: function() {
            return Number(this.price) * Number(this.num);
          },
        },
      ],
      'returnProgress|5': [
        {
          key: '@integer(1,99999)',
          time: '@datetime',
          rate: '@csentence(3, 5)',
          statuskey: '@boolean',
          status: function() {
            return this.statuskey ? 'success' : 'processing';
          },
          operator: '取貨員 ID @integer(1000,9999)',
          cost: '@integer(1,5) h',
        },
      ],
    }),
  });
};

mock[`POST ${VITE_APP_APIHOST || ''}/pages/form`] = (req, res) => {
  res.send({
    code: 0,
    data: '',
    msg: '',
  });
};

mock[`GET ${VITE_APP_APIHOST || ''}/pages/list`] = (req, res) => {
  res.send({
    code: 0,
    data: mockjs.mock({
      total: 1000,
      currentPage: 1,
      'list|10': [
        {
          id: '@integer(1)',
          'name|1': ['個人部落格', '網頁小功能'],
          'desc|1': ['李慶鬆的個人部落格', '原創定製最好的網頁插件小功能'],
          'href|1': ['http://liqingsong.cc', 'http://wyxgn.com'],
          'type|1': ['header', 'footer'],
        },
      ],
    }),
  });
};

mock[`POST ${VITE_APP_APIHOST || ''}/pages/list`] = (req, res) => {
  res.send({
    code: 0,
    data: '',
  });
};

mock[`PUT ${VITE_APP_APIHOST || ''}/pages/list/*`] = (req, res) => {
  res.send({
    code: 0,
    data: '',
  });
};

mock[`DELETE ${VITE_APP_APIHOST || ''}/pages/list/*`] = ( req, res) => {
  res.send({
    code: 0,
    data: '',
  });
};

mock[`GET ${VITE_APP_APIHOST || ''}/pages/list/*`] = (req, res) => {
  res.send({
    code: 0,
    data: mockjs.mock({
      id: '@integer(1)',
      'name|1': ['個人部落格', '網頁小功能'],
      'desc|1': ['李慶鬆的個人部落格', '原創定製最好的網頁插件小功能'],
      'href|1': ['http://liqingsong.cc', 'http://wyxgn.com'],
      'type|1': ['header', 'footer'],
    }),
  });
};

module.exports = {
  ...mock
};