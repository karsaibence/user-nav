class Node {
  constructor(data) {
    this.data = data;  // Az adat (elemek, pl. 'id', 'sorszam', stb.)
    this.next = null;   // A következő elemre mutató referencia
    this.prev = null;   // Az előző elemre mutató referencia
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(data) {
    const newNode = new Node(data);
    if (this.tail) {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    } else {
      this.head = this.tail = newNode;
    }
    this.length++;
  }

  swap(index1, index2) {
    if (index1 === index2) return; // Ha ugyanaz az index, nincs szükség csere végrehajtására

    let node1 = this.getNodeAt(index1);
    let node2 = this.getNodeAt(index2);

    if (node1 && node2) {
      // Csere végrehajtása
      let tempData = node1.data;
      node1.data = node2.data;
      node2.data = tempData;
    }
  }

  getNodeAt(index) {
    if (index < 0 || index >= this.length) return null;
    let currentNode = this.head;
    for (let i = 0; i < index; i++) {
      currentNode = currentNode.next;
    }
    return currentNode;
  }

  toArray() {
    const result = [];
    let currentNode = this.head;
    while (currentNode) {
      result.push(currentNode.data);
      currentNode = currentNode.next;
    }
    return result;
  }

  updateSorszam(startIndex) {
    let currentNode = this.head;
    let counter = startIndex; // Kezdő sorszám, amit át kell adni a táblázatnak
    while (currentNode) {
      currentNode.data.sorszam = counter; // Frissítjük a sorszámot
      counter++;
      currentNode = currentNode.next;
    }
  }
}

export default LinkedList;
