start()
function start() {
    const minesCount = 40;
    const w = h = 16;
    const cellsCount = w * h;
    const field = document.querySelector('.field');
    field.innerHTML = '<button></button>'.repeat(cellsCount);
    const cells = [...field.children];

    const mines = [...Array(cellsCount).keys()].sort(() => Math.random() - 0.5).slice(0, minesCount);
    console.log(mines)
    cells.forEach((el, i) => el.innerHTML = i);
    const findIndex = (col, row) => row * w + col;

    const checkMine = (col, row) => {
        const ind = findIndex(col, row);
        return mines.includes(ind);
    };

    const findAdjacents = (col, row) => {
        const adjs = [];
        const isMore = (num) => {
            return num >= 0;
        }
        const isLess = (num) => {
            return num <= 255;
        }
        function IndColRight(ind){
            return findIndex(col + 1, row + ind)
        }
        function IndColLeft(ind){
            return findIndex(col - 1, row + ind)
        }

        const indRowUp = findIndex(col, row - 1);
        const indRowDown = findIndex(col, row + 1);
        if (col === 0 && row === 0) {
            adjs.push(indRowDown)
            for(let i = 0; i < 2; i++){
                let indRight = IndColRight(i);
                adjs.push(indRight);
            }
        }
        else if (col === 0 && row === 15) {
            adjs.push(indRowUp)
            for(let i = -1; i < 1; i++){
                let indRight = IndColRight(i);
                adjs.push(indRight);
            }
        }
        else if (col === 15 && row === 0) {
            adjs.push(indRowDown)
            for(let i = 0; i < 2; i++){
                let indLeft = IndColLeft(i);
                adjs.push(indLeft);
            }
        }
        else if (col === 15 && row === 15) {
            adjs.push(indRowDown)
            for(let i = -1; i < 1; i++){
                let indLeft = IndColLeft(i);
                adjs.push(indLeft);
            }
        }
        else if (col === 0) {
            if (isMore(indRowUp)){
                adjs.push(indRowUp);
            }
            if (isLess(indRowDown)) {
                adjs.push(indRowDown);
            }
            for(let i = -1; i < 2; i++){
                let indRight = IndColRight(i);
                if (isMore(indRight) && isLess(indRight)){
                    adjs.push(indRight);
                }
            }
        }
        else if (col === 15) {
            if (isMore(indRowUp)){
                adjs.push(indRowUp);
            }
            if (isLess(indRowDown)){
                adjs.push(indRowDown);
            }
            for(let i = -1; i < 2; i++){
                let indLeft = IndColLeft(i);
                if (isMore(indLeft) && isLess(indLeft)){
                    adjs.push(indLeft);
                }
            }
        }

        else if (row === 0) {
            adjs.push(indRowDown);
            for(let i = -1; i < 2; i++){
                let indRight = IndColRight(i);
                let indLeft = IndColLeft(i)
                if (isMore(indRight)){
                    adjs.push(indRight);
                }
                if (isMore(indLeft)){
                    adjs.push(indLeft);
                }
            }
        }
        else if (row === 15) {
            adjs.push(indRowUp);
            for(let i = -1; i < 2; i++){
                let indRight = IndColRight(i);
                let indLeft = IndColLeft(i)
                if (isLess(indRight)){
                    adjs.push(indRight);
                }
                if (isLess(indLeft)){
                    adjs.push(indLeft);
                }
            }
        } else {
            adjs.push(indRowUp, indRowDown)
            for(let i = -1; i < 2; i++){
                let indRight = IndColRight(i);
                let indLeft = IndColLeft(i)
                adjs.push(indLeft, indRight)
            }
        }

        console.log(adjs);
    }

    field.addEventListener('click', (e) => {
        // if(e.target !== button) {
        //     return;
        // }
        const ind = cells.indexOf(e.target)
        console.log(ind, 'ind');
        const col = ind % w;
        const row = Math.floor(ind / w);
        console.log(col, 'col');
        console.log(row, 'row');
        if (checkMine(col, row)) {
            e.target.innerHTML = 'x'
        } else {
            console.log(e.target)
            e.target.classList.add('opened');
            const empAdjs = findAdjacents(col, row);
            // empAdjs.forEach(el => el.classList.add('opened'));
        }
    });

}
