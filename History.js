var index = 0;

var maxState = 0;

function redoHis() {
    if (index < maxState - 1) {
        index = localStorage.getItem('state');
        index++;
        localStorage.setItem('state', index);
        $('#text').html(localStorage.getItem(index + ''));
    }
}

function undoHis() {
    if(index > 0) {
        index = localStorage.getItem('state');
        index--;
        localStorage.setItem('state', index);
        $('#text').html(localStorage.getItem(index + ''));
    }
}

class History {
    constructor($text) {
        index = 0;
        this.text = $text;
        maxState = 0;

        this.saveState = _.debounce(this.saveHistory, 2000);
        $('.undoButton').on('click', undoHis);
        $('.redoButton').on('click', redoHis);

        if (localStorage.getItem('state') == null) {
            localStorage.setItem(index, this.text.html());
            localStorage.setItem('state', index);
            this.index++;
        }
        this.currentState = this.text;
        this.text.on('DOMSubtreeModified', () => this.saveState());
    }

    saveHistory() {
        localStorage.setItem('state', index);
        localStorage.setItem(index, this.text.html());
        index++;
        maxState++;
    }
}
