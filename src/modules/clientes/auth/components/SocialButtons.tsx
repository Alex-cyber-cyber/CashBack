type Props = {
  onGoogle: () => void;
  onGithub: () => void;
  onFacebook: () => void;
};

export default function SocialButtons({ onGoogle, onGithub, onFacebook }: Props) {
  return (
    <div className="d-flex justify-content-center gap-3 mt-3">
      {/* Google */}
      <button
        type="button"
        className="btn social-btn btn-google"
        onClick={onGoogle}
        aria-label="Google"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.7 0 7 1.3 9.6 3.8l6.4-6.4C35.7 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.9 6.1C12.3 14.7 17.6 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.1 24.5c0-1.7-.2-3.3-.6-4.9H24v9.3h12.4c-.5 2.7-2 5-4.4 6.6l6.8 5.3c4-3.7 6.3-9.1 6.3-16.3z"/>
          <path fill="#FBBC05" d="M10.4 28.9a14.6 14.6 0 0 1 0-9.8l-7.9-6.1A24 24 0 0 0 0 24c0 3.8.9 7.3 2.5 10.5l7.9-5.6z"/>
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.8-5.7l-6.8-5.3c-2 1.4-4.6 2.2-9 2.2-6.4 0-11.7-5.2-13.6-12l-7.9 5.6C6.5 42.6 14.6 48 24 48z"/>
        </svg>
      </button>

      {/* GitHub */}
      <button
        type="button"
        className="btn social-btn btn-github"
        onClick={onGithub}
        aria-label="GitHub"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" >
          <path
            fill="#181717"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
            1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
            0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0
            1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15
            0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19
            0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </button>

      {/* Facebook */}
      <button
        type="button"
        className="btn social-btn btn-facebook"
        onClick={onFacebook}
        aria-label="Facebook"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" >
          <path
            fill="#1877F2"
            d="M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.8-4
            1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.45 2.9h-2.35v7A10 10 0 0 0 22 12z"
          />
        </svg>
      </button>
    </div>
  );
}
