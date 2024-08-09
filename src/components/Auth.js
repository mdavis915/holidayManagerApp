import React from 'react';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);

const Auth = () => (
  <AmplifyAuthenticator>
    <div>
      <h1>Holiday Manager</h1>
      <AmplifySignOut />
    </div>
  </AmplifyAuthenticator>
);

export default Auth;
