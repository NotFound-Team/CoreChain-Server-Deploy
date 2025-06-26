import Web3 from 'web3';
import { ConfigService } from '@nestjs/config';
export declare const BlockchainProvider: {
    provide: string;
    useFactory: (configService: ConfigService) => Promise<{
        web3: Web3<import("web3-eth").RegisteredSubscription>;
        contract: import("web3").Contract<({
            inputs: any[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
            name?: undefined;
            outputs?: undefined;
        } | {
            anonymous: boolean;
            inputs: {
                indexed: boolean;
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            type: string;
            stateMutability?: undefined;
            outputs?: undefined;
        } | {
            inputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            name: string;
            outputs: {
                internalType: string;
                name: string;
                type: string;
            }[];
            stateMutability: string;
            type: string;
            anonymous?: undefined;
        })[]>;
        account: string;
    }>;
    inject: (typeof ConfigService)[];
};
