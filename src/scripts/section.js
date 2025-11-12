import axios from 'axios'
import { debounce } from "throttle-debounce"




function changeSection() {
    
   return{
      change_section: "signup",
      email: "",
      nickname: "",
      password: "",
      isLogin: false,
      taskName: "",
      tasks: [],

      init(){
           const token = localStorage.getItem("todoToken")
              if (token) {
                this.isLogin = true
                this.getTasks()
              } 
              if (this.isLogin) {
                this.gotoTask()
              } else {
                this.gotoSignUp()
              }
      },
      

    //    isLogin(){cd
    //         const token = localStorage.getItem("todoToken")
    //         return token != ""
    //    },
       async getTasks(){
           const token = localStorage.getItem("todoToken")
           const config ={
            headers :{
                Authorization : token,
            }
           }
           try { 
            const resp = await axios.get("https://todoo.5xcamp.us/todos", config)
            this.tasks = resp.data.todos
        } catch (err){
            console.error(err)
            alert(err.response?.data?.message || "取得任務列表失敗")
        };
            
        },

        
            

       async doLogin(){
           const { email, password } = this
              if(email != "" && password != "") {
                    const userData = {
                        user: {
                        email,
                        password,
                        },
                    }
                    console.log(userData);
                try { 
                    const resp =  await axios.post("https://todoo.5xcamp.us/users/sign_in", userData)
                    const token = resp.headers.authorization

                    if (token) {
                        localStorage.setItem("todoToken", token)
                        this.isLogin = true 
                         }
                         this.resetForm ()
                         this.gotoTask ()
                    } catch (err) {
                    alert(err.response.data.message)
                    }
            }
       },

       async doSignUp(){
           const { email, nickname, password } = this

           if(email != "" && nickname != "" && password != "") {
               const userData = {
                   user: {
                    email,
                    nickname,
                    password,
                    },
                }

              try {
                 await axios.post("https://todoo.5xcamp.us/users", userData)
                 this.resetForm ()
                 this.gotoLogin()
                } catch (err) {
                     alert(err.response.data.message)
                  }
            }
       },


        resetForm() {
           this.email = ""
           this.password = ""
           this.nickname = ""
           },

          toggleDebounce : debounce(1000, function(id, count) {
            const token = localStorage.getItem("todoToken")
                  const config = {
                    headers: {
                        Authorization: token,
                  }
                }
                if (count % 2 != 0){
                    console.log("GO!")
                }
            axios.patch(`https://todoo.5xcamp.us/todos/${id}/toggle`, null, config )
          }
              
          ),

           async toggleTask(id){
            // 假戲
               const todo = this.tasks.find((t) => t.id == id);
               if (todo.completed_at) {
               // 已完成
                 todo.completed_at = null;
               } else {
               // 未完成
                 todo.completed_at = new Date();
               }

            //    this.toggleDebounce(id)
            if (todo.count == undefined){
                todo.count = 0
            }

            todo.count = todo.count + 1

            // 真做
            this.toggleDebounce(id, todo.count)


           },



// 輸入框的任務
        async addTask() {
              if (this.taskName != "") {
                // API
                  const todoData = {
                    todo : {
                        content : this.taskName.trim(),
                    },
                  }
                  const token = localStorage.getItem("todoToken")
                  const config = {
                    headers: {
                        Authorization: token,
                  }
            }
            
            // 假戲,為了在前端先顯示結果（體驗比較好）
            const dummyTask = {
                id: crypto.randomUUID(),
                content: this.taskName.trim(),
                completed_at: null,
            }

            this.tasks.unshift (dummyTask)

            //   做送出後清除（搭配.trim）
                this.taskName = ""

            try {
                // 真正呼叫 API
                const resp = await axios.post("https://todoo.5xcamp.us/todos", todoData, config)
                const newTask = resp.data

                // 用伺服器回傳的真資料取代 dummy task
                const idx = this.tasks.findIndex((t) => {
                    return t.id === dummyTask.id
                })
                    this.tasks.splice(idx, 1, newTask)
                } catch (err) {
                console.error(err)
                // 新增失敗時移除 dummy
                    alert(err.response?.data?.message || '新增失敗')
                }

            
            }
        },






        deleteTask(id){
            try{
                const token = localStorage.getItem("todoToken")
                const config = {
                      headers: {
                         Authorization: token
                      }
                    }
            const taskIndex = this.tasks.findIndex((t) => {
                return t.id === id
            })
            if (taskIndex >= 0) {
                this.tasks.splice(taskIndex, 1)
               }
            axios.delete(`https://todoo.5xcamp.us/todos/${id}`, config)
            } catch (err){
            console.error(err)
            alert(err.response?.data?.message || "刪除失敗")
            this.getTasks()
           }
        },

        gotoLogin() {
             this.change_section = "login"
             },
        gotoSignUp() {
             this.change_section = "signup"
             },
        gotoTask() {
             this.change_section = "task"
             },

        showLogin(){
             return this.change_section == "login"
             },
        showSignUp(){
             return this.change_section == "signup"
             },
        showTask(){
             return this.change_section == "task"
            },
            
        async LogOut(){
        const token = localStorage.getItem("todoToken")

            if(token){
            const config = {
                headers: {
                    Authorization: token,
                   },
                }
            try{
                const resp = await axios.delete("https://todoo.5xcamp.us/users/sign_out", config)
                localStorage.removeItem("todoToken")
                this.isLogin = false
                this.gotoLogin()
                } catch (err) {
                    console.log(err);
                    }
            }
        }
    }
}
export { changeSection }