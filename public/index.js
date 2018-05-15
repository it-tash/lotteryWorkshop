let lotteryAddr;
// let lotteryABI;
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

    axios.get('/init')
        .then(res => {
            // console.log(res.data);
            lotteryAddr = res.data.addr;
            const lotteryABI = res.data.abi;
            const contractLottery = web3.eth.contract(lotteryABI);
            Lottery = contractLottery.at(lotteryAddr);

            Lottery.Winer((error, result) => {
                if (!error)
                    winnersDiv.innerHTML = result.args.name + ' : ' + result.args.pass;
            });

        })
        .catch(function (err) {
            alert(err.message);
        });


}


function enter () {
    const nameInp = document.getElementById('nameInp').value;
    const pasInp = Number(document.getElementById('pasInp').value);

    axios.post('/pass', {pasInp})
        .then(res => {
            passApr = res.data;
            if(!passApr) {
                info.innerHTML = "incorrect password";
            }else{
                console.log(nameInp);
                console.log(pasInp);
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
            }//else
        })
        .catch(function (err) {
            alert(err.message);
        });
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

