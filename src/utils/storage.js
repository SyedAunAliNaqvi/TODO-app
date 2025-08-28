export function loadTasks() {
  try {
    const serializedTasks = localStorage.getItem('tasks');
    if (serializedTasks === null) {
      return [];
    }
    return JSON.parse(serializedTasks);
  } catch (error) {
    console.error("Could not load tasks from local storage", error);
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    const serializedTasks = JSON.stringify(tasks);
    localStorage.setItem('tasks', serializedTasks);
  } catch (error) {
    console.error("Could not save tasks to local storage", error);
  }
}