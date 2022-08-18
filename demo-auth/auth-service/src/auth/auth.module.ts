import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [ClientsModule.register([{
    name: 'USER_CLIENT',
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 4010,
    },
  }]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: jwtConstants.secret }
  })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
