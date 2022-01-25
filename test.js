class TodoList {
  constructor(el) {
    this.todos = [];
    this.el = el;
    this.el.on("click", (e) => this.handleClick(e));
  }
  addTodo(value) {
    this.todos.push(value);
    this.render();
  }
  removeTodo(id) {
    this.todos = this.todos.filter((el) => {
      return el.id !== id;
    });
    deleteTodo($url, id, () => {
      let task = $(`[data-id="${id}"]`);
      task.remove();
    });
  }
  getTodos() {
    return this.todos;
  }
  setTodos(todos) {
    this.todos = todos;
  }
  changeStatus(id) {
    let index = this.todos.findIndex((el) => el.id === id);
    if (this.todos[index].status === "true") {
      this.todos[index].status = "false";
    } else {
      this.todos[index].status = "true";
    }
    updateTodo($url, this.todos[index], () => {
      let task = $(`[data-id="${id}"]`);
      if (this.todos[index].status === "true") {
        task.removeClass("yellow-task");
        task.addClass("green-task");
      } else {
        task.removeClass("green-task");
        task.addClass("yellow-task");
      }
    });
  }
  handleClick(e) {
    e.preventDefault();
    let id = $(e.target).parent().data().id;
    if ($(e.target).hasClass("set-status")) {
      this.changeStatus(id);
    } else {
      this.removeTodo(id);
    }
  }
  findTasks(str) {
    let todos = this.getTodos();
    this.todos = this.todos.filter(todo => todo.task && todo.task.includes(str));
    this.render();
    this.setTodos(todos);
  }
  render() {
    let lis = "";
    for (let el of this.todos) {
      if (!el) {
        return;
      }
      let classTask = el.status === "true" ? "green-task" : "yellow-task";
      lis += `<li data-id="${el.id}" class ="${classTask}">${el.task}<button class="set-status">Change status</button><button class="delete-task">Delete</button></li>`;
    }
    this.el.html(lis);
  }
}

class Task {
  constructor(value, status) {
    this.task = value;
    this.status = status;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

$todo1 = new TodoList($("#list"));
$url = "http://localhost:3000/todos";

function loadTodo(url) {
  return $.ajax({
    type: "GET",
    url: url,
    success: (todos) => {
      $todo1.setTodos(todos);
    },
    error: (error) => {
      console.log("error", error);
    },
  });
}

function sendTodo(url, todo, onSuccess) {
  $.ajax({
    type: "POST",
    url: url,
    data: todo,
    success: onSuccess,
    error: (error) => {
      console.log(error);
    },
  });
}

function updateTodo(url, todo, onSuccess) {
  $.ajax({
    type: "PUT",
    url: url + "/" + todo.id,
    data: todo,
    success: onSuccess,
    error: (error) => {
      console.log(error);
    },
  });
}

function deleteTodo(url, id, onSuccess) {
  $.ajax({
    type: "DELETE",
    url: url + "/" + id,
    success: onSuccess,
    error: (error) => {
      console.log(error);
    },
  });
}

$(window).ready(
  loadTodo($url).then(() => {
    $todo1.render();
  })
);

$("#create-btn").on("click", (e) => {
  e.preventDefault();
  if ($("#input").val()) {
    sendTodo($url, new Task($("#input").val(), false), (todo) => {
      $todo1.addTodo(todo);
      $("#input").val("");
    });
  }
});

$("#find-btn").on("click", (e) => {
  e.preventDefault();
  if ($("#input").val()) {
    $todo1.findTasks($("#input").val());
  }
});
