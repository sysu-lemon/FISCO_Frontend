<template>
  <div class="Users">
    <el-row>
      <el-col :span="8" :offset="16">
        <el-input
          placeholder="请输入用户名搜索"
          suffix-icon="el-icon-search"
          v-model="search"
          auto-complete="off"
        ></el-input>
      </el-col>
    </el-row>

    <el-table
      :data="searchData"
      :default-sort="{prop: 'username', order: 'ascending'}"
      stripe
      v-loading="tableLoading"
    >
      <!-- 用户名 -->
      <el-table-column prop="username" label="用户名" sortable width="150">
        <template slot-scope="scope">
          <i class="el-icon-user" v-if="scope.row.usergroup === 'user'"></i>
          <i class="el-icon-office-building" v-if="scope.row.usergroup === 'bank'"></i>
          {{ scope.row.username }}
        </template>
      </el-table-column>

      <!-- 用户地址 -->
      <el-table-column prop="useraddr" label="用户地址" width="400">
        <template slot-scope="scope">
          <span>{{ scope.row.useraddr }}</span>
          <i class="el-icon-document-copy" @click="copyText(scope.row.useraddr)"></i>
        </template>
      </el-table-column>

      <!-- 用户组 -->
      <el-table-column
        prop="usergroup"
        label="用户组"
        :filters="[{text: 'user', value: 'user'}, {text: 'bank', value: 'bank'}, {text: 'forbid', value: 'forbid'}]"
        :filter-method="filterUsergroup"
        sortable
        width="150"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.usergroup == 'user'" type="primary">{{ scope.row.usergroup }}</el-tag>
          <el-tag v-if="scope.row.usergroup == 'bank'" type="success">{{ scope.row.usergroup }}</el-tag>
          <el-tag v-if="scope.row.usergroup == 'forbid'" type="danger">forbid</el-tag>
        </template>
      </el-table-column>

      <!-- 用户操作 -->
      <el-table-column>
        <template slot="header">
          <span style="margin-right:10px;">用户操作</span>
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            v-if="isAdmin"
            @click="showAddUser = true"
          ></el-button>
          <el-button type="success" icon="el-icon-refresh-left" circle @click="refresh"></el-button>
        </template>
        <template slot-scope="scope">
          <el-popconfirm
            title="确认删除吗"
            @onConfirm="delUser(scope.row.useraddr)"
            confirmButtonType="danger"
          >
            <el-button icon="el-icon-close" circle slot="reference" v-if="isAdmin&&scope.row.usergroup!=='forbid'"></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加用户"
      :visible.sync="showAddUser"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :lock-scroll="false"
      destroy-on-close
    >
      <el-form :model="form" :rules="rules">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户组" :label-width="formLabelWidth">
          <el-select v-model="form.usergroup" placeholder="请选择用户组">
            <el-option label="用户" value="user"></el-option>
            <el-option label="银行" value="bank"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddUser = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="用户信息" :visible.sync="showResult" :lock-scroll="false">
      <el-form :model="result">
        <el-form-item label="用户名" :label-width="formLabelWidth" readonly>
          <el-input v-model="result.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户地址" :label-width="formLabelWidth" readonly>
          <el-input v-model="result.useraddr" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户组" :label-width="formLabelWidth" readonly>
          <el-input v-model="result.usergroup" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户私钥" :label-width="formLabelWidth" readonly>
          <el-input v-model="result.auth" autocomplete="off">
            <i slot="suffix" class="el-icon-document-copy" @click="copyText(result.auth)"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <h5>注：此密钥只会出现一次，请妥善保管</h5>
        <el-button type="primary" @click="showResult = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAddUser: false,
      showResult: false,
      loading: false,
      tableLoading: false,
      formLabelWidth: "120px",
      search: "",
      form: {
        username: ""
      },
      result: {
        username: "",
        useraddr: "",
        usergroup: "",
        auth: ""
      },
      users: [],
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }]
      }
    };
  },
  methods: {
    copyText(text) {
      var oInput = document.createElement("input"); //创建一个隐藏input（重要！）
      oInput.value = text;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy");
      oInput.className = "oInput";
      oInput.style.display = "none";
      this.$message("复制成功");
    },
    filterUsergroup(value, row) {
      return row.usergroup === value;
    },
    addUser() {
      this.loading = true;
      this.$axios({
        method: "post",
        url: "/api/v1/users",
        data: {
          auth: this.$store.state.auth,
          username: this.form.username,
          usergroup: this.form.usergroup
        }
      })
        .then(res => {
          console.log(res);
          this.loading = false;
          this.showAddUser = false;
          this.result.username = res.data.data.username;
          this.result.useraddr = res.data.data.useraddr;
          this.result.usergroup = res.data.data.usergroup;
          this.result.auth = res.data.data.auth;
          this.showResult = true;
          this.refresh();
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.showAddUser = false;
        });
    },
    delUser(useraddr) {
      this.$axios({
        method: "delete",
        url: "/api/v1/users",
        data: {
          auth: this.$store.state.auth,
          useraddr: useraddr
        }
      })
        .then(res => {
          console.log(res);
          this.$message({ message: "删除成功", type: "success" });
          this.refresh();
        })
        .catch(err => {
          console.log(err);
          this.$message.error("删除失败");
        });
    },
    refresh() {
      this.tableLoading = true;
      this.$axios({
        method: "get",
        url: "/api/v1/users"
      })
        .then(res => {
          console.log(res);
          this.tableLoading = false;
          this.users = [];
          res.data.data.forEach((item, index, array) => {
            this.users.push({
              username: item.username,
              useraddr: item.useraddr,
              usergroup: item.usergroup
            });
          });
          this.$message({ message: "刷新成功", type: "success" });
        })
        .catch(err => {
          console.log(err);
          this.tableLoading = false;
          this.$message.error("刷新失败");
        });
    }
  },
  computed: {
    searchData: function() {
      var search = this.search;
      if (search) {
        return this.users.filter(user => {
          if (user.username.includes(search)) {
            return user;
          }
        });
      }
      return this.users;
    },
    isAdmin: function() {
      return this.$store.state.usergroup === "admin";
    }
  },
  mounted: function() {
    this.refresh();
  }
};
</script>

<style>
</style>