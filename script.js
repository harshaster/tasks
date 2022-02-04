let new_task = document.getElementById('new-task-section');
let tasks_list= document.getElementById("tasks");
let tasks_data = []
let noTasks = document.getElementsByTagName("center")[0].style
let counter = 0;

init()


function init(){
    document.getElementById('add-new-task').addEventListener('click',() => {
        document.getElementById("tasks").appendChild(new_task);
        new_task.getElementsByClassName("new-task")[0].value="";
        new_task.getElementsByClassName("priority")[0].value="";
        new_task.style.display="flex";
    })
    
    document.getElementById("cancel-task").addEventListener('click',() => {
        document.getElementById("tasks").removeChild(new_task);
    })
    
    document.getElementById("add-task").addEventListener('click',() => {
        let new_task_text = {"id": `T${counter+1}`, "description": document.getElementsByClassName("new-task")[0].value, "done":false, "priority": new_task.getElementsByClassName("priority")[0].value}
        tasks_data.push(new_task_text)
        document.getElementById("tasks").removeChild(new_task);
        gen_newtaskHTML(new_task_text);
    })

    chrome.storage.sync.get("tasks").then((result) => {
        if (result.tasks!=undefined){
            Object.assign(tasks_data,result.tasks);
            if(tasks_data.length===0){
                noTasks.display="block";
            }
            else{
                counter=tasks_data.length
                sort_tasks()
                for (tk of tasks_data) {
                    gen_newtaskHTML(tk);
                }
            }
        }
        else{
            console.log("no data right now !!")
        }
    })

    
}

function refresh_sync(){
    chrome.storage.sync.set({"tasks": tasks_data}, function(){
    })
}


function ready_task(node){
    node.getElementsByClassName("del-task")[0].addEventListener('click',() => {
        tasks_list.removeChild(node);
        let to_del = tasks_data.find((elem) => elem["id"]===node.id)
        tasks_data.splice(tasks_data.indexOf(to_del),1);
        refresh_sync()
    })
    node.getElementsByClassName("done-task")[0].addEventListener('click',function (){
        node.style.textDecoration="line-through";
        let to_del = tasks_data.find((elem) => elem["id"]===node.id)
        to_del["done"]=true
        refresh_sync()
        
    })

    node.getElementsByClassName("priority")[0].onchange = function() {
        console.log("onchange happened")
        let to_del = tasks_data.find((elem) => elem["id"]===node.id)
        to_del["priority"]=node.getElementsByClassName("priority")[0].value
        sort_tasks()
        refresh_sync()
    }

    refresh_sync()
}


function sort_tasks(){
    tasks_data = tasks_data.sort(compare_task)}

function compare_task( a, b ) {
    if ( a.priority < b.priority ){
      return -1;
    }
    if ( a.priority > b.priority ){
      return 1;
    }
    return 0;
  }


function gen_newtaskHTML(new_task){
    let new_task_html = `
<input class="priority" type="number" min="1" max="99" step="1" value=${new_task["priority"]}>
<span class="task-text">${new_task["description"]}</span>
<div class="edit-task">
    <button type="button" title="Delete this task (why)" class="edit-button del-task" "><b>X</b></button>
    <button type="button" title="Hurray ! You did it" class="edit-button done-task">&#10004;</button>
</div>`

    let new_task_node = document.createElement('div');
    new_task_node.classList.add("task");
    new_task_node.id=new_task["id"];
    new_task_node.innerHTML = new_task_html;
    document.getElementById("tasks").appendChild(new_task_node);
    if(new_task["done"]){
        new_task_node.style.textDecoration="line-through";
    }
    counter++;
    noTasks.display="none";
    ready_task(new_task_node);

}