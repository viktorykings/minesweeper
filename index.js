document.body.addEventListener("contextmenu", (e) => {e.preventDefault(); return false;});

    // const field = document.querySelector('.field');
    const fMn = document.querySelector('.f-mn');
    const sMn = document.querySelector('.s-mn');
    const tMn = document.querySelector('.t-mn');
    const sTm = document.querySelector('.s-tm');
    const tTm = document.querySelector('.t-tm');
    const fTm = document.querySelector('.f-tm');
    const timer = document.querySelector('.timer');
    const reset = document.querySelector('.reset');
    const main = document.querySelector('.main')
    const field = document.querySelector('#field')
    // const field = document.createElement('div')



    document.addEventListener("DOMContentLoaded", start(16, 16, 40))
// start(16,16,5)
function start(w, h, minesCount) {
    // field.classList.add('field')
    // main.append(field)
    console.log('newgame')
    let isGameStarted = false;
    let loose = false;
    let win = false;
    let s = 0
    const numClass = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    const timerClass = ['t-zero', 't-one', 't-two', 't-three', 't-four', 't-five', 't-six', 't-seven', 't-eight', 't-nine']

    const cellsCount = w * h;
    field.innerHTML = "<button class='cell-cl'></button>".repeat(cellsCount);
    const cells = [...field.children];
    let mines = []
    let minesLeft = minesCount;

    const updTimer = (sec) => {
        let hun = Math.trunc(sec / 100);
        let dec = Math.trunc(sec / 10);
        let nat = sec % 10

        fTm.className = timerClass[hun]
        sTm.className = timerClass[dec]
        tTm.className = timerClass[nat]
    }
    s = 0
    const initTimer = () => {
        if(s < 999){
            s+=1
        }
        updTimer(s)
    }
    const timerId = setInterval(initTimer, 1000);

    updMinesCount(minesLeft);


    const fillWithMines = (ind) => {
        const mines = [...Array(cellsCount).keys()].filter(el => el !== ind).sort(() => Math.random() - 0.5).slice(0, minesCount);
        return mines;
    }

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
    }
    const openCell = (col, row) => {
        if (!checkValid(col, row)) return;

        const ind = findIndex(col, row);
        const cell = cells[ind];

        if(cell.classList.contains('cell-op')) return;

        if (checkMine(col, row)) {
            mines.forEach((el) => cells[el].className = 'bomb')
            cells.filter((el) => el.className === 'flag').forEach(el => el.className = 'bomb-crossed')
            // cells.filter((el) => el.className === 'cell-cl').forEach(el => el.disabled = true)
            cell.className = 'bomb-red';
            loose = true;
            return;
        }

        const count = getMinesCount(col, row);
        if(cell.classList.contains('flag')) minesLeft++;
        updMinesCount(minesLeft);
        if (count !== 0){
            cell.className = numClass[count]
            return;
        }

        cell.className = 'cell-op'
        cell.innerHTML = '';

        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                openCell(col + j, row + i);
            }
        }

    }


    function updMinesCount(count) {
        let hun = Math.trunc(count / 100);
        let dec = Math.trunc(count / 10);
        let nat = count % 10;

        fMn.className = timerClass[hun]
        sMn.className = timerClass[dec]
        tMn.className = timerClass[nat]
        // fMn.classList.add(timerClass[hun])
        // sMn.classList.add(timerClass[dec])
        // tMn.classList.add(timerClass[nat])
    }
    // console.log(showMinesCount(minesLeft()))
    const leftBtnClick = (e) => {
        const ind = cells.indexOf(e.target)
        console.log(ind);

        if(isGameStarted === false) {
            mines = fillWithMines(ind)
            isGameStarted = true;
        }
        if(e.target.tagName !== "BUTTON") {
            return;
        }
        const col = ind % w;
        const row = Math.floor(ind / w);
        console.log(ind, 'ind');
        console.log(col, 'col');
        console.log(row, 'row');
        openCell(col, row)
    }
    const rightBtnClick = (e) => {
        const cell = e.target;
        console.log(cell.className)
        if(cell.className === 'cell-cl'){
            console.log('click empty');
            if(minesLeft > 0){
                cell.className = 'flag';
                minesLeft = minesLeft > 0 ? minesLeft - 1 : 0;
                updMinesCount(minesLeft);
            }
        }
        else if(cell.className === 'flag'){
            console.log('click flag');
            cell.className = 'question';
            minesLeft = minesLeft < minesCount ? minesLeft + 1 : minesLeft;
            updMinesCount(minesLeft);
        }
        else if(cell.className === 'question'){
            console.log('click question');
            cell.className = 'cell-cl';
        } else return

        // switch(cell.className) {
        //     case 'cell-cl':
        //         if(minesLeft > 0){
        //             cell.className = 'flag';
        //             minesLeft = minesLeft > 0 ? minesLeft - 1 : 0;
        //             updMinesCount(minesLeft);

        //         }
        //         break;
        //                         //check if win
        //     case 'flag':
        //             cell.className = 'question';
        //             minesLeft = minesLeft < minesCount ? minesLeft + 1 : minesLeft;
        //         updMinesCount(minesLeft);

        //         break;
        //     case 'question':
        //         cell.className = 'cell-cl';
        //         break;
        //     default: break
        // }
    }

    field.addEventListener('mousedown', (e) => {
        console.log('click field');
        switch(e.button){
            case 0:
                if(e.target.className === 'cell-cl'){
                    console.log('leftclick');
                    leftBtnClick(e);
                    reset.classList.remove('fine')
                    reset.classList.add('scared')
                    const closed = cells.filter(el => el.className === 'cell-cl' || el.className === 'flag')
                    console.log(closed);
                    if(closed.length === minesCount) {
                        win = true;
                        console.log(win)
                        closed.forEach(el => el.className = 'flag')
                        minesLeft = 0
                        updMinesCount(minesLeft)
                        clearInterval(timerId)
                    }
                }
                break;
            case 2:
                rightBtnClick(e);
                break;
        }
    });

    field.addEventListener('mouseup', (e) => {
        reset.classList.add('fine')
        reset.classList.remove('scared')
        reset.classList.remove('win')
        reset.classList.remove('loose')
        if(loose){
            reset.classList.remove('fine');
            reset.classList.add('loose')
        }
        if(win){
            reset.classList.remove('fine');
            reset.classList.add('win');
        }

    })
    reset.addEventListener('mousedown', (e) => {
        e.preventDefault()
        e.target.classList.add('fine-cl')
    })
    reset.addEventListener('mouseup', (e) => {
        e.target.classList.add('fine')
        e.target.classList.remove('fine-cl')
        e.target.classList.remove('win')
        clearInterval(timerId);
        cells.forEach(el => el.className = 'cell-cl')
        s = 0
        updTimer(s)
        mines = []
        isGameStarted = false
        win = false
        loose = false
        minesLeft = minesCount
        updMinesCount(minesLeft)
        // start(16,16,5)
    })

}
    // reset.addEventListener('mousedown', () => start(16,16,5))

