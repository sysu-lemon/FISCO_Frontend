<template>
  <div class="Login">
    <el-container>
      <el-header>
        <h1>FISCO金融区块链平台</h1>
      </el-header>
    </el-container>
    <el-container class="vertial-center">
      <el-form
        :model="form"
        :rules="rules"
        label-width="80px"
        class="login-form"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            auto-complete="off"
            clearable
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item label="私钥" prop="password">
          <el-input
            v-model="form.password"
            auto-complete="off"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-button type="primary" @click="signIn" style="width:200px">登录</el-button>
        </el-form-item>
      </el-form>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入私钥", trigger: "blur" }]
      }
    };
  },
  methods: {
    signIn() {
      this.loading = true;
      this.$axios({
        url: "/api/v1/login",
        method: "post",
        data: {
          username: this.form.username,
          password: this.form.password
        }
      })
        .then(res => {
          console.log(res.data.data);
          var data = {
            auth: res.data.data.auth,
            useraddr: res.data.data.useraddr,
            username: res.data.data.username,
            usergroup: res.data.data.usergroup
          };
          this.$store.dispatch("signIn", data);
          this.$router.push("/");
          this.$message({ message: "登录成功", type: "success" });
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("用户名或私钥错误");
          this.loading = false;
        });
    }
  }
};
</script>

<style>
.Login {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #f4f4f5;
}

h1 {
  margin: auto;
}

.vertial-center {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.login-form {
  margin: auto;
  width: 500px;
  text-align: center;
  background-color: white;
  box-shadow: 0px 0px 5px black;
  padding: 30px;
}
</style>