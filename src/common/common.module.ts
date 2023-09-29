import { Module } from '@nestjs/common';
import { AxiosAdapter } from './http-adapters/axios.adpater';

@Module({
    providers:[ AxiosAdapter],
    imports:[],
    exports:[AxiosAdapter]
})
export class CommonModule {}
