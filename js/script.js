class User{
    constructor({ id, name, email, address, phone }) {    
         this.date = { id, name, email, address, phone }
         this.editMode = false
    }

    edit({name, email, address, phone}){
        this.date = { ...this.date, name, email, address, phone }
    }

    get() {
        return this.date
    }
}

class Contacts{
    constructor() {
        this.contactsData = this.getcontactsData();
    }
    getcontactsData(){
        let data = localStorage.getItem('contactsData') ? JSON.parse(localStorage.getItem('contactsData')) : []
        if(data.length > 0){
            data = data.map(({date}) => new User(date))
            return data
        }
        return data
    }
    add({name, email, address, phone}){
        const user = new User({
            id: Date.now(),
            name,
            email,
            address,
            phone,
        })

        this.contactsData.push(user);
    }

    remove(idContact) {
        this.contactsData = this.contactsData.filter(({date:{id}}) => id != idContact)
    }


    edit(userEdit, newContactDate){
        userEdit.edit(newContactDate)
    }

    get(){
        return this.contactsData
    }
}

class ContactsApp extends Contacts {
    constructor(){
        super();
        this.inputName;
        this.inputPhone;
        this.inputEmail;
        this.inputAddress;
        this.addButton;
        this.app;
        this.createHTML();
        this.addEvent();
    }

    createHTML() {

        const contcatOption  = document.createElement('div');
        contcatOption.classList.add('contacts__options');

        this.app = document.createElement('div');
        this.inputName = document.createElement('input');
        this.inputPhone = document.createElement('input');
        this.inputEmail = document.createElement('input');
        this.inputAddress = document.createElement('input'); 
        this.addButton = document.createElement('button');
        this.editButton = document.createElement('button');

        this.inputName.classList.add('contact__name');
        this.inputPhone.classList.add('contact__phone');
        this.inputEmail.classList.add('contact__email');
        this.inputAddress.classList.add('contact__address');
        this.addButton.classList.add('contact__button__add');

        this.addButton.innerHTML="Добавить контакт"

        contcatOption.appendChild(this.inputName);
        contcatOption.appendChild(this.inputEmail);
        contcatOption.appendChild(this.inputAddress);
        contcatOption.appendChild(this.inputPhone);
        contcatOption.appendChild(this.addButton);

        this.app.appendChild(contcatOption);

        this.app.classList.add('contacts')
        document.body.appendChild(this.app)        
        this.onShow()
    }

    addEvent(){
      
        this.addButton.addEventListener('click', ()=>{
            this.onAdd(this.createInputObject())

            this.clearInput()
        })
    }

    onAdd(addObj) {
        this.add(addObj);
        this.onShow();
    }

    onShow() {
        const data = this.get();
        localStorage.setItem('contactsData', JSON.stringify(data))
        let ul = document.querySelector('.contacts__items')
        
        if(!ul){
            ul = document.createElement('ul');
            ul.classList.add('contacts__items')
        }

        let list = '';
        

        if (!data) return
        data.forEach(({date:{name, email, address, phone, id}, editMode}) => {
            list += `<li class="contact__item">
                            <p>${name}</p>  
                            <p>${email}</p>
                            <p>${address}</p>    
                            <p>${phone}</p>
                            <button class="contact__item__delete" id="${id}">Удалить</button>
                            ${editMode ? "<button class='contact__item__save' data-save="+id+">Save</button>" : '<button class="contact__item__edit" data-edit='+id+'>Редактировать</button>'}       
                    </li>`
        })

        ul.innerHTML = list;
        this.app.appendChild(ul);
        this.onAddEventRemoveEdit();

    }

    onAddEventRemoveEdit() {
        const deleteBtn = document.querySelectorAll('.contact__item__delete')
        const editBtns = document.querySelectorAll('.contact__item__edit')

        deleteBtn.forEach((delBtn) => {
            delBtn.addEventListener('click', (event) => {
                this.onDelete(event.target.id)
            })
        })

        editBtns.forEach((editBtn)=>{
            editBtn.addEventListener('click', (event) => {
                this.onEdit(event.target.dataset.edit)
            })
        })


    }

    onDelete(id) {
        this.remove(id);
        this.onShow();
    }

    onEdit(idEdit){
        const data = this.get();
        const editusers = data.map((item) => {
            if(item.date.id == idEdit) {
                item.editMode = true
            }else {
                item.editMode = false
            }
            return item
        })

        this.addButton.setAttribute('disabled','true')
        this.onShow();
      
        const  userEdit = data.find(({date: {id}}) => id == idEdit)
        const { name, phone, email, address } = userEdit.date;
        this.inputName.value = name;
        this.inputPhone.value = phone;
        this.inputEmail.value = email;
        this.inputAddress.value = address;

        const saveBtn = document.querySelector('.contact__item__save')

        if(!saveBtn) return;
        saveBtn.addEventListener('click', () => {
            this.addButton.removeAttribute('disabled')
            const newContactData = this.createInputObject()
            userEdit.editMode = false
            this.edit(userEdit, newContactData)
            this.clearInput()
            this.onShow()
        })
    }

    get() {
        return super.get() 
    }

    clearInput(){
        this.inputName.value = '';
        this.inputEmail.value = '';
        this.inputPhone.value = '';
        this.inputAddress.value = ''
    }

    createInputObject(){
        return {
            name: this.inputName.value,
            phone: this.inputPhone.value,
            email: this.inputEmail.value,
            address: this.inputAddress.value,
        }
    }
}

window.addEventListener('load', () => {
   const contacts = new ContactsApp();
})