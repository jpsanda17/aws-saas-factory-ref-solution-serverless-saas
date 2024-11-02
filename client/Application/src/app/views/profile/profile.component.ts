import { Component, OnInit } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserProfile } from './models/userProfile';
import { Auth } from 'aws-amplify';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfileKeys: (keyof UserProfile)[] = ['username', 'tenantId', 'tenantTier', 'userRole', 'email', 'emailVerified', 'phoneNumber'];
  
  displayLabels: { [key: string]: string } = {
    username: 'Username',
    tenantId: 'Tenant Id',
    tenantTier: 'Tenant Tier',
    userRole: 'User Role',
    email: 'Email',
    emailVerified: 'Email Verified',
    phoneNumber: 'Phone Number'
  };

  userProfile$: Observable<UserProfile | undefined>;

  constructor() {}

  ngOnInit(): void {
    try {
      const s = Auth.currentSession().catch((err) => {
        console.log('Failed to get current session. Err: ', err);
        return err;
      });
      const session$ = from(s);

      const token$ = session$.pipe(
        map((sesh) => sesh && typeof sesh.getIdToken === 'function' ? sesh.getIdToken() : undefined)
      );

      this.userProfile$ = token$.pipe(
        map((token) => token ? {
          username: token.payload['cognito:username'],
          tenantId: token.payload['custom:tenantId'],
          tenantTier: token.payload['custom:tenantTier'],
          userRole: token.payload['custom:userRole'],
          email: token.payload['email'],
          emailVerified: token.payload['email_verified'],
          phoneNumber: token.payload['phone_number']
        } as UserProfile : undefined)
      );

    } catch (err) {
      console.error('Unable to get current session.', err);
    }
  }
}
