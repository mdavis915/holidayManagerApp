import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import {
  Authenticator,
  useAuthenticator,
  useTheme,
  View,
  Heading,
  Button,
  Text,
  Image,
  ThemeProvider,
  defaultTheme
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import HolidayForm from './components/HolidayForm';
import HolidayTable from './components/HolidayTable';
import './styles.css'; // Import the CSS file

Amplify.configure(awsconfig);
const apiUrl = 'https://v6kpgrj4f7.execute-api.us-east-1.amazonaws.com/prod/addholiday';

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          alt="Logo"
          src="/toco.png"
        />
      </View>
    );
  },
  Footer() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Text color={tokens.colors.neutral[80]}>
          &copy; All Rights Reserved
        </Text>
      </View>
    );
  },
  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Sign in to your account
        </Heading>
      );
    },
    Footer() {
      const { toForgotPassword } = useAuthenticator();

      return (
        <View textAlign="center">
          <Button
            fontWeight="normal"
            onClick={toForgotPassword}
            size="small"
            variation="link"
          >
            Reset Password
          </Button>
        </View>
      );
    },
  },
  ConfirmSignUp: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  SetupTotp: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  ConfirmSignIn: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  ForgotPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
  ConfirmResetPassword: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`} level={3}>
          Enter Information:
        </Heading>
      );
    },
    Footer() {
      return <Text>Footer Information</Text>;
    },
  },
};

const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
    },
  },
  signUp: {
    username: {
      placeholder: 'Enter your email',
    },
    password: {
      label: 'Password:',
      placeholder: 'Enter your Password:',
      isRequired: false,
      order: 2,
    },
    confirm_password: {
      label: 'Confirm Password:',
      order: 1,
    },
  },
  forceNewPassword: {
    password: {
      placeholder: 'Enter your Password:',
    },
  },
  forgotPassword: {
    username: {
      placeholder: 'Enter your email:',
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      placeholder: 'Enter your Confirmation Code:',
      label: 'New Label',
      isRequired: false,
    },
    confirm_password: {
      placeholder: 'Enter your Password Please:',
    },
  },
  setupTotp: {
    QR: {
      totpIssuer: 'test issuer',
      totpUsername: 'amplify_qr_test_user',
    },
    confirmation_code: {
      label: 'New Label',
      placeholder: 'Enter your Confirmation Code:',
      isRequired: false,
    },
  },
  confirmSignIn: {
    confirmation_code: {
      label: 'New Label',
      placeholder: 'Enter your Confirmation Code:',
      isRequired: false,
    },
  },
};

const App = () => {
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();
      console.log('Response Data:', responseData);

      let entries;
      if (typeof responseData === 'string') {
        entries = JSON.parse(responseData);
      } else if (responseData.body && typeof responseData.body === 'string') {
        entries = JSON.parse(responseData.body);
      } else {
        entries = responseData;
      }

      if (Array.isArray(entries)) {
        entries.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setEntries(entries);
      } else {
        throw new Error('Entries are not in array format');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch entries. Check the console for more details.');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Authenticator formFields={formFields} components={components} hideSignUp>
        {({ signOut }) => (
          <div className="App">
            <button className="sign-out-button" onClick={signOut}>Sign out</button>
            <div className="container">
              <main>
                <div className="form-container">
                  <HolidayForm fetchEntries={fetchEntries} />
                </div>
                <HolidayTable entries={entries} fetchEntries={fetchEntries} />
              </main>
            </div>
          </div>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
