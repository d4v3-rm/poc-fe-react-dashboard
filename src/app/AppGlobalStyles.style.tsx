export const AppGlobalStyles = () => (
  <style>
    {`
      :root,
      html,
      body,
      #root {
        height: 100%;
        margin: 0;
        padding: 0;
        width: 100%;
      }

      body {
        overflow: hidden;
      }

      :root {
        scrollbar-width: thin;
        scrollbar-color: var(--app-scrollbar-thumb) var(--app-scrollbar-track);
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: var(--app-scrollbar-thumb) var(--app-scrollbar-track);
      }

      *::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      *::-webkit-scrollbar-track {
        background: var(--app-scrollbar-track);
        border-radius: 999px;
      }

      *::-webkit-scrollbar-thumb {
        background: linear-gradient(
          180deg,
          var(--app-scrollbar-thumb),
          var(--app-scrollbar-thumb-strong)
        );
        border: 2px solid var(--app-scrollbar-track);
        border-radius: 999px;
      }

      *::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(
          180deg,
          var(--app-scrollbar-thumb-hover),
          var(--app-scrollbar-thumb-strong)
        );
      }
    `}
  </style>
);
