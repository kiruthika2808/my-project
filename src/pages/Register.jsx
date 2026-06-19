import { AuthPage } from "./Login";

export default function Register() {
  return <AuthPage mode="Register" title="Create a private design profile." button="Create Account" alternate="Already registered?" alternateLink="/login" alternateText="Sign in" />;
}
