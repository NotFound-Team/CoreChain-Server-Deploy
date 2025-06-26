import { CreatePersonnelDto } from './create-personnel.dto';
import { AdjustmentDto } from 'src/users/dto/update-user.dto';
declare const UpdatePersonnelDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePersonnelDto>>;
export declare class UpdatePersonnelDto extends UpdatePersonnelDto_base {
    adjustment: AdjustmentDto;
}
export {};
