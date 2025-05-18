 
 let cl=console.log;
 
 const postForm=document.getElementById("postForm");
 const titleControl=document.getElementById("title");
 const contentControl=document.getElementById("content");
 const userIDControl=document.getElementById("userID");
 const addBTN=document.getElementById("addBTN");
 const updateBTN=document.getElementById("updateBTN");
 const postConatiner=document.getElementById("postConatiner");
 const loader=document.getElementById("loader")

 base_URL=`https://crud-in-js-229e9-default-rtdb.firebaseio.com`
 post_URL=`${base_URL}/posts.json`

   const snackbar=(msg, icon)=>{
       swal.fire({
          title:msg,
          icon:icon,
          timer:3000
       })
   }



    const createCards = (arr) =>{
       result=''

       arr.forEach(ele=>{
         result+=`
                    <div class="col-md-4 mb-5" id="${ele.id}">
                <div class="card h-100">
                     <div class="card-header">
                        <h3>${ele.title}</h3>
                     </div>
                     <div class="card-body">
                        <p> ${ele.body}</p>
                     </div>
                     <div class="card-footer d-flex justify-content-between">
                              <button type="button" class="btn btn-outline-success" onClick="onEdit(this)">Edit</button>
                              <button type="button" class="btn btn-outline-danger" onClick="onRemove(this)">Remove</button>
                     </div>
                </div>
            </div>
                         
         
         
         
         
         `
       })

       postConatiner.innerHTML=result
    }



    const onEdit= async (ele) =>{
        editID=ele.closest(".col-md-4").id;
        cl(editID)

        localStorage.setItem("editID", editID)

        edit_URL=`${base_URL}/posts/${editID}.json`

        let res= await makeApiCall(edit_URL, "GET")
        if(res){
               titleControl.value=res.title;
                contentControl.value=res.body;
               userIDControl.value=res.userID;
               updateBTN.classList.remove("d-none")
                addBTN.classList.add("d-none")

        }
    }


    const onRemove = async (ele) =>{
        let result=await Swal.fire({
               title: "Do you want to remove this post",
                  showCancelButton: true,
                  confirmButtonText: "remove",
                  
                 })
                 cl(result)
                 if(result.isConfirmed){
                     let removeID=ele.closest(".col-md-4").id;
                     cl(removeID)
                     remove_URL=`${base_URL}/posts/${removeID}.json`

                     let res= await makeApiCall(remove_URL, "DELETE")
                      ele.closest(".col-md-4").remove()
                      snackbar(`A post with ${ removeID} id remove succesfully`, "success")

                 }

    }
   


       


      const objToArr = (obj) =>{
      let arr=[]
      for (const key in obj) {
         arr.push({...obj[key], id:key})
            
         }

         return arr
      }



   const makeApiCall= async (url, methodName, msgBody)=>{
       try{
         msgBody=msgBody? JSON.stringify(msgBody) : null;

         loader.classList.remove("d-none")
        let res= await fetch(url,{
         method:methodName,
         body:msgBody,
         headers:{
            "content-type":"Application/json",
            Auth:"Token from LS"
         }
        })

        return res.json()

       }
       catch(err){
            snackbar(err, "error")
       }finally{
          loader.classList.add("d-none")
       }


   }


   const fetchAllpost = async() =>{
       let data=await makeApiCall(post_URL, "GET")
       cl(data)

       let postArr=objToArr(data)
       createCards(postArr)
   }

   fetchAllpost()






   const onAddpost = async (eve) =>{
        eve.preventDefault()

        let obj={
            title:titleControl.value,
            body:contentControl.value,
            userID:userIDControl.value,

        }

        cl(obj)

      let res= await makeApiCall(post_URL, "POST", obj)
         postForm.reset()
      

      //create single card

     let colDiv=document.createElement("div")
       colDiv.id=res.name;
      colDiv.className="col-md-4 mb-5"
      colDiv.innerHTML=`
      
                        <div class="card h-100">
                     <div class="card-header">
                        <h3>${obj.title}</h3>
                     </div>
                     <div class="card-body">
                        <p> ${obj.body}</p>
                     </div>
                     <div class="card-footer d-flex justify-content-between">
                              <button type="button" class="btn btn-outline-success" onClick="onEdit(this)">Edit</button>
                              <button type="button" class="btn btn-outline-danger" onClick="onRemove(this)">Remove</button>
                     </div>
                </div>
      
      `
      postConatiner.prepend(colDiv)

      snackbar("a post created successfully" , "success")

   }

   const onUpdateBtn = async () =>{
         updateID=localStorage.getItem("editID")

         let updateOBJ={
              title:titleControl.value,
            body:contentControl.value,
            userID:userIDControl.value,
         }
         postForm.reset()

         update_URL=`${base_URL}/posts/${updateID}.json`
         let res=await makeApiCall(update_URL, "PATCH", updateOBJ)

         let card=document.getElementById(updateID)

         card.querySelector("h3").innerHTML=updateOBJ.title;
         card.querySelector("p").innerHTML=updateOBJ.body;
         updateBTN.classList.add("d-none")
                addBTN.classList.remove("d-none")

              

                snackbar( `a post with ${updateID} id is updated successfully`, "success")
   }






  updateBTN.addEventListener("click", onUpdateBtn)
 postForm.addEventListener("submit", onAddpost)