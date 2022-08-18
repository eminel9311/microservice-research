import { Inject, Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { compareSync } from 'bcrypt';
import { catchError, firstValueFrom, map, of, throwError, timeout, TimeoutError } from 'rxjs';


@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT')
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string) {
    try {
      const user = await firstValueFrom(this.client.send({ role: 'user', cmd: 'get' }, { username })
        .pipe(map(res => res))
        .pipe(
          timeout(5000),
          catchError(err => {
            if (err instanceof TimeoutError) {
              return throwError(() => new RequestTimeoutException());
            }
            return throwError(() => err);
          })
        )
      );
      if (compareSync(password, user?.password)) {
        return user;
      }
      return null;

    } catch (e) {
      Logger.log(e);
      throw e;
    }
  }
  async login(user: any) {
    const payload = { user, sub: user?.id };
    return {
      userId: user.id,
      accessToken: this.jwtService.sign(payload),
    }
  }
}
