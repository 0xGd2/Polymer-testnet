const axios = require('axios');
const path = require('path');
const configRelativePath = process.env.CONFIG_PATH || 'config.json';
const configPath = path.join(__dirname, '..' , configRelativePath);
const config = require(configPath);

async function getIbcApp (network, isUniversal) {
  const ibcAppAddr = isUniversal ? config["sendUniversalPacket"][`${network}`]["portAddr"] : config["sendPacket"][`${network}`]["portAddr"];
  const contractType = config["deploy"][`${network}`];

  const ibcApp = await hre.ethers.getContractAt(
      `${contractType}`,
      ibcAppAddr
  );
  return ibcApp;
}

async function fetchABI(explorerUrl, contractAddress) {
  try {
    const response = await axios.get(`${explorerUrl}api/v2/smart-contracts/${contractAddress}`);
    if (response.status === 200) {
      const abi = response.data.abi;
      return abi;
    } else {
      console.error(`Failed to fetch ABI, status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching ABI:', error);
    return null;
  }
}

function areAddressesEqual(address1, address2) {
  // Normalize addresses to checksummed format

  // const checksumAddress1 = ethers.utils.getAddress(address1);
  // const checksumAddress2 = ethers.utils.getAddress(address2);

  // Compare addresses
  const areEqual = address1 === address2;
  return areEqual;
}

function determineNewDispatcher (beforeFlip) {
  const proofsEnabled = config.proofsEnabled === true;
  const xOR = (proofsEnabled || beforeFlip) && !(proofsEnabled && beforeFlip);
  let newDispatcher;
  if (networkName === "optimism") {
      newDispatcher = xOR ? process.env.OP_DISPATCHER : process.env.OP_DISPATCHER_SIM;
  } else if (networkName === "base") {
      newDispatcher = xOR ? process.env.BASE_DISPATCHER : process.env.BASE_DISPATCHER_SIM;
  } else {
      console.error("Invalid network name");
      process.exit(1);
  }

  return newDispatcher;

}

function determineNewUcHandler (beforeFlip) {
  const proofsEnabled = config.proofsEnabled === true;
  const xOR = (proofsEnabled || beforeFlip) && !(proofsEnabled && bef);
  let newUcHandler;
  if (networkName === "optimism") {
      newUcHandler = xOR ? process.env.OP_UC_MW : process.env.OP_UC_MW_SIM;
  } else if (networkName === "base") {
      newUcHandler = xOR ? process.env.BASE_UC_MW : process.env.BASE_UC_MW_SIM;
  } else {
      console.error("Invalid network name");
      process.exit(1);
  }

  return newUcHandler;
}

module.exports = { fetchABI, getIbcApp, areAddressesEqual, determineNewDispatcher, determineNewUcHandler };