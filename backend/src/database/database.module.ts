import { Module, Global } from '@nestjs/common';
import { InMemoryDatabase } from './in-memory.database';

@Global()
@Module({
  providers: [InMemoryDatabase],
  exports: [InMemoryDatabase],
})
export class DatabaseModule {}
