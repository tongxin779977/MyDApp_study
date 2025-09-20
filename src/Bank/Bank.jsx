import * as React from 'react';
import '../App.css';
import { Button, Input, Textarea } from '@mui/joy';
import { useState } from 'react';
import wb3 from 'web3';
import ABI from '../../ABI.json';
import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
// import './Bank.css';

function App() {
    //初始化参数
    const [address, setAddress] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [bankContract, setBankContract] = useState(null);
    const [balance, setBalance] = useState(null);
    const [depositAmount, setDepositAmount] = useState(null);
    const [withdrawAmount, setWithdrawAmount] = useState(null);
    const [transferAmount, setTransferAmount] = useState(null);
    const [transferAddress, setTransferAddress] = useState(null);

    //公共校验 -- 是否连接钱包
    const checkWallet = async () => {
        if (!bankContract || !address) {
            alert('请先连接钱包');
            return;
        }
    };


    //查询余额
    const getBalance = async () => {
        checkWallet();
        const result = await bankContract.methods.checkTheBalance().call({ from: address });
        console.log('查询余额：', result);
        setBalance(result);
    }

    //存入金额
    const deposit = async () => {
        checkWallet();
        console.log('存入金额：', depositAmount);
        await bankContract.methods.deposlit(depositAmount).send({ from: address });
    }

    //取款
    const withdraw = async () => {
        checkWallet();
        await bankContract.methods.withdraw(withdrawAmount).send({ from: address });
    }

    //转账
    const transfer = async () => {
        checkWallet();
        await bankContract.methods.transfer(transferAddress, transferAmount).send({ from: address });
    }

    //连接web3钱包
    const connectWallet = async () => {
        //1连接web3
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
        });
        setAddress(accounts[0]);

        //2创建web3实例
        const web3 = new wb3(window.web3.currentProvider);
        setWeb3(web3);

        //3创建合约实例
        const bankContract = new web3.eth.Contract(ABI, '0xc465b1963dB8cE563Cfd79Ada1F6aC3309E54b3a');
        setBankContract(bankContract);
    }
    return (
        <Box component="section" sx={{ p: 2 }} className='my-background'>
            <h1>银行DApp</h1>
            <section>
                <Textarea
                    value={address ? `当前钱包地址：${address}` : '请连接钱包'}
                    required
                    disabled
                    sx={{ mb: 1 }}
                />
                <Button onClick={connectWallet}>{address ? '断开钱包' : '连接钱包'}</Button>

                <box>
                    <section>
                        <FormControl>
                            <FormLabel class='vertical-align:middle;'>当前余额￥(人民币):</FormLabel>
                            <Input class='vertical-align:middle;display:inline-block;' placeholder={balance ? `${balance}` : '0'} disabled />
                        </FormControl>
                        <button onClick={getBalance}>查询余额</button>
                    </section>
                </box>

                <box>
                    <section>
                        <FormControl>
                            <FormLabel class='vertical-align:middle;'>存入金额￥(人民币):</FormLabel>
                            <Input onChange={(e) => setDepositAmount(e.target.value)} class='vertical-align:middle;display:inline-block;' placeholder="存入金额" />
                        </FormControl>
                        <button onClick={deposit}>存入银行</button>
                    </section>
                </box>

                <box>
                    <section>
                        <FormControl>
                            <FormLabel class='vertical-align:middle;'>取款金额￥(人民币):</FormLabel>
                            <Input onChange={(e) => setWithdrawAmount(e.target.value)} class='vertical-align:middle;display:inline-block;' placeholder="取款金额" />
                        </FormControl>
                        <button onClick={withdraw}>取出银行</button>
                    </section>
                </box>

                <box>
                    <section>
                        <FormControl>
                            <FormLabel class='vertical-align:middle;'>转账地址:</FormLabel>
                            <Input onChange={(e) => setTransferAddress(e.target.value)} class='vertical-align:middle;display:inline-block;' placeholder="转账地址" />
                            <FormLabel class='vertical-align:middle;'>转账金额￥(人民币):</FormLabel>
                            <Input onChange={(e) => setTransferAmount(e.target.value)} class='vertical-align:middle;display:inline-block;' placeholder="转账金额" />
                        </FormControl>
                        <button onClick={transfer}>转账</button>
                    </section>
                </box>

            </section>
        </Box>
    )
}

export default App;