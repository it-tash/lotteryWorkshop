let Lottery;
let defaultAccount;
const info = document.getElementById('txStatus');
const winnersDiv = document.getElementById('winnersDiv');
window.addEventListener('load', function() {
    if (typeof web3 !== 'undefined') {
        web3js = new Web3(web3.currentProvider);
    } else {
        info.innerHTML = "setup MetaMask, please";
    }
    contractInit();
});

function contractInit() {
    if (typeof web3.eth.defaultAccount !== 'undefined') {
        defaultAccount = web3.eth.defaultAccount;
    } else {
        info.innerHTML = "enter your MetaMask account, please";
    }

    const contractLottery = web3.eth.contract(lotteryABI);
    Lottery = contractLottery.at(lotteryAddr);

    Lottery.Winer((error, result) => {
        if (!error)
            winnersDiv.innerHTML = result.args.name + ' : ' + result.args.pass;
    });
}


function enter () {
    const nameInp = document.getElementById('nameInp').value;
    const pasInp = Number(document.getElementById('pasInp').value);
    let passApr = false;

    db.map(pass=>{
       if (pasInp === pass) passApr = true;
    });

    if(!passApr) {
        info.innerHTML = "incorrect password";
        return;
    }

    Lottery.enter.sendTransaction(nameInp, pasInp,{
        to: lotteryAddr,
        from: defaultAccount,
        value:  web3.toWei('0.1', 'ether')
    }, (err, result) => {
        if (err) {
            console.error(err);
        }
        else {
            info.innerHTML = "Success";
            console.log('enter: ', result.valueOf());
        }
    })
}

function getPlayersArr() {
    let arrLength;
    const playersDiv = document.getElementById('playersDiv');
    playersDiv.innerHTML = '';
    info.innerHTML = '';
    Lottery.getPlayersLength.call(
        {
            to: lotteryAddr,
            from: defaultAccount,
        }, (err, result) => {
            if (err)
                console.error(error);
            else {
                arrLength = Number(result);

                for(let i=0; i < arrLength; i++) {
                    Lottery.players.call(i,
                        {
                            to: lotteryAddr,
                            from: defaultAccount,
                        }, (err, result) => {
                            if (err)
                                console.error(error);
                            else {
                                playersDiv.innerHTML += "<br \/>"+result;
                            }
                        });
                }
            }
        });
}

async function getWinner() {
    Lottery.getWiner.sendTransaction({
        to: lotteryAddr,
        from: defaultAccount,
    }, (err, result) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log("res win: ", result.toString())
            winnersDiv.innerHTML = 'Waiting on transaction complete... ';

        }
    });
}

