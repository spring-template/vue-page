<template>
  <div class="film-container">
    <el-button type="primary" style="float:left" @click="dialogFormVisible=true;handleAdd()">增加</el-button>
    <el-table
      :data="filmlist"
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column
        label="日期"
        width="180"
        prop="date"
        sortable="custom"
        >
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ new Date(scope.row.date).toLocaleDateString() }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="电影名"
        width="180"
        prop="filmName"
        sortable="custom"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.filmName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="导演"
        width="180"
        prop="director"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.director }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="男主角"
        width="180"
        prop="actor"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.actor }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="女主角"
        width="180"
        prop="actress"
        >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.actress }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="page.search"
            size="mini"
            placeholder="输入电影名称搜索"/>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row.id, scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="block">
      <div style="margin-top: 50px"></div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!--对话框-->
    <el-dialog title="电影录入" :visible.sync="dialogFormVisible">
      <el-form :model="film" label-position="left">
        <el-form-item label="上映日期" label-width="80">
          <el-date-picker v-model="film.date" align="left" style="width: 85%"></el-date-picker>
        </el-form-item>
        <el-form-item label="电影名称" label-width="80">
          <el-input v-model="film.filmName" auto-complete="off" style="width: 85%"></el-input>
        </el-form-item>
        <el-form-item label="导 演" label-width="80">
          <el-input v-model="film.director" auto-complete="off" style="width: 85%"></el-input>
        </el-form-item>
        <el-form-item label="男主角" label-width="80">
          <el-input v-model="film.actor" auto-complete="off" style="width: 85%"></el-input>
        </el-form-item>
        <el-form-item label="女主角" label-width="80">
          <el-input v-model="film.actress" auto-complete="off" style="width: 85%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancel()">取 消</el-button>
        <el-button type="primary" @click="handleFilmSubmit()">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        filmlist:[],
        page:{
          currentPage:1,
          pageSize:5,
          order:null,
          orderColumn:null,
          search:null
        },
        total:0,
        film:{
          date:null,
          filmName:null,
          director:null,
          actor:null,
          actress:null
        },
        dialogFormVisible:false
      }
    },
    created(){
      this.loadFilmData();
    },
    methods:{
      loadFilmData(){
        this.$http.post(
          `/film/list/${this.page.currentPage}/${this.page.pageSize}`,
          this.page,
          {
            headers:{
              'token':'eyJhbGciOiJub25lIn0.eyJqdGkiOiIxMyIsInN1YiI6ImFkbWluIiwiaWF0IjoxNTU1NDA4ODE2LCJleHAiOjE1NTU3Njg4MTZ9.'
            }
          }
        )
          .then(response=>{
            this.filmlist=response.data.data.films;
            this.total=response.data.data.total;
          })
      },
      handleSizeChange(val){
        this.page.pageSize=val;
      },
      handleCurrentChange(val){
        this.page.currentPage=val;
      },
      handleSortChange(obj){
        this.page.order=obj.order;
        if(this.page.order.startsWith('desc')){
          this.page.order="desc";
        }
        if(this.page.order.startsWith("asc")){
          this.page.order="asc";
        }
        this.page.orderColumn=obj.prop;
        if(this.page.orderColumn.startsWith("filmName"))
          this.page.orderColumn="film_name";
      },
      handleEdit(id,film){
        this.dialogFormVisible=true;
        this.film=film;
        console.log(film);
      },
      handleAdd(){
        this.dialogFormVisible=true;
        this.film={};
      },
      handleDialogCancel(){
        this.dialogFormVisible=false;
        this.$message.info("已经取消");
      },
      handleFilmSubmit(){
        if(this.film.id!=undefined){
          this.$http.put(
            '/film',
            this.film,
            {
              headers: {
                'token': 'eyJhbGciOiJub25lIn0.eyJqdGkiOiIxMyIsInN1YiI6ImFkbWluIiwiaWF0IjoxNTU1NDA4ODE2LCJleHAiOjE1NTU3Njg4MTZ9.'
              }
            }
          )
            .then(response=>{
              if(response.data.flag){
                this.$message.success("修改成功");
                this.loadFilmData();
              }else{
                this.$message.error("修改失败");
              }
            })
        }else{
          this.$http.post(
            '/film',
            this.film,
            {
              headers: {
                'token': 'eyJhbGciOiJub25lIn0.eyJqdGkiOiIxMyIsInN1YiI6ImFkbWluIiwiaWF0IjoxNTU1NDA4ODE2LCJleHAiOjE1NTU3Njg4MTZ9.'
              }
            }
          )
            .then(response=>{
              if(response.data.flag){
                this.$message.success("新增成功");
                this.loadFilmData();
              }else{
                this.$message.error("新增失败");
              }
            })
        }
        this.dialogFormVisible=false;
      },
      handleDelete(id,film){
        this.$confirm("确定要删除？","删除电影")
          .then(action=>{
            if(action=='confirm'){
              this.$http.delete(
                `/film/${id}`,
                {
                  headers:{
                    'token':'eyJhbGciOiJub25lIn0.eyJqdGkiOiIxMyIsInN1YiI6ImFkbWluIiwiaWF0IjoxNTU1NDA4ODE2LCJleHAiOjE1NTU3Njg4MTZ9.'
                  }
                }
              )
                .then(response=>{
                  if(response.data.flag){
                    this.$message({message:'删除成功',type:'success'});
                    this.loadFilmData();
                  }else{
                    this.$message.error("删除失败");
                  }
                })
            }
            if(action=='cancel'){
            }
          })
          .catch(_=>{
            this.$message("已经取消删除");
          })
      }
    },
    watch:{
      page:{
        deep:true,
        handler(){
          this.loadFilmData();
        }
      }
    }
  }
</script>
<style scoped="scoped">
  .film-container{
    width: 80%;
    padding-top: 50px;
    margin: 0 auto;
  }
</style>
