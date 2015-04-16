export default class StartUp {
  constructor(xhrGet, xhrGetDefaultKata) {
    this.xhrGet = xhrGet;
    this.xhrGetDefaultKata = xhrGetDefaultKata;
  }

  loadSourceCode(withSourceCode) {
    const {xhrGet, xhrGetDefaultKata} = this;
    const queryString = window.location.hash.replace(/^#\?/, '');

    const getSourceCode = () => {
      var kataUrl = getKataUrl();
      var sourceCode = localStorage.getItem('code');
      if (kataUrl) {
        loadKataFromUrl(kataUrl, withSourceCode);
      } else if (sourceCode) {
        withSourceCode(sourceCode);
      } else {
        loadDefaultKata(withSourceCode);
      }
      window.location.hash = window.location.hash.replace(/kata=([^&]+)/, '');
    };

    const loadDefaultKata = (onLoaded) => {
      xhrGetDefaultKata(
        (_, {status}) => onLoaded(`// Kata at "${kataUrl}" not found (status ${status})\n// Maybe try a different kata (see URL).`),
        data => {onLoaded(data)}
      );
    };

    const loadKataFromUrl = (kataUrl, onLoaded) => {
      xhrGet(
        kataUrl,
        (_, {status}) => onLoaded(`// Kata at "${kataUrl}" not found (status ${status})\n// Maybe try a different kata (see URL).`),
        data => {onLoaded(data)}
      );
    };

    const getKataUrl = () => {
      var kataName = queryString.match(/kata=([^&]+)/);
      if (kataName && kataName.length === 2) {
        kataName = kataName[1];
        return `http://${process.env.KATAS_SERVICE_DOMAIN}/katas/${kataName}.js`;
      }
    };

    getSourceCode();
  }
}
