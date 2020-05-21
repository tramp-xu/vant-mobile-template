import axios from 'axios';
// import qs from 'qs'; // 用来将payload方式转成formdata
import { Notify } from 'vant';


// 配置允许跨域携带cookie
axios.defaults.withCredentials = true;

axios.defaults.ContentType = "application/x-www-form-urlencoded; charset=UTF-8"

// 配置超时时间
axios.defaults.timeout = 100000;

// request拦截器
axios.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(
  response => {
    const data = response.data;
    const code = data.code;
    const resMessage = data.message;
    if (code === 200) {
      if (resMessage) {
        Notify({ type: 'success', message: resMessage });
      }
      return Promise.resolve(data);
    } else {
      Notify({ type: 'danger', message: resMessage });
      return Promise.reject(new Error(resMessage));
    }
  },
  err => {
    let error = {};
    if (err && err.response) {
      const {status, statusText} = err.response;
      switch (status) {
      case 400:
        Notify({ type: 'danger', message: `请求错误：${status}` });
        break;
      case 401:
        Notify({ type: 'danger', message: `未授权，或登录过期：${status}` });
        // setTimeout(() => {
        //   window.location.href = env.redirect;
        // }, 200);
        break;
      case 408:
        Notify({ type: 'danger', message: `未授权，或登录过期：${status}` });
        break;
      case 500:
        Notify({ type: 'danger', message: `服务器内部错误：${status}` });
        break;
      case 502:
        Notify({ type: 'danger', message: `网关错误：${status}` });
        break;
      case 503:
        Notify({ type: 'danger', message: `服务不可用：${status}` });
        break;
      case 504:
        Notify({ type: 'danger', message: `网关超时：${status}` });
        break;
      default:
        Notify({ type: 'danger', message: `其他错误：${statusText || ''}, 错误代码：${status}` });
        break;
      }
      error = {
        code: status,
        statusText: statusText
      };
    }
    // if (err.status)
    return Promise.reject(error);
  }
);

let http = {
  post: '',
  get: '',
  urlencodedPost: ''
};
// 上传文件的 post 方法
http.urlencodedPost = (api, data) => {
  let fd = null;
  for (const [key, value] of Object.entries(data)) {
    if (!fd) {
      fd = `${key}=${value}`;
    } else {
      fd = `${fd}&${key}=${value}`;
    }
  }
  let config = {
    headers: {
      ContentType: 'application/x-www-form-urlencoded'
    }
  };
  return new Promise((resolve,reject) => {
    axios.post(api, fd, config).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
};

http.get = (api, data) => {
  let params = {...data};
  params._ = Date.now();
  return new Promise((resolve,reject) => {
    axios.get(api, {params}).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
};

http.post = (api, data) => {
  // let params = qs.stringify(data);
  return new Promise((resolve,reject) => {
    axios.post(api, data).then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err)
    });
  });
};


export default http;