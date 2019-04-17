<template>
  <div class="login-form">
    <el-form label-width="80px" :rules="rules" ref="ruleForm" :model="login">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="login.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="login.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="success" @click="handleGitLogin()" style="float: right">github登录</el-button>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        login:{
          username: null,
          password: null
        },
        rules:{
          username:[
            {required:true,message:"请输入用户名",trigger:'blur'}
          ],
          password:[
            {required:true,message:'请输入密码',trigger:'blur'}
          ]
        },
        github:{
          oauthUri: 'https://github.com/login/oauth/authorize',
          clientId: '7cf1324f440fe33bb738',
          redirectUri:'http://localhost:8000/login'
        }
      }
    },
    methods:{
      submitForm(formName){
        const self=this;
        this.$refs[formName].validate((valid)=>{
          if(valid){
            this.$http.post('/user/login',this.$qs.stringify(this.login))
              .then(function(response){
                if(response.data.flag){
                  alert("登录成功");
                  self.$router.push({path:'/film'});
                }else{
                  alert("登录失败"+response.data.message);
                }
              })
          }else{
            alert("not accessed");
          }
        })
      },
      resetForm(formName){
        this.$refs[formName].resetFields();
      },
      handleGitLogin(){
        window.location.href=`${this.github.oauthUri}?client_id=${this.github.clientId}&redirect_uri=${this.github.redirectUri}`;
      }
    }
  }
</script>
<style scoped="scoped">
  .login-form{
    width: 50%;
    margin: 0 auto;
    padding-top: 200px;
  }
</style>
