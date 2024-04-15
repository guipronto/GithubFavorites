import { GithubUser } from "./GithubUser.js"

//class que vai conter a logico dos dados
//como os dados serão estruturados 
export class Favorites {
    constructor(root){
     this.root = document.querySelector(root)
     this.load()
 
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []   
    }

    save(){
        localStorage.setItem('@github-favorites:',JSON.stringify(this.entries))
    }

   async add(username){
      
    try{
        const  userExists = this.entries.find(entry => entry.login === username) 

        if(userExists) {
            throw new Error ('usuário já cadastrado')
        }
       

        const user = await GithubUser.search(username)

        if(user.login === undefined){throw new Error("usuário não encontrado")}

        this.entries = [user,...this.entries]
        this.update()
        this.save()

    }catch(error){
        alert(error.message)
    }

    }

    delete(user){
      const filteredEntreis = this.entries .filter(entry => entry.login !== user.login)

      this.entries = filteredEntreis
      this.update()
      this.save()
     
    }
 }
 
 //class que vai criar visualização e eventos do HTML
 export class FavoritesView extends Favorites{
     constructor (root){
         super(root)
        
         this.tbody = this.root.querySelector("table tbody")

         this.update()
         this.onadd()
     }

     onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick= () =>{
            const {value} = this.root.querySelector(".search input")

            this.add(value)
        }

     }

     update(){
        this.removeAllTr()

     
   this.entries.forEach( user =>{

    const row = this.createRow()

    row.querySelector(".user img").src = `https://github.com/${user.login}.png`
    row.querySelector('.user img').alt = `imagem de ${user.name}`
    row.querySelector(".user a").href = `https://github.com/${user.login}`
    row.querySelector(".user p").textContent = user.name
    row.querySelector(".user span").textContent = user.login
    row.querySelector(".repositories ").textContent = user.public_repos
    row.querySelector(".followers ").textContent = user.followers
    
    row.querySelector('.remove').onclick = ()=>{
        const isOk = confirm('tem  certeza que deseja excluir ?') 
        if(isOk){
            this.delete(user)
        }
    }

    
    


    this.tbody.append(row)
   })
  


     }

     createRow(){

        const tr = document.createElement('tr');

        tr.innerHTML = ` 
        <td class="user">
            <img src="https://github.com/maykbrito.png" alt="imagem de Mayk Brito">
            <a href="https://github.com/maykbrito/maykbrito" target="_blank">
                <p>Mayk Brito</p>
                <span>MaykBrito</span>
            </a>
        </td>
 
        <td class="repositories">
            76
        </td>
        <td class="followers">
            9589
        </td>
        <td>
            <button class="remove">&times;</button>
        </td>
    
    `
    return tr 

     }

    
    removeAllTr(){

        

        this.tbody.querySelectorAll('tr')
        .forEach((tr)=>{
            tr.remove()
        })

    }

 }