//store selected output in local storage

export function saveInLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

//get selected output from local storage
export function getFromLocalStorage(key: string) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}