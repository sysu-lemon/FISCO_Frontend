<template>
  <div class="Home">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="12" :offset="6">
            <h1 class="navTitle">FISCO金融区块链平台</h1>
          </el-col>
          <el-col :span="1" :offset="5">
            <div class="avatar">
              <el-popover ref="popover" placement="bottom" trigger="hover">
                <h3>{{ this.$store.state.username }}</h3>
                <el-button type="danger" @click="exit">exit</el-button>
              </el-popover>
              <img src="../assets/logo.png" v-popover:popover />
            </div>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <el-tabs tab-position="left">
          <el-tab-pane label="用户管理">
            <el-row>
              <el-col :span="16" :offset="4">
                <Users />
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="凭证管理">
            <el-row>
              <el-col :span="16" :offset="4">
                <el-tabs tab-position="top">
                  <el-tab-pane label="借方凭证">
                    <ReceiptOuts />
                  </el-tab-pane>
                  <el-tab-pane label="贷方凭证">
                    <ReceiptIns />
                  </el-tab-pane>
                </el-tabs>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Users from "./tables/Users.vue";
import ReceiptIns from "./tables/ReceiptsIns.vue";
import ReceiptOuts from "./tables/ReceiptOuts.vue";

export default {
  name: "home",
  components: {
    Users,
    ReceiptIns,
    ReceiptOuts
  },
  methods: {
    exit() {
      this.$store.dispatch("signOut");
      this.$router.replace("/login");
    }
  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 60%;
}

h2 {
  text-align: center;
  margin-top: 14px;
  margin-bottom: 20px;
}

.el-header {
  text-align: center;
  line-height: 60px;
  height: 60px;
  box-shadow: 0px 1px 10px black;
}

.navTitle {
  font-size: 24px;
  font-weight: bold;
}

.avatar {
  width: 36px;
  height: 36px;
  margin: 12px;
  border-radius: 50%;
}

img {
  width: 100%;
  height: 100%;
}
</style>
