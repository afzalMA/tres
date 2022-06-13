// class for working with local storage in browser (common that can use other classes for store some data)
export default class LocalStorageWorker {
  localStorageSupported;

  constructor() {
    this.localStorageSupported =
      typeof window['localStorage'] != 'undefined' &&
      window['localStorage'] != null;
  }

  // add value to storage
  add(key, item) {
    if (this.localStorageSupported) {
      localStorage.setItem(key, item);
    }
  }

  // get all values from storage (all items)
  getAllItems() {
    var list = new Array();

    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var value = localStorage.getItem(key);

      list.push(
        new StorageItem({
          key: key,
          value: value,
        })
      );
    }

    return list;
  }

  // get only all values from localStorage
  getAllValues(){
    var list = new Array();

    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var value = localStorage.getItem(key);

      list.push(value);
    }

    return list;
  }

  // get one item by key from storage
  get(key) {
    if (this.localStorageSupported) {
      var item = localStorage.getItem(key);
      return item;
    } else {
      return null;
    }
  }

  // remove value from storage
  remove(key) {
    if (this.localStorageSupported) {
      localStorage.removeItem(key);
    }
  }

  // clear storage (remove all items from it)
  clear() {
    if (this.localStorageSupported) {
      localStorage.clear();
    }
  }
}
