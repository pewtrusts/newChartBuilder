function last() {
    this.children[this.children.length - 1].focus();
}
function first() {
    this.children[0].focus();
}
function left() {
    this.isEditable = false;
    if (this.previousElementSibling) {
        this.previousElementSibling.focus();
        return;
    }
    up.call(this).then(v => {
        if (v) {
            last.call(v);
        }
    })
}
function right() {
    this.isEditable = false;
    if (this.nextElementSibling) {
        this.nextElementSibling.focus();
        return;
    }
    down.call(this).then(v => {
        if (v) {
            first.call(v);
        }
    })
}
function up() {
    this.isEditable = false;
    return new Promise((resolve) => {
        const childIndex = Array.from(this.parentElement.children).findIndex(x => x == this);
        if (this.parentElement.previousElementSibling) {
            this.parentElement.previousElementSibling.children[childIndex].focus();
            resolve(this.parentElement.previousElementSibling);
        } else if (this.parentElement.parentElement.tagName == 'TBODY') {   // if cell is in first row of tbody, we will want to jump up to the row in the thead
            let table = this.parentElement.parentElement.parentElement;
            table.children[0].children[0].children[childIndex].focus();
            resolve(table.children[0].children[0]);
        }
        resolve(false);
    });
}
function down() {
    this.isEditable = false;
    return new Promise((resolve) => {
        const childIndex = Array.from(this.parentElement.children).findIndex(x => x == this);
        if (this.parentElement.nextElementSibling) {
            this.parentElement.nextElementSibling.children[childIndex].focus();
            resolve(this.parentElement.nextElementSibling);
        } else if (this.parentElement.parentElement.tagName == 'THEAD') {   // if cell is in thead, we will want to jump down to the first row in the tbody
            let table = this.parentElement.parentElement.parentElement;
            table.children[1].children[0].children[childIndex].focus();
            resolve(table.children[1].children[0]);
        }
        resolve(false);
    });
}
export default {
    down,
    left,
    right,
    up
}