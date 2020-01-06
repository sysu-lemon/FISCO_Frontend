<template>
  <div id="ReceiptOuts">
    <el-row>
      <el-col :span="8" :offset="16">
        <el-input
          placeholder="请输入贷方名称搜索"
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
          <span style="margin-right:10px;">状态</span>
          <el-button type="primary" icon="el-icon-plus" circle @click="showReceiptChoice = true"></el-button>
          <el-button type="success" icon="el-icon-refresh-left" circle @click="refresh"></el-button>
        </template>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.check" type="success">Check</el-tag>
          <el-tag v-if="!scope.row.check&&scope.row.used" type="info">Used</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="单据类型选择" :visible.sync="showReceiptChoice" :lock-scroll="false">
      <el-button type="primary" @click="showReceiptChoice=false, showReceiptByGen=true">个人贷款</el-button>
      <el-button type="primary" @click="showReceiptChoice=false, showReceiptBySplit=true">以贷换贷</el-button>
      <el-button type="primary" @click="showReceiptChoice=false, showReceiptByReq=true">以贷申贷</el-button>
    </el-dialog>

    <el-dialog
      title="添加单据"
      :visible.sync="showAddReceipt"
      :lock-scroll="false"
      :before-close="notShowAddReceipt"
      destroy-on-close
    >
      <el-form :model="form" :rules="rules">
        <el-form-item label="贷方地址" prop="toAddr">
          <el-input v-model="form.toAddr" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="金额大小(万元)" prop="amount">
          <el-input v-model.number="form.amount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="旧单据号" prop="id">
          <el-input v-model="form.id" auto-complete="off" :disabled="showReceiptByGen"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="notShowAddReceipt">取 消</el-button>
        <el-button type="primary" @click="addReceipt">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showReceiptChoice: false,
      showReceiptByGen: false,
      showReceiptBySplit: false,
      showReceiptByReq: false,
      search: "",
      loading: false,
      formLabelWidth: "120px",
      receiptOuts: [],
      form: {
        toAddr: "",
        amount: "",
        id: ""
      },
      rules: {
        toAddr: [
          { required: true, message: "请输入贷方地址", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "请输入金额大小(万元)", trigger: "blur" },
          { type: "number", message: "金额必须为数字" }
        ],
        id: [{ required: true, message: "请输入原单据号", trigger: "blur" }]
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
    addReceipt() {
      this.loading = true;
      this.$axios({
        method: "post",
        url: "/api/v1/receipts",
        data: {
          fromAddr: this.$store.state.auth,
          toAddr: this.form.toAddr,
          amount: this.form.amount,
          id: this.form.id,
          action: this.formAction
        }
      })
        .then(res => {
          console.log(res);
          this.loading = false;
          this.notShowAddReceipt();
          this.$message({ message: "提交成功", type: "success" });
          this.refresh();
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.notShowAddReceipt();
          this.$message.error("提交失败");
        });
    },
    refresh() {
      this.loading = true;
      this.$axios({
        method: "get",
        url: "/api/v1/receiptOuts",
        params: {
          useraddr: this.$store.state.useraddr
        }
      })
        .then(res => {
          console.log(res);
          this.loading = false;
          this.receiptOuts = [];
          res.data.data.forEach((item, index, array) => {
            this.receiptOuts.push({
              id: item.id,
              fromName: item.fromName,
              fromAddr: item.fromAddr,
              toName: item.toName,
              toAddr: item.toAddr,
              amount: item.amount,
              check: item.check,
              used: item.used
            });
          });
          this.$message({ message: "刷新成功", type: "success" });
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.$message.error("刷新失败");
        });
    },
    notShowAddReceipt() {
      this.showReceiptByGen = false;
      this.showReceiptBySplit = false;
      this.showReceiptByReq = false;
    }
  },
  computed: {
    searchData: function() {
      var search = this.search;
      if (search) {
        return this.receiptOuts.filter(receipt => {
          if (receipt.toName.includes(search)) {
            return receipt;
          }
        });
      }
      return this.receiptOuts;
    },
    showAddReceipt: function() {
      return (
        this.showReceiptByGen ||
        this.showReceiptBySplit ||
        this.showReceiptByReq
      );
    },
    formAction: function() {
      if (this.showReceiptByGen) return "gen";
      if (this.showReceiptBySplit) return "split";
      if (this.showReceiptByReq) return "req";
      return "";
    }
  },
  mounted: function() {
    this.refresh();
  }
};
</script>

<style>
</style>