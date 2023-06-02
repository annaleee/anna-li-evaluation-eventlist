const API = (function (){
  const API_url = "http://localhost:3000/events";

  const getEvents = async () =>{
    const res = await fetch(`${API_url}`);
    return await res.json();
  }

  const postEvents = async (newEvent) =>{
    const res = await fetch(`${API_url}`,{
      method: "POST",
      headers:{
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(newEvent)
    });
    return await res.json();
  }
  const deleteEvents = async (id) =>{
    const res = await fetch(`${API_url}/${id}`,{
      method: "DELETE",
    });
    return await res.json();
  }

  const editEvent = async (id,event) =>{
    const res = await fetch(`${API_url}/${id}`,{
      method: "PATCH",
      headers:{
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(event)
    });
    return await res.json();
  };

  return {
    getEvents,
    postEvents,
    deleteEvents,
    editEvent,
  }
})()

class EventModel {
  #events = [];

  constructor(){}

  getEvents(){
    return this.#events;
  }

  async fetchEvents() {
    const event = await API.getEvents();
    this.#events.push(...event);
    console.log(this.#events);
    return event;
  }

  async addEvent(newEvent){
    const event = await API.postEvents(newEvent);
    this.#events.push(event);
    return event;
  }

  async removeEvent(id) {
    const remove = await API.deleteEvents(id);
    this.#events = this.#events.filter((event)=>{event.id !=id});
    return remove;
  }

  async editEvent(id,newEvent){
    const edit = await API.editEvent(id,newEvent);
    this.#events = this.#events.map((event)=>{
      if(event.id == id){
        return newEvent
      }else{
        return event;
      }
    })
    return edit;
  }
}

class EventView {
  constructor(){
    this.eventList = document.querySelector(".event-app__list-content");
    this.addBtn = document.getElementById("event_add-new-btn");
  }

  initRender(events) {
    this.eventList.innerHTML = "";
    events.forEach((event)=>{
      this.appendEvent(event);
    })
  }

  removeEvent(id){
    const element = document.getElementById(`event-${id}`);
    element.remove();
  }

  appendEvent(event){
    const eventElem = this.createEventElem(event);
    this.eventList.append(eventElem);
  }

  editEvent(id,newevent){
    const eventTitle = document.getElementById(`eventTitle-${id}`);
    const eventStart = document.getElementById(`eventStart-${id}`);
    const eventEnd = document.getElementById(`eventEnd-${id}`);
    eventTitle.textContent = newevent.eventName;
    eventStart.textContent = newevent.startDate;
    eventEnd.textContent = newevent.endDate;
  }

  appendEditEvent(){
    if(document.getElementById("form-new")){
      return;
    }
    const form = this.addNewEventElem();
    this.eventList.append(form);
  }

  appendNewEvent(event){
    const newElem = this.createEventElem(event);
    const EditForm = document.getElementById("form-new");
    EditForm.remove();
    this.eventList.append(newElem);
  }

  editEvent(id){
    const show = document.getElementById(`content-${id}`);
    const form = document.getElementById(`form-${id}`);
    show.style.display = "none"
    form.style.display = "flex"
  }

  cancelEditEvent(id){
    const show = document.getElementById(`content-${id}`);
    const form = document.getElementById(`form-${id}`);
    show.style.display = "flex"
    form.style.display = "none"
  }

  cancelEditNewEvent(){
    const form = document.getElementById("form-new");
    form.remove();
  }

  createEventElem(event){
    const eventElem = document.createElement("div");
    eventElem.classList.add("event-app__list-content-elem");
    eventElem.setAttribute("id",`event-${event.id}`);
    
    const show = document.createElement("div");
    show.classList.add("event-app__list-content-elem-text");
    show.setAttribute("id",`content-${event.id}`);

    const name = document.createElement("div");
    name.classList.add("app__list-content-elem-text")
    name.setAttribute("id",`eventTitle-${event.id}`)
    name.textContent = event.eventName;

    const start = document.createElement("div");
    start.classList.add("app__list-content-elem-text")
    start.setAttribute("id",`eventStart-${event.id}`);
    start.textContent = event.startDate;

    const end = document.createElement("div");
    end.classList.add("app__list-content-elem-text")
    end.setAttribute("id",`eventEnd-${event.id}`);
    end.textContent = event.endDate;

    const showBtn = document.createElement("div");
    const writeBtnOuter = document.createElement("button");
    const writeBtn = document.createElementNS("http://www.w3.org/2000/svg","svg");
    writeBtn.setAttribute("focusable","false");
    writeBtn.setAttribute("aria-hidden","true");
    writeBtn.setAttribute("viewBox","0 0 24 24");
    writeBtn.setAttribute("data-testid","EditIcon");
    writeBtn.setAttribute("aria-label","fontSize small")
    const writeBtnInner = document.createElementNS("http://www.w3.org/2000/svg","path");
    writeBtnInner.setAttribute("d","M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z");
    writeBtn.appendChild(writeBtnInner);
    writeBtnOuter.append(writeBtn);
    writeBtnOuter.classList.add("editBtn");
    writeBtnOuter.setAttribute("edit-id",event.id);
    writeBtnOuter.classList.add("Btn")
    const deleteBtnOuter = document.createElement("button");
    const deleteBtn = document.createElement("svg");
    deleteBtn.setAttribute("focusable","false");
    deleteBtn.setAttribute("aria-hidden","true");
    deleteBtn.setAttribute("viewBox","0 0 24 24");
    deleteBtn.setAttribute("data-testid","DeleteIcon");
    deleteBtn.setAttribute("aria-label","fontSize small")
    const deleteBtnInner = document.createElement("path");
    deleteBtnInner.setAttribute("d","M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z");
    deleteBtn.append(deleteBtnInner);
    deleteBtnOuter.append(deleteBtn);
    deleteBtnOuter.classList.add("deleteBtn");
    deleteBtnOuter.setAttribute("delete-id",event.id);
    showBtn.append(writeBtnOuter,deleteBtnOuter);

    show.append(name,start,end,showBtn);

    const submit = document.createElement("form");
    submit.classList.add("event-app__list-content-elem-form");
    submit.setAttribute("id",`form-${event.id}`);
    
    const nameInput = document.createElement("input");
    nameInput.setAttribute("id",`eventTitleInput-${event.id}`)
    nameInput.value = event.eventName;

    const startInput = document.createElement("input");
    startInput.setAttribute("type","date");
    startInput.setAttribute("id",`eventStartInput-${event.id}`);
    startInput.value = event.startDate;

    const endInput = document.createElement("input");
    endInput.setAttribute("type","date");
    endInput.setAttribute("id",`eventEndInput-${event.id}`);
    endInput.value = event.endDate;

    const formBtn = document.createElement("div");
    const saveBtnOuter = document.createElement("button");
    const saveBtn = document.createElementNS("http://www.w3.org/2000/svg","svg");
    saveBtn.setAttribute("focusable","false");
    saveBtn.setAttribute("aria-hidden","true");
    saveBtn.setAttribute("viewBox","0 0 24 24");
    saveBtn.setAttribute("xmlns","http://www.w3.org/2000/svg");
    const saveBtnInner = document.createElementNS("http://www.w3.org/2000/svg","path");
    saveBtnInner.setAttribute("d","M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z");
    saveBtn.append(saveBtnInner);
    saveBtnOuter.append(saveBtn);
    saveBtnOuter.classList.add("saveBtn");
    saveBtnOuter.setAttribute("save-id",event.id);
    const cancelBtnOuter = document.createElement("button");
    const cancelBtn = document.createElement("svg");
    cancelBtn.setAttribute("focusable","false");
    cancelBtn.setAttribute("aria-hidden","true");
    cancelBtn.setAttribute("viewBox","0 0 32 32");
    cancelBtn.setAttribute("version","1.1");
    cancelBtn.setAttribute("xmlns","http://www.w3.org/2000/svg");
    const cancelBtnInner = document.createElement("path");
    cancelBtnInner.setAttribute("d","M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z");
    cancelBtn.append(cancelBtnInner);
    cancelBtnOuter.append(cancelBtn);
    cancelBtnOuter.classList.add("cancelBtn");
    cancelBtnOuter.setAttribute("cancel-id",event.id);
    formBtn.append(saveBtnOuter,cancelBtnOuter);

    submit.append(nameInput,startInput,endInput,formBtn);
    submit.style.display = "none"

    eventElem.append(show,submit);
    return eventElem;
  }

  addNewEventElem(){
    const submit = document.createElement("div");
    submit.classList.add("event-app__list-content-elem-form--new");
    submit.setAttribute("id",`form-new`);
    
    const nameInput = document.createElement("input");
    nameInput.setAttribute("id",`eventTitleInput-new`)

    const startInput = document.createElement("input");
    startInput.setAttribute("type","date");
    startInput.setAttribute("id",`eventStartInput-new`);

    const endInput = document.createElement("input");
    endInput.setAttribute("type","date");
    endInput.setAttribute("id",`eventEndInput-new`);

    const formBtn = document.createElement("div");
    const saveBtnOuter = document.createElement("button");
    const saveBtn = document.createElement("svg");
    saveBtn.setAttribute("focusable","true");
    saveBtn.setAttribute("aria-hidden","true");
    saveBtn.setAttribute("viewBox","0 0 24 24");
    saveBtn.setAttribute("xmlns","http://www.w3.org/2000/svg");
    const saveBtnInner = document.createElement("path");
    saveBtnInner.setAttribute("d","M12 6V18M18 12H6");
    saveBtnInner.setAttribute("stroke","#FFFFFF");
    saveBtnInner.setAttribute("stroke-width","4");
    saveBtnInner.setAttribute("stroke-linecap","round");
    saveBtnInner.setAttribute("stroke-linejoin","round")
    saveBtn.append(saveBtnInner);
    saveBtnOuter.append(saveBtn);
    saveBtnOuter.classList.add("saveBtn-new");
    const cancelBtnOuter = document.createElement("button");
    const cancelBtn = document.createElement("svg");
    cancelBtn.setAttribute("focusable","false");
    cancelBtn.setAttribute("aria-hidden","true");
    cancelBtn.setAttribute("viewBox","0 0 32 32");
    cancelBtn.setAttribute("version","1.1");
    cancelBtn.setAttribute("xmlns","http://www.w3.org/2000/svg");
    const cancelBtnInner = document.createElement("path");
    cancelBtnInner.setAttribute("d","M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z");
    cancelBtn.append(cancelBtnInner);
    cancelBtnOuter.append(cancelBtn);
    cancelBtnOuter.classList.add("cancelBtn-new");
    formBtn.append(saveBtnOuter,cancelBtnOuter);

    submit.append(nameInput,startInput,endInput,formBtn);
    return submit;
  }

}


class EventController {
  constructor(model, view){
    this.model = model;
    this.view = view;
    this.init();
  }
  async init() {
    this.setUpEvents();
    await this.model.fetchEvents();
    this.view.initRender(this.model.getEvents());
  }

  setUpEvents() {
    this.setUpAddNewEvent();
    this.setUpBtnEvent();
  }

  setUpAddNewEvent(){
    this.view.addBtn.addEventListener("click",()=>{
      this.view.appendEditEvent();
    })
  }

  setUpBtnEvent() {
    this.view.eventList.addEventListener("click", (e) => {
      const isDeleteBtn = e.target.classList.contains("deleteBtn");
      const isSaveBtn = e.target.classList.contains("saveBtn");
      const isEditBtn = e.target.classList.contains("editBtn");
      const isCancelBtn = e.target.classList.contains("cancelBtn");
      const isSaveBtn_new = e.target.classList.contains("saveBtn-new");
      const isCancelBtn_new  = e.target.classList.contains("cancelBtn-new");
      if (isEditBtn) {
        const editId = e.target.getAttribute("edit-id");
        this.view.editEvent(editId);
      }else if(isDeleteBtn){
        const removeId = e.target.getAttribute("delete-id");
        this.model.removeEvent(removeId);
        this.view.removeEvent(removeId);
      }else if(isSaveBtn){
        const saveId = e.target.getAttribute("save-id");
        const newName = document.getElementById(`eventTitleInput-${saveId}`).value;
        const newStart = document.getElementById(`eventStartInput-${saveId}`).value;
        const newEnd = document.getElementById(`eventEndInput-${saveId}`).value;
        this.model.editEvent(saveId,{
          "eventName":newName,
          "startDate":newStart,
          "endDate":newEnd
        }).then((newEvent) =>{
          this.view.editEvent(saveId,newEvent)
        })
      }else if(isCancelBtn){
        const cancelId = e.target.getAttribute("cancel-id");
        this.view.cancelEditEvent(cancelId);
      }else if(isSaveBtn_new){
        const newName = document.getElementById(`eventTitleInput-new`).value;
        const newStart = document.getElementById(`eventStartInput-new`).value;
        const newEnd = document.getElementById(`eventEndInput-new`).value;
        console.log(newName)
        this.model.addEvent({
          "eventName":newName,
          "startDate":newStart,
          "endDate":newEnd
        }).then((newEvent)=>{
          this.view.appendNewEvent(newEvent)
        })
      }else if(isCancelBtn_new){
        this.view.cancelEditNewEvent();
      }
    });
  }
}

const model = new EventModel();
const view = new EventView();
const controller = new EventController(model, view);