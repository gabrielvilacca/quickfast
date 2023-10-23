import { useEffect } from "react";
import AppRoutes from "./AppRoutes";
import { getUniqueId } from "@/utils/getUniqueId";
import ReactPixel from "react-facebook-pixel";
import { getCookie } from "@/utils/getCookie";

function App() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    const options = {
      autoConfig: true,
      debug: true,
    };

    // Unique Event ID para deduplicação
    const uniqueEventId = getUniqueId(); // Adicione sua função para gerar ID único aqui

    ReactPixel.init("PIXEL", {}, options); // TODO: Substituir "PIXEL" pelo ID do seu pixel
    fbq("track", "PageView", {}, { eventID: uniqueEventId });

    // Seus próprios cookies para fbp e fbc
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");

    // Chamada API para enviar evento de PageView para seu próprio endpoint
    fetch("URL_FACEBOOKCAPI", {
      // TODO: Substituir "URL_FACEBOOKCAPI" pela URL do seu endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_name: "PageView",
        fbp: fbp,
        fbc: fbc,
        event_id: uniqueEventId,
        action_source: "website",
        event_source_url: window.location.href.split("?")[0],
        user_agent: navigator.userAgent,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Houve um erro no envio:", error));
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    // Parâmetros que você quer capturar
    const parameters = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "sck",
      "ref",
    ];

    // Loop para salvar cada parâmetro em um cookie, se ele existir
    parameters.forEach((param) => {
      const value = urlParams.get(param);
      if (value) {
        setCookie(param, value, 60); // Salvando o valor em um cookie que expira em 60 dias
      }
    });
  }, [window.location.search]);

  return <AppRoutes />;
}

export default App;
