const hre = require('hardhat');

async function main() {
  const wbc = await hre.ethers.getContractAt('WBCToken', '0xf79e7330eF4DA9C567B8811845Ce9b0B75064456');
  const balance = await wbc.balanceOf('0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F');
  const supply = await wbc.totalSupply();
  const name = await wbc.name();
  const symbol = await wbc.symbol();
  
  console.log('='.repeat(50));
  console.log('WBC TOKEN - VERIFICACIÓN EN BLOCKCHAIN');
  console.log('='.repeat(50));
  console.log('Nombre:', name);
  console.log('Símbolo:', symbol);
  console.log('Total Supply:', hre.ethers.formatUnits(supply, 6), 'WBC');
  console.log('Balance Owner:', hre.ethers.formatUnits(balance, 6), 'WBC');
  console.log('='.repeat(50));
}

main().catch(console.error);
