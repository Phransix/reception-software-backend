import { Test, TestingModule } from '@nestjs/testing';
import { PurposeController } from './purpose.controller';
import { PurposeService } from './purpose.service';

describe('PurposeController', () => {
  let controller: PurposeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurposeController],
      providers: [PurposeService],
    }).compile();

    controller = module.get<PurposeController>(PurposeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
