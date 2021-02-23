import {DAIOPCPool,DAIOPSPool} from '../api/deployments/deployments.mainnet';
export const pair = [
    {
        name:'OPC-DAI-LP',
        stakeName:'OPC_DAI-UNI-LPv2',
        pool:DAIOPCPool,
        deposit:'OPC',
        uniPiar:'OPC_DAI'
    },
    {
        name:'OPS-DAI-LP',
        stakeName:'OPS_DAI-UNI-LPv2',
        pool:DAIOPSPool,
        deposit:'OPS',
        uniPiar:'OPS_DAI'
    }
]