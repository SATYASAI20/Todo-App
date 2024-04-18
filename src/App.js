import React, { useState, useEffect } from 'react';

import './App.css';
import { useSearchParams } from 'react-router-dom';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setAllTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  // const [newOnCreationDataTime, setnewOnCreationDataTime] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");
  const [Oncreationtime, setOnCreationTime] = useState("");

  const handleAddTodo = () => {
    // creation time and date
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    setOnCreationTime(dd + "-" + mm + "-" + yyyy + " at " + h + ":" + m + ":" + s);
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
      Oncreation: Oncreationtime

    }

    let updatedTodoArr = [...allTodos];
    if (newTitle != "") {
      if (newDescription !== "") {
        updatedTodoArr.push(newTodoItem);
        setAllTodos(updatedTodoArr);
        localStorage.setItem('todoList', JSON.stringify(updatedTodoArr))

      } else {
        window.alert("Please Enter Description");
      }
    } else {
      window.alert("Please Enter title..!")
    }
  }



  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todoList'));
    let savedcompletedTodo = JSON.parse(localStorage.getItem('completedTodolist'));
    if (savedTodo) {
      setAllTodos(savedTodo);
    }

    // complete todo list in UI
    if (savedcompletedTodo) {
      setCompletedTodos(savedcompletedTodo);
    }
  }, [])



  const handleDeleteToList = (index) => {
    let reduceTodo = [...allTodos];
    reduceTodo.splice(index, 1);

    localStorage.setItem('todoList', JSON.stringify(reduceTodo));
    setAllTodos(reduceTodo);
  }

  const handleComplete = (index) => {
    // let getCreationTime = [...allTodos];
    // let CreationItem = getCreationTime.indexOf(index);
    // let creationtime = CreationItem.Oncreation;
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    // let day = now.getDay();
    let completedOn = dd + "-" + mm + "-" + yyyy + " at " + h + ":" + m + ":" + s; //+ " on " + day
    let filteredItem = {
      ...allTodos[index],
      // OncreationTime: creationtime,
      completedOn: completedOn
    }

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeleteToList(index); // delete from the dolist
    // updated completed todos in the local storage
    localStorage.setItem('completedTodolist', JSON.stringify(updatedCompletedArr));
  }

  const handleDeleteCompleteTodo = (index) => {
    let reduceCompleteTodo = [...completedTodos];
    reduceCompleteTodo.splice(index, 1);
    localStorage.setItem('completedTodolist', JSON.stringify(reduceCompleteTodo));
    setCompletedTodos(reduceCompleteTodo);
  };

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem(item);
  }

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value }
    })
  }


  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value }
    })
  }

  const handleUpdateTodo = () => {
    let newTodo = [...allTodos];
    newTodo[currentEdit] = currentEditedItem;
    setAllTodos(newTodo);
    setCurrentEdit("");
  }

  const handleUpdateCancelTodo = () => {
    let newTodo = [...allTodos];
    setAllTodos(newTodo);
    setCurrentEdit("");
  }
  return (
    <div className="App">
      <h1>Todo List</h1>
      <div className='todo-wrapper'>
        <div className='todo-input'>
          <div className='todo-input'>
            <label className='todo-input-item'>Title</label>
            <input className='input' type="text" placeholder='Task title?' onChange={(e) => setNewTitle(e.target.value)} />
            {/* </div>
         <div> */}
            <label className='todo-input-item'>Description</label>
            <textarea className='input1' type="text" placeholder='Task description?' onChange={(e) => setNewDescription(e.target.value)} />
          </div>

          <div className='todo-input-item'>
            <button type='button' className='primary_btn' onClick={handleAddTodo}>Add</button>
          </div>
        </div>
      </div>

      <div className='btn-area'>
        <button className={`secondary_btn ${isCompleteScreen === false && 'active'}`} onClick={() => setIsCompleteScreen(false)}>Todo</button>
        <button className={`secondary_btn ${isCompleteScreen === true && 'active'}`} onClick={() => setIsCompleteScreen(true)}>completed</button>
      </div>
      <div className='todo-list'>
        {isCompleteScreen === false && allTodos.map((item, index) => {
          if (currentEdit === index) {
            return (
              <div className='edit_wrapper' key={index}>
                <input placeholder='updated title'
                  onChange={(e) => handleUpdateTitle(e.target.value)}
                  value={currentEdit.title}></input>
                <textarea placeholder='updated description'
                  rows={4}
                  onChange={(e) => handleUpdateDescription(e.target.value)}
                  value={currentEdit.description}></textarea>
                <div>
                  <button type='button' className='primary_btn2' onClick={handleUpdateCancelTodo}>Cancel</button>
                  <button type='button' className='primary_btn' onClick={handleUpdateTodo}>Update</button>
                </div>
              </div>
            )
          } else {
            return (
              <div className='todo-list-item' key={index}>
                <div>
                  <h1>{item.title}</h1>
                  <p><h2>{item.description}</h2></p>
                  <h4>OnCreation : {item.Oncreation}</h4>
                </div>
                <div>
                  <AiOutlineEdit className='check-icon' onClick={() => handleEdit(index, item)} title='Edit' />
                  <BsCheckLg className='check-icon' onClick={() => handleComplete(index)} title="Complete?" />
                  <AiOutlineDelete className='icon' onClick={() => handleDeleteToList(index)} title='Delete?' />


                </div>
              </div>
            )
          }

        })}

        {/* completed tab */}
        {isCompleteScreen === true && completedTodos.map((item, index) => {
          return (
            <div className='todo-list-item' key={index}>
              <div>
                <h4 > OnCreation : {item.Oncreation}</h4>
                <h1 className='todo-list-item-title'>{item.title}</h1>
                <p><h2>{item.description}</h2></p>
                <h4 className='todo-list-item-completedOn'>Oncompletion : {item.completedOn}</h4>
              </div>
              <div>
                <AiOutlineDelete className='icon'
                  onClick={() => handleDeleteCompleteTodo(index)}
                  title='Delete?' />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
