import "./index.scss";

const server = "http://localhost:3042";
const axios = require('axios');
const ALCHEMY_URL = "https://eth-mainnet.alchemyapi.io/v2/1pk3z4xn7RgT4dW2oR6x_BuRGgPxlVxI";

async function updateBlock() {
  await axios.post(ALCHEMY_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_blockNumber",
    params: [
      "0xb443", // block 46147
      false  // retrieve the full transaction object in transactions array
    ]
  }).then((response) => {
    console.log(`from updateBlock: ${response.data.result}`);
//    let num = parseInt(response.data.result, 16);
    let num = response.data.result; 
    document.getElementById("balance").innerHTML = num; 
    return response.data.result;
  });
}

async function getLatestBlock() {
  let latestBlock = document.getElementById("balance").innerHTML;
  if(latestBlock === 0) {
    return;
  }
  console.log(`querying block: ${latestBlock}`);

  await axios.post(ALCHEMY_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_getBlockByNumber",
    params: [
//      "0xb443", 
      latestBlock, 
      false  // retrieve the full transaction object in transactions array
    ]
  }).then((response) => {
    res = `miner: ${response.data.result.miner}, 
           parentHash: ${response.data.result.parentHash};
           size: ${response.data.result.size}`;

//    console.log(res);
//    console.log(`from getLatestBlock: ${response.data.result}`);
//    document.getElementById("block-data").innerHTML = JSON.stringify(response.data.result); 
    document.getElementById("block-data").innerHTML = res; 
    return response.data.result;
  });
}

setInterval(updateBlock, 5000);
setInterval(getLatestBlock, 5000);

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  console.log('exchange-address listner called'); 

  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    let foo = 10;
//    document.getElementById("balance").innerHTML = balance;
    document.getElementById("balance").innerHTML = 9876;
  });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const sigR = document.getElementById("send-sig-r").value;
  const sigS = document.getElementById("send-sig-s").value;
  const recipient = document.getElementById("recipient").value;

  console.log(`sigR: ${sigR}, sigS: ${sigS}`);

  const body = JSON.stringify({
    sender, amount, sigR, sigS, recipient
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});
