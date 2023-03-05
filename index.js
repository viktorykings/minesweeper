const fMn = document.querySelector('.f-mn');
const sMn = document.querySelector('.s-mn');
const tMn = document.querySelector('.t-mn');
const sTm = document.querySelector('.s-tm');
const tTm = document.querySelector('.t-tm');
const fTm = document.querySelector('.f-tm');
const timer = document.querySelector('.timer');
const reset = document.querySelector('.reset');
const main = document.querySelector('.main');
const field = document.querySelector('#field');

function start(w, h, minesCount) {
    let isGameStarted = false;
    let loose = false;
    let win = false;
    let s = 0
    const numClass = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    const timerClass = ['t-zero', 't-one', 't-two', 't-three', 't-four', 't-five', 't-six', 't-seven', 't-eight', 't-nine']
    const cellsCount = w * h;
    field.innerHTML = "<button class='cell-cl'></button>".repeat(cellsCount);
    const cells = [...field.children];
    let mines = [];
    let minesLeft = minesCount;
    console.log(win, loose);

    updMinesCount(minesLeft);

    const updTimer = (sec) => {
        let hun = Math.trunc(sec / 100);
        let dec = Math.trunc(sec / 10);
        let nat = sec % 10;

        fTm.className = timerClass[hun];
        sTm.className = timerClass[dec];
        tTm.className = timerClass[nat];
    };

    const initTimer = () => {
        if(s < 999){
            s+=1;
        }
        updTimer(s);
    };

    let timerId = setInterval(initTimer, 1000);

    const fillWithMines = (ind) => {
        const mines = [...Array(cellsCount).keys()].filter(el => el !== ind).sort(() => Math.random() - 0.5).slice(0, minesCount);
        return mines;
    };

    const findIndex = (col, row) => row * w + col;

    const checkMine = (col, row) => {
        if (checkValid(col, row)){
            const ind = findIndex(col, row);
            return mines.includes(ind);
        }
        return false;
    };

    const getMinesCount = (col, row) => {
        let count = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++){
                if (checkMine(col + i, row + j)) {
                    count++;
                }
            }
        }
        return count;
    };

    const checkValid = (col, row) => {
        return col >= 0 && row >= 0 && col < h && row < w;
    };
    const openCell = (col, row) => {
        if (!checkValid(col, row)) return;

        const ind = findIndex(col, row);
        const cell = cells[ind];
        const count = getMinesCount(col, row);

        if(cell.classList.contains('cell-op')) return;

        if (checkMine(col, row)) {
            cell.className = 'bomb-red';
            looseGame();
            return;
        }

        if(cell.classList.contains('flag')) minesLeft++;
        updMinesCount(minesLeft);

        if (count !== 0){
            cell.className = numClass[count];
            return;
        }

        cell.className = 'cell-op';
        cell.innerHTML = '';

        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                openCell(col + j, row + i);
            }
        }
    };

    function updMinesCount(count) {
        let hun = Math.trunc(count / 100);
        let dec = Math.trunc(count / 10);
        let nat = count % 10;

        fMn.className = timerClass[hun];
        sMn.className = timerClass[dec];
        tMn.className = timerClass[nat];
    }

    const leftBtnClick = (e) => {
        const ind = cells.indexOf(e.target)
        console.log(ind);

        if(isGameStarted === false) {
            mines = fillWithMines(ind);
            isGameStarted = true;
        }
        if(e.target.tagName !== "BUTTON") {
            return;
        }

        const col = ind % w;
        const row = Math.floor(ind / w);
        openCell(col, row);
    }

    const rightBtnClick = (e) => {
        const cell = e.target;

        switch(cell.className){
            case 'cell-cl':
                if(minesLeft > 0){
                    cell.className = 'flag';
                    minesLeft = minesLeft > 0 ? minesLeft - 1 : 0;
                    updMinesCount(minesLeft);
                }
                break;
            case 'flag':
                cell.className = 'question';
                minesLeft = minesLeft < minesCount ? minesLeft + 1 : minesLeft;
                updMinesCount(minesLeft);
                break;
            case 'question':
                cell.className = 'cell-cl';
                break;
        }
    };

    const winGame = () => {
        win = true;
        console.log(win);
        closed.forEach(el => el.className = 'flag');
        minesLeft = 0;
        updMinesCount(minesLeft);
        clearInterval(timerId);
    };

    const looseGame = () => {
        mines.forEach((el) => cells[el].className = 'bomb');
        cells.filter((el) => el.className === 'flag').forEach(el => el.className = 'bomb-crossed');
        loose = true;
        clearInterval(timerId);
    };

    const restart = (e) => {
        removeClass(reset);
        e.target.classList.add('fine');
        cells.forEach(el => el.className = 'cell-cl');
        s = 0;
        updTimer(s);
        mines = [];
        isGameStarted = false;
        win = false;
        loose = false;
        minesLeft = minesCount
        updMinesCount(minesLeft)
        clearInterval(timerId);
        timerId = setInterval(initTimer, 1000);
    }

    const removeClass = (el) => {
        el.classList.remove('fine');
        el.classList.remove('win');
        el.classList.remove('loose');
        el.classList.remove('scared');
        el.classList.remove('fine-cl');
    }

    field.addEventListener('mousedown', (e) => {
        if(win === false && loose === false) {
            switch(e.button){
                case 0:
                    if(e.target.className === 'cell-cl'){
                        console.log('leftclick');
                        leftBtnClick(e);
                        removeClass(reset);
                        reset.classList.add('scared');
                        const closed = cells.filter(el => el.className === 'cell-cl' || el.className === 'flag');
                        if(closed.length === minesCount) {
                            winGame();
                        }
                    }
                    break;
                case 2:
                    rightBtnClick(e);
                    break;
            }
        }
    });

    field.addEventListener('mouseup', () => {
        removeClass(reset);
        reset.classList.add('fine')
        if(loose){
            removeClass(reset);
            reset.classList.add('loose')
        }
        if(win){
            removeClass(reset);
            reset.classList.add('win');
        }
    });

    reset.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.target.classList.add('fine-cl');
    });

    reset.addEventListener('mouseup', (e) => {
        restart(e);
    })

}
    // reset.addEventListener('mousedown', () => start(16,16,5))
document.body.addEventListener("contextmenu", (e) => {e.preventDefault(); return false;});
document.addEventListener("DOMContentLoaded", start(16, 16, 40));
