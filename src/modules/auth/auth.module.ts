import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import{ JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from 'src/guard/jwt.strategy';

@Module({

  imports :[
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: "1|WyPnvJqDbsxiHtJfV4DX04ViFZe6GEjOLKXnpZbYPAQSaJxghE82FAuiNcIuTe5NWXKM2cbJTKB0OuIq2ozUED6s5imKASXEwQn6oZMAuHGZUMozKcRnABwIGsVPIrR0pGDas1YHnWKh98lQROgCEKOYWjjYCM8LXk2rVd5rr8rVN6TImkFcU7LtHeKvjO1ol0OKRvlruT31Eg7TtSpGZv5MYhLD9Q6z36XfL7MIhoZ",
      signOptions: {expiresIn:'1d'}
    })
  ],

  
  providers: [AuthService,JwtStrategy],
  exports: [PassportModule, AuthService]
})
export class AuthModule {}
