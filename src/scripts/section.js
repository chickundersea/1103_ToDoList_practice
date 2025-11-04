
import axios from 'axios'

function changeSection() {
    
   return{
      change_section: "signup",
      email:" ",
      nickname:" ",
      password:" ",

       async doLogin(){
           const { email, password } = this
              if(email != "" && password != "") {
                    const userData = {
                        user: {
                        email,
                        password,
                        },
                    }

                try {   await axios.post("https://todoo.5xcamp.us/users/sign_in", userData)
                    console.log(resp);
                } catch (err) {
                    alert(err.response.data.message)
                }
                  }
       },

       async doSignUp(e){
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
              const resp = await axios.post("https://todoo.5xcamp.us/users", userData)
              this.email = ""
              this.nickname = ""
              this.password = ""
              this.gotoLogin()
            } catch (err) {
              alert(err.response.data.message)
            }
          }
       },

        gotoLogin() {
             this.change_section = "login"
             },
        gotoSignUp() {
             this.change_section = "signup"
             },

        showLogin(){
             return this.change_section == "login"
             },
        showSignUp(){
             return this.change_section == "signup"
             },
        showTask(){
             return this.change_section == "task"
            }
    }
}
export { changeSection }