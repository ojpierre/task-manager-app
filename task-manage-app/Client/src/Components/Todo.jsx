/* eslint-disable no-undef */
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { useEffect } from "react";

  const Container = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  `;

  const Title = styled.h2`
    text-align: center;
    color: #007bff;
  `;

  const Form = styled.form`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  `;

  const Input = styled.input`
    padding: 10px;
    margin-bottom: 10px;
  `;

  const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  `;

  const TaskContainer = styled.div`
    background-color: #f8f9fa;
    padding: 10px;
    margin-bottom: 10px;
  `;

  const TaskItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    opacity: ${({ status }) => (status ? 0.5 : 1)};
  `;

  const EditButton = styled(Button)`
    background-color: #ffc107;

    &:hover {
      background-color: #d39e00;
    }
  `;

  const DeleteButton = styled(Button)`
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  `;

  const rotateAnimation = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

  const Spinner = styled.div`
    width: 20px;
    height: 20px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #007bff;
    border-radius: 50%;
    animation: ${rotateAnimation} 1s linear infinite;
    margin: 0 auto;
  `;

const Todo = () => {
  const [showForm, setShowForm] = useState(true);
  const [showNew, setShowNew] = useState(true);
  const [showDelete, setShowDelete] = useState(true);
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);
  const [showList, setShowList] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [setDeleteMessageSuccess] = useState(false);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [items, setItems] = useState([
    {
      id: "001",
      name: "Default Task",
      desc: "Default Description",
      status: false,
    },
  ]);

  const handleInput = (e) => {
    setInputTitle(e.target.value);
  };

  const handleInputDesc = (e) => {
    setInputDesc(e.target.value);
  };

  const [isSubmitting] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    setShowList(true);
    setShowNew(true);
    e.preventDefault();

    if (!inputTitle || !inputDesc) {
      alert("Please fill in all the data.");
      setShowList(false);
    } else if (inputTitle && !toggleSubmit) {
      try {
        // Send PUT request to update task
        await axios.put(`/api/tasks/${isEditItem}`, {
          name: inputTitle,
          desc: inputDesc,
        });

        setItems(
          items.map((elem) => {
            if (elem.id === isEditItem) {
              return { ...elem, name: inputTitle, desc: inputDesc };
            }
            return elem;
          })
        );

        setInputTitle("");
        setInputDesc("");
        setToggleSubmit(true);
        setShowForm(false);
        setShowDelete(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        // Send POST request to create new task
        const response = await axios.post("/api/tasks", {
          name: inputTitle,
          desc: inputDesc,
        });

        const newTask = response.data;

        setItems([newTask, ...items]);
        setInputTitle("");
        setInputDesc("");
        setShowForm(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Function to handle task deletion
  const handleDelete = async (id) => {
    try {
      // Send DELETE request to delete task
      await axios.delete(`/api/tasks/${id}`);

      const updatedItems = items.filter((elem) => elem.id !== id);
      setDeleteMessage(true);
      setTimeout(() => {
        setItems(updatedItems);
        setDeleteMessage(false);
      }, 2000);

      setDeleteMessageSuccess(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle task editing
  const handleEdit = (id) => {
    setShowList(false);
    setShowDelete(false);
    setShowNew(false);
    setShowForm(true);
    setToggleSubmit(false);

    let newEditItem = items.find((elem) => elem.id === id);

    setInputTitle(newEditItem.name);
    setInputDesc(newEditItem.desc);
    setIsEditItem(id);
  };

  const handleAdd = () => {
    setShowForm(true);
    setShowList(true);
    setShowNew(false);
  };

  // Function to handle task completion status
  const handleComplete = async (id) => {
    try {
      const task = items.find((elem) => elem.id === id);
      const updatedTask = { ...task, status: !task.status };

      // Send PUT request to update task completion status
      await axios.put(`/api/tasks/${id}`, updatedTask);

      setItems(
        items.map((elem) => {
          if (elem.id === id) {
            return { ...elem, status: !elem.status };
          }
          return elem;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch tasks from the server when component mounts
    const fetchTasks = async () => {
      try {
        // Send GET request to fetch tasks
        const response = await axios.get("/api/tasks");
        const tasks = response.data;
        setItems(tasks);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTasks();
  }, []);



  return (
    <>
      {showNew ? (
        <Container>
          <div className="col-12 text-end">
            <Button onClick={handleAdd}>New</Button>
          </div>
        </Container>
      ) : (
        ""
      )}

      {showForm ? (
        <>
          <Container>
            <div className="row">
              <div className="text-center">
                <Title>{toggleSubmit ? "Add Task" : "Edit Task"}</Title>
              </div>
              <Form onSubmit={handleSubmit}>
                <label htmlFor="title">Enter Title</label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Title"
                  value={inputTitle}
                  onChange={handleInput}
                />

                <label htmlFor="description">Enter Description</label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Description"
                  value={inputDesc}
                  onChange={handleInputDesc}
                />

                {toggleSubmit ? (
                  <Button>{isSubmitting ? <Spinner /> : "Save"}</Button>
                ) : (
                  <Button>{isSubmitting ? <Spinner /> : "Update"}</Button>
                )}
              </Form>
            </div>
          </Container>
        </>
      ) : (
        ""
      )}

      {showList ? (
        <Container>
          {deleteMessage ? (
            <p className="text-center text-danger">Item Deleted Successfully</p>
          ) : (
            ""
          )}

          {items.map((elem) => {
            return (
              <TaskContainer key={elem.id}>
                <TaskItem status={elem.status}>
                  <div>
                    <h4>{elem.name}</h4>
                    <p>{elem.desc}</p>
                  </div>
                  <EditButton onClick={() => handleEdit(elem.id)}>
                    Edit
                  </EditButton>
                  {showDelete ? (
                    <DeleteButton onClick={() => handleDelete(elem.id)}>
                      Delete
                    </DeleteButton>
                  ) : (
                    ""
                  )}
                  <Button onClick={() => handleComplete(elem.id)}>
                    {elem.status ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                </TaskItem>
              </TaskContainer>
            );
          })}
        </Container>
      ) : (
        ""
      )}
    </>
  );
};

export default Todo;
