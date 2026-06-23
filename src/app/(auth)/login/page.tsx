'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { signIn, signUp, type AuthState } from '../actions';

const initialState: AuthState = {};

function SubmitButton({ label, variant }: { label: string; variant: 'primary' | 'secondary' }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        variant === 'primary'
          ? 'w-full bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60'
          : 'w-full bg-secondary border border-border text-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-60'
      }
    >
      {pending ? 'Working…' : label}
    </button>
  );
}

export default function LoginPage() {
  const [signInState, signInAction] = useFormState(signIn, initialState);
  const [signUpState, signUpAction] = useFormState(signUp, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Agency OS
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your workspace
          </p>
        </div>

        <form action={signInAction} className="space-y-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <SubmitButton label="Sign in" variant="primary" />
          {signInState?.error && (
            <p className="text-xs text-red-400">{signInState.error}</p>
          )}
        </form>

        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            Create an account
          </summary>
          <form action={signUpAction} className="space-y-3 mt-3">
            <input
              name="full_name"
              type="text"
              required
              placeholder="Full name"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Password (min 6 chars)"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <SubmitButton label="Create account" variant="secondary" />
            {signUpState?.error && (
              <p className="text-xs text-red-400">{signUpState.error}</p>
            )}
            {signUpState?.message && (
              <p className="text-xs text-emerald-400">{signUpState.message}</p>
            )}
          </form>
        </details>
      </div>
    </div>
  );
}
