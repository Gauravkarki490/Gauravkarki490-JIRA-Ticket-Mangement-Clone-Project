let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont= document.querySelector(".modal-cont");
let addFlag = false;
let removeFlag =false;
let mainCont = document.querySelector(".main-cont");
let textAreaCont =document.querySelector(".textarea-cont")
let colors= ["light-pink","light-blue","light-green","black"];
let modalPriorityColor = colors[colors.length-1];
let allPriorityColor = document.querySelectorAll(".priority-color")
let toolBoxColor  = document.querySelectorAll(".color");
let lockClass= "fa-lock";
let unlockClass= "fa-lock-open";
let clearLocalStorageData = document.querySelector(".clear-btn");
let ticketArr =[];
// listener for modal priority color

// localStorage.clear();



(function (){
    if(localStorage.getItem("jira_tickets"))
    {
        let tempArr =JSON.parse(localStorage.getItem("jira_tickets"));
        tempArr.forEach(tickObj=>{
            createTicket(tickObj.ticketColor,tickObj.ticketTask,tickObj.ticketId);
        })
    }
})();

clearLocalStorageData.addEventListener("click",(e)=>{
    localStorage.clear();
    location.reload();
})
toolBoxColor.forEach(color=>{
    color.addEventListener("click",e=>{
        let currentColor = color.classList[0];
        let ticketContAll = mainCont.querySelectorAll(".ticket-cont");
        ticketContAll.forEach(tickCont=>{
            let color=tickCont.querySelector(".ticket-color").classList[1];
            if(color !== currentColor)
            {
                tickCont.style.display="none";
            }
            if(color === currentColor &&tickCont.style.display === "none" )
            {
                tickCont.style.display="block";
            }
        })
    });
    color.addEventListener("dblclick",e=>{
        let ticketContAll = mainCont.querySelectorAll(".ticket-cont");
        ticketContAll.forEach(tickCont=>{
            tickCont.style.display="block";
        })
    });
})

allPriorityColor.forEach((colorElem,idx)=>{
    
    colorElem.addEventListener("click",(e)=>{
        allPriorityColor.forEach((elem,idx)=>{
            elem.classList.remove("border");
        });
        colorElem.classList.add("border");

        modalPriorityColor = colorElem.classList[1];
    });
    
});

addBtn.addEventListener("click",(e)=>{
    // Display Modal

    // Generate Ticket

    // AddFlag = true ->Modal display
    // AddFlag = false ->Modal hide
    
    addFlag =!addFlag;
    if(addFlag){
        modalCont.style.display="flex";
    }
    else{
        modalCont.style.display="none";
    }
})
removeBtn.addEventListener("click",(e)=>{
    removeFlag=!removeFlag;
});
function createTicket(ticketColor,ticketTask,ticketId) {
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class","ticket-cont");
    
    ticketCont.innerHTML=`
    <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">#${ticketId}</div>
        <div class="task-area">
           ${ticketTask}
        </div>
        <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>
    `;
    ticketArr.push({ticketColor,ticketTask,ticketId});
    localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));
    console.log(ticketArr);
    mainCont.appendChild(ticketCont);
    
    handleRemoval(ticketCont,ticketId);
    handleLock(ticketCont,ticketId);
    handleColor(ticketCont,ticketId);
}
function handleColor(ticket,id)
{
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{
        // get ticketIdx from ticket array
        let ticketidx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];
        let currentTicketColorIdx =colors.findIndex(color=>{
            return currentTicketColor === color;
        });
        currentTicketColorIdx++;
        let  newTicketColor = colors[currentTicketColorIdx%colors.length];
    
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);
        // Modify data in localStroage
        ticketArr[ticketidx].ticketColor=newTicketColor;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));
    })
    // ticketColor.addEventListener("click",(e)=>{
    //     let currentTicketColor = ticketColor.classList[1];
    // let i=0;
    // for(;i<colors.length;i++)
    // {
    //     console.log(colors[i],currentTicketColor);
    //     if(colors[i] === currentTicketColor)
    //     {
    //         i++;
    //         break;
    //     }
    // }
       
    //      ticketColor.classList.remove(currentTicketColor);
    //      ticketColor.classList.add(colors[i%colors.length]);
    // })
    
}
function getTicketIdx(id)
{
    let ticketIdx = ticketArr.findIndex((tickObj)=>{
        return tickObj.ticketId === id;
    })
    return ticketIdx;
}

function handleLock(ticket,id)
{
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click",(e)=>{
        let ticketidx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass))
        {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable","true");
        }
        else{
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
        }
        // Modify data in localStorage (Ticket-Task)
        ticketArr[ticketidx].ticketTask=ticketTaskArea.innerText;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));
    });
      
}
function handleRemoval(ticket,id){

    // removeFlag === true -> remove
    ticket.addEventListener("click",(e)=>{
        if(!removeFlag) return; 

        let ticketid = getTicketIdx(id);
        ticketArr.splice(ticketid,1);
        localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));
        ticket.remove();
    })
}



modalCont.addEventListener("keydown",(e)=>{
    let key = e.key;
    if(key === "Shift")
    {
        let ticketTask =textAreaCont.value;
        createTicket(modalPriorityColor,ticketTask,shortid());
        setModalToDefault();
        addFlag=!addFlag;
        
    }
})

function setModalToDefault(){
    allPriorityColor.forEach((elem,idx)=>{
        if(elem.classList.contains("black"))
        {
            elem.classList.add("border");
           modalPriorityColor="black";
        }
        else{
            elem.classList.remove("border");
        }
    });
    modalCont.style.display="none";
    textAreaCont.value="";
}

