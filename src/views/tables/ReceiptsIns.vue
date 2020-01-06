<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="16">
        <el-input
          placeholder="请输入借方名称搜索"
          suffix-icon="el-icon-search"
          v-model="search"
          auto-complete="off"
        ></el-input>
      </el-col>
    </el-row>
    <el-table
      :data="searchData"
      :default-sort="{prop: 'id', order: 'ascending'}"
      v-loading="loading"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="借方地址">
              <span>{{ props.row.fromAddr }}</span>
              <i class="el-icon-document-copy" @click="copyText(props.row.fromAddr)"></i>
            </el-form-item>
            <el-form-item label="贷方地址">
              <span>{{ props.row.toAddr }}</span>
              <i class="el-icon-document-copy" @click="copyText(props.row.toAddr)"></i>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="凭证号" sortable width="100" />
      <el-table-column prop="fromName" label="借方名称" width="100" />
      <el-table-column label="资金流向" align="center" width="100">
        <i class="el-icon-arrow-right"></i>
      </el-table-column>
      <el-table-column prop="toName" label="贷方名称" width="150" />
      <el-table-column prop="amount" label="金额大小(万元)" width="150" />
      <el-table-column>
        <template slot="header">
          <span style="margin-right:10px;">用户操作</span>
          <el-button type="success" icon="el-icon-refresh-left" circle @click="refresh"></el-button>
        </template>
        <template slot-scope="scope">
          <el-popconfirm
            title="不能后悔哦"
            @onConfirm="payReceipt(scope.$index, scope.row)"
            confirmButtonType="danger"
          >
            <el-button icon="el-icon-check" circle slot="reference" v-if="!scope.row.check"></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      search: "",
      receiptIns: []
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
    payReceipt(index, receipt) {
      this.loading = true;
      this.$axios({
        method: "post",
        url: "/api/v1/receipts",
        data: {
          fromAddr: receipt.fromAddr,
          toAddr: this.$store.state.auth,
          id: receipt.id,
          action: "pay"
        }
      })
        .then(res => {
          this.loading = false;
          this.$message({ message: "提交成功", type: "success" });
          this.refresh();
        })
        .catch(err => {
          this.loading = false;
          this.$message.error("提交失败");
        });
    },
    refresh() {
      this.loading = true;
      this.$axios({
        method: "get",
        url: "/api/v1/receiptIns",
        params: {
          useraddr: this.$store.state.useraddr
        }
      })
        .then(res => {
          console.log(res);
          this.loading = false;
          this.receiptIns = [];
          res.data.data.forEach((item, index, array) => {
            this.receiptIns.push({
              id: item.id,
              fromName: item.fromName,
              fromAddr: item.fromAddr,
              toName: item.toName,
              toAddr: item.toAddr,
              amount: item.amount,
              check: item.check
            });
          });
          this.$message({ message: "刷新成功", type: "success" });
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.$message.error("刷新失败");
        });
    }
  },
  computed: {
    searchData: function() {
      var search = this.search;
      if (search) {
        return this.receiptIns.filter(receipt => {
          if (receipt.toName.includes(search)) {
            return receipt;
          }
        });
      }
      return this.receiptIns;
    }
  },
  mounted: function() {
    this.refresh();
  }
};
</script>

<style>
</style>