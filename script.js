
const apiUrl ='https://js1-todo-api.vercel.app/api/todos?apikey=8f4eaa65-0eef-4728-9018-6e3425781897';

// Call fetchTodos when the page loads
document.addEventListener('DOMContentLoaded', fetchTodos);
document.getElementById('todo-form').addEventListener('submit', addTodo);

//Hämta todos
async function fetchTodos() {
    try {
        const response = await fetch(apiUrl);  // GET request to fetch todos
        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const todos = await response.json();   // Parse response as JSON

        const todoList = document.getElementById('todoList');
        todoList.innerHTML = ''; // Clear any existing list items

        // Loop through the todos and display them on the page
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.classList.add('todo');
           
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `todo-${todo._id}`;
            checkbox.checked = todo.completed;

            checkbox.addEventListener('change', () => toggleTodoStatus(todo._id, checkbox.checked));


            const checkboxLabel = document.createElement('label');
            checkboxLabel.classList.add('custom-checkbox');
            checkboxLabel.setAttribute('for', `todo-${todo._id}`);
            checkboxLabel.innerHTML = '<i class="fa-solid fa-check"></i>'

            const todoText = document.createElement('label');
            todoText.classList.add('todo-text');
            todoText.setAttribute('for', `todo-${todo._id}`);
            todoText.textContent = todo.title;

            if (todo.completed){
                todoText.style.textDecoration = 'line-through';
                todoText.style.color = 'var(--secondary-color)';
            }



            //ADD DELETE BUTTON
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-button');
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteBtn.addEventListener('click', ()=> deleteTodo(todo._id, todo.completed));


            //Append element to the list item
            li.appendChild(checkbox);
            li.appendChild(checkboxLabel);
            li.appendChild(todoText)
            li.appendChild(deleteBtn);

            //Append the list item to the todo list
            todoList.appendChild(li);
        });

    } catch (error){
        console.error('Error fetchin todos:', error);
    }
    }


    //toggleTodoStatus function
    async function toggleTodoStatus(todoId, isCompleted){
        try {
            const urlToUpdate = `https://js1-todo-api.vercel.app/api/todos/${todoId}?apikey=8f4eaa65-0eef-4728-9018-6e3425781897`; 
            const payload = { completed: isCompleted};
            

            const response = await fetch (urlToUpdate, {
                method: 'PUT', 
                headers: {
                    'content-Type': 'application/json',  
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log(`Todo with ID ${todoId} update successfully.`);
                fetchTodos(); //refresh the list to reflect the change
            }  else {
                const errorData = await response.json();
                console.error('Failed to update todo status:', errorData);
                errorMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Error updating todo status:', error);
            errorMessage.style.color = 'red';

        }
    }

   
    //Add todos
    async function addTodo(event) {
        event.preventDefault();

        const inputField = document.getElementById('todo-input');
        const errorMessage = document.getElementById('error-message');
        const todoTitle = inputField.value.trim();// trim any extra space

        // Validate the input 
        if (!todoTitle){
            errorMessage.textContent = 'You cannot add an empty todo.';
            errorMessage.style.color = 'red';

            return;
        }

        try {
            errorMessage.textContent =''; //Cleare any previous error

            //Prepare the payload
            const payload ={title: todoTitle};


            //Send Post request to add the new todo
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                
                },
                body: JSON.stringify(payload),
            });

            if (response.ok){
                inputField.value =''; //Clear the input field
                fetchTodos(); //Refresh the list to show the new todo
            } else {
                const errorData = await response.json();
                errorMessage.textContent = 'Failed to add todo. Please try again.'
                console.error('Error adding todo:', errorData);
            }
        }catch (error){
            errorMessage.textContent ='An error occurred while adding the todos.';
            console.error('Error adding todo:', error);

        } 
    }

    async function deleteTodo(todoId, isCompleted){
      const errorMessage =document.getElementById('error-message'); //Optional error message
      if (!isCompleted) {
        showModal('You cannot delete a todo that is not completed!');
        return;
    
      }

      try {
        const urlToDelete = `https://js1-todo-api.vercel.app/api/todos/${todoId}?apikey=8f4eaa65-0eef-4728-9018-6e3425781897`;

        const response = await fetch(urlToDelete,{

            method: 'DELETE',// specify the DELETE method
        });

        if (response.ok) {
            console.log(`Todo with ID ${todoId} delete successfully.`);
            fetchTodos();// Refresh the todo list after deletion
        } else {
            const errorData = await response.json();
            console.error('Failed to delete toodo:', errorData);
            errorMessage.textContent ='Failed to delete todo. pleace try again.';
        }
      } catch (error){
        console.error('Error deleting todo:', error);
        errorMessage.textContent = 'An erro occurred while deleting the todo.';

      }

    }

    //Show modal if deletion is prevented
    function showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage =modal.querySelector('p');
        modalMessage.textContent = message;// Set the message dynamicaly
        modal.style.display = 'block'; // show the modal

        document.getElementById('close-modal'). addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
    }



