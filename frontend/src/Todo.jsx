import React from 'react'
import {useState,useEffect} from 'react'
const Todo = () => {
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [todos,setTodos]=useState([]);
    const [error,setError]=useState("")
    const [mess,setMess]=useState("");
    const [editId,setEditId]=useState(-1);

    const [editTitle,setEditTitle]=useState("");
    const [editDescription,setEditDescription]=useState("");


    const apiUrl="http://localhost:3000"
    const handleUpdate=()=>{
      setError("")
      //check inputs
      if(editTitle.trim()!==''&&editDescription.trim()!==''){
        fetch(apiUrl+"/todos/"+editId,{
         method:"PUT",
         headers:{
             'Content-Type':'application/json'
         },
         body:JSON.stringify({title:editTitle,description:editDescription})
        }

        ).then((res)=>{
         if(res.ok){
//update  item to list
const updatedTodos= todos.map((item)=>{
  if(item._id===editId){
    item.title=editTitle;
    item.description=editDescription;
  }
  return item;
})
setTodos(updatedTodos)
setEditTitle("");
setEditDescription("");
setMess("Todo Updated Successfully")
setTimeout(()=>{
 setMess("");
},3000)
setEditId(-1);
         }else{
             //set error
             setError("Unable to create todo item");
         }}).catch(() => {
          setError("Unable to create Todo item")
      })
        
        
     }
    }
    const handleDelete=(id)=>{
if(window.confirm('Are you sure want to delete the task')){
fetch(apiUrl+'/todos/'+id,{
  method:"DELETE"
}).then(()=>{
  const updatedTodos=todos.filter((item)=>item._id!==id)
  setTodos(updatedTodos);
})

}
    }
    const handleSubmit=()=>{
        //check inputs
        if(title.trim()!==''&&description.trim()!==''){
           fetch(apiUrl+"/todos",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({title,description})
           }

           ).then((res)=>{
            if(res.ok){
  //add item to list
  setTodos([...todos,{title,description}])
  setTitle("");
  setDescription("");
  
  setMess("Todo Added Successfully")
  setTimeout(()=>{
    setMess("");
  },3000)
            }else{
                //set error
                setError("Unable to create todo item");
            }
        
           })
           
           
        }
    }
const handleEditCancel=()=>{
  setEditId(-1);
}
useEffect(()=>{
  getItems()
},[])

    const getItems=async()=>{
      await fetch(apiUrl+"/todos").then(async(res)=> await res.json()
      ).then((res)=>{
        setTodos(res);
      })
    }

  
    const handleEdit=(ele)=>{
      setEditId(ele._id);
      setEditTitle(ele.title) ;
      setEditDescription(ele.description);
    }
  return (<>
    <div className='row p-3 bg-primary text-light'>
        <h1 className='bg-primary'>To-do Website</h1>
      
    </div>
    <div className="row text-light" >
        <h3>Add Item</h3>
        {mess&&<p className="text-success">{mess}</p>}
       <div className="form-group d-flex gap-2">
       <input placeholder ="title" onChange={(e)=>
        setTitle(e.target.value)} value={title}className="form-control" type="text"/>
       <input placeholder ="description" onChange={(e)=>
        setDescription(e.target.value)} value={description}className="form-control" type="text"/>
       <button className='btn btn-dark bg-info' onClick={handleSubmit}>Submit</button></div> 
   {error&&<p className='text-danger'>{error}</p> }
   </div>
   <div className='row mt-3 text-light'>
    <h3>Tasks</h3>
    <ul className='list-group '>
      {
        todos.map((ele)=><li key={ele._id} className='list-group-item d-flex justify-content-between rounded align-items-center my-2'>
          
        <div className="d-flex flex-column me-2  text-light">
          {
            editId === -1 ||editId!==ele._id?<> <div className="d-flex flex-column bg-white ">
            <p className='bg-white text-dark'><strong className='bg-white'>Task : </strong>  {ele.title} </p>
            <p className='bg-white text-dark'><strong className='bg-white'>Description : </strong> {ele.description} </p>
          </div></>:<> 
            <div className="form-group bg-white d-flex gap-2">
       <input placeholder ="title" onChange={(e)=>
        setEditTitle(e.target.value)} value={editTitle} className="form-control" type="text"/>
       <input placeholder ="description" onChange={(e)=>
        setEditDescription(e.target.value)} value={editDescription}className="form-control" type="text"/>
</div>
       </>
          } 
      
        </div>
         <div className="d-flex gap-2 bg-white">  
          {
            editId===-1||editId!==ele._id? <button className='btn btn-warning' onClick={()=>handleEdit(ele)}>Edit</button>:<button className="btn btn-warning " onClick={handleUpdate}>Update</button>

          }  
           {
            editId===-1||editId!==ele._id? <button className='btn btn-danger' onClick={()=>handleDelete(ele._id)}>Delete</button>  
       :<button className='btn btn-danger' onClick={handleEditCancel}>Cancel</button>  
           }</div>
        </li>
        )
      } 
    </ul>
   </div>
   
    </>
  )
}

export default Todo
