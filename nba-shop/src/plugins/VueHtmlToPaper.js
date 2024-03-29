function addStyles(win, styles) {
    styles.forEach((style) => {
      let link = win.document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("type", "text/css");
      link.setAttribute("href", style);
      win.document.getElementsByTagName("head")[0].appendChild(link);
    });
  }
  
  const VueHtmlToPaper = {
    install(app) {
      app.config.globalProperties.$htmlToPaper = (
        el,
        localOptions,
        cb = () => true
      ) => {
        let 
          defaultStyles = [];
        let {
          styles = defaultStyles
        } = 
            [
                'https://unpkg.com/kidlat-css/css/kidlat.css',
                'https://fonts.googleapis.com/css?family=Sarabun',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css'
            ]
  
        // If has localOptions
        // TODO: improve logic
        if (localOptions) {
          if (localOptions.styles) styles = localOptions.styles;
        }
  
        const element = window.document.getElementById(el);
  
        if (!element) {
          alert(`Element to print #${el} not found!`);
          return;
        }
  
        var ifprint = document.createElement("iframe");
        document.body.appendChild(ifprint);
        const win = ifprint.contentWindow;
        
        win.document.write(`
          <html>
            <head>
              <title>${window.document.title}</title>
              <style>
              *{
                font-family: "Sarabun"
              }
              </style>
            </head>
            <body>
              ${element.innerHTML}
            </body>
          </html>
        `);
  
        addStyles(win, styles);
        setTimeout(() => {
          win.document.close();
          win.focus();
          win.print();
          win.close();
          document.body.removeChild(ifprint);
          cb();
        }, 1);
  
        return true;
      };
    }
  };
  
  export default VueHtmlToPaper;