const analyticsScripts: React.DetailedHTMLProps<
  React.ScriptHTMLAttributes<HTMLScriptElement>,
  HTMLScriptElement
>[] = [
  {
    src: "https://www.googletagmanager.com/gtag/js?id=G-BGV8RCHJPH",
  },
  {
    children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-BGV8RCHJPH');`,
  },
]
